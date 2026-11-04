import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { imageBase64, imageUrl, text, documentType } = await request.json();

    const geminiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    const openAiKey = process.env.OPENAI_API_KEY;

    if (!geminiKey && !openAiKey) {
      return NextResponse.json(
        { error: "No hay API Key configurada. Por favor agrega GEMINI_API_KEY o OPENAI_API_KEY en las variables de entorno." },
        { status: 500 }
      );
    }

    const extractionPrompt = `Eres un auditor bancario e IA especializada en documentos oficiales colombianos (Cédula de Ciudadanía al 150%, RUT de la DIAN, Carta Laboral, Certificado de Ingresos, Desprendibles de Pago de Nómina y Extractos Bancarios).
Documento analizado: ${documentType || "Documento financiero / Identificación"}.

Extrae TODOS los datos reales visibles del documento con total precisión. Si un dato no aparece explícitamente en el documento, deja una cadena vacía "" o null para números. NUNCA inventes información.

Devuelve ÚNICAMENTE un objeto JSON válido con este formato:
{
  "documentNumber": "Número de cédula o NIT (solo dígitos)",
  "documentType": "CC", "CE", "NIT" o "PASAPORTE",
  "firstName": "Primer nombre",
  "secondName": "Segundo nombre",
  "firstLastName": "Primer apellido",
  "secondLastName": "Segundo apellido",
  "clientName": "Nombre completo en orden: PrimerNombre SegundoNombre PrimerApellido SegundoApellido",
  "expeditionDate": "Fecha de expedición (ej: 14/08/2015)",
  "expeditionPlace": "Ciudad de expedición (ej: MEDELLÍN)",
  "birthDate": "Fecha de nacimiento (ej: 22/03/1988)",
  "birthPlace": "Lugar de nacimiento",
  "gender": "MASCULINO" o "FEMENINO",
  "rh": "Grupo sanguíneo RH (ej: O+, A+, etc.)",
  "maritalStatus": "soltero", "casado", "separado", "union_libre" o "viudo",
  "address": "Dirección de domicilio",
  "city": "Ciudad de residencia",
  "department": "Departamento de residencia",
  "phone": "Teléfono de contacto o celular",
  "email": "Correo electrónico",
  "economicActivity": "empleado", "pensionado", "independiente", "rentista", "comerciante" o "empresario",
  "companyName": "Nombre o Razón Social del empleador",
  "companyNit": "NIT del empleador con dígito de verificación si existe",
  "companyAddress": "Dirección del empleador",
  "companyPhone": "Teléfono del empleador",
  "jobPosition": "Cargo desempeñado",
  "contractType": "TÉRMINO INDEFINIDO", "TÉRMINO FIJO", "PRESTACIÓN DE SERVICIOS", etc.,
  "entryDate": "Fecha de ingreso a la empresa",
  "basicSalary": 0,
  "monthlyIncome": 0,
  "totalExpenses": 0,
  "totalAssets": 0,
  "totalLiabilities": 0
}`;

    // 1. PRIORIDAD: GOOGLE GEMINI (Gemini 2.5 Flash / 1.5 Flash) si GEMINI_API_KEY está configurada
    if (geminiKey) {
      try {
        let parts: any[] = [{ text: extractionPrompt }];

        if (text && typeof text === "string" && text.trim().length > 0) {
          parts.push({ text: `TEXTO EXTRAÍDO DEL DOCUMENTO:\n${text}` });
        } else if (imageBase64) {
          const cleanB64 = imageBase64.includes(",") ? imageBase64.split(",")[1] : imageBase64;
          const mimeMatch = imageBase64.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,/);
          const mimeType = mimeMatch ? mimeMatch[1] : "image/jpeg";
          parts.push({
            inlineData: {
              mimeType,
              data: cleanB64,
            },
          });
        } else if (imageUrl) {
          const imgResp = await fetch(imageUrl);
          if (imgResp.ok) {
            const buf = await imgResp.arrayBuffer();
            const b64 = Buffer.from(buf).toString("base64");
            const mimeType = imgResp.headers.get("content-type") || "image/jpeg";
            parts.push({
              inlineData: {
                mimeType,
                data: b64,
              },
            });
          }
        }

        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`;
        const geminiRes = await fetch(geminiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts }],
            generationConfig: {
              temperature: 0.1,
              responseMimeType: "application/json",
            },
          }),
        });

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          const rawText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
          const parsed = JSON.parse(rawText);
          return NextResponse.json({ success: true, provider: "google_gemini", data: parsed });
        } else {
          console.warn("Gemini API falló, reintentando con fallback...", await geminiRes.text());
        }
      } catch (geminiErr) {
        console.warn("Error en Gemini API, intentando con OpenAI:", geminiErr);
      }
    }

    // 2. FALLBACK O DEFAULT: OPENAI (GPT-4o Vision)
    if (openAiKey) {
      let userContent: any[] = [{ type: "text", text: extractionPrompt }];

      if (text && typeof text === "string" && text.trim().length > 0) {
        userContent.push({
          type: "text",
          text: `TEXTO EXTRAÍDO DEL DOCUMENTO:\n${text}`,
        });
      } else if (imageBase64) {
        userContent.push({
          type: "image_url",
          image_url: {
            url: imageBase64.startsWith("data:") ? imageBase64 : `data:image/jpeg;base64,${imageBase64}`,
            detail: "high",
          },
        });
      } else if (imageUrl) {
        userContent.push({
          type: "image_url",
          image_url: {
            url: imageUrl,
            detail: "high",
          },
        });
      }

      const openAiRes = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openAiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o",
          response_format: { type: "json_object" },
          messages: [
            {
              role: "system",
              content: "Eres un auditor financiero especializado en lectura de documentos colombianos. Extraes datos con 100% de precisión y respondes estrictamente en JSON.",
            },
            {
              role: "user",
              content: userContent,
            },
          ],
          temperature: 0.1,
        }),
      });

      if (!openAiRes.ok) {
        const errText = await openAiRes.text();
        return NextResponse.json({ error: `AI API Error: ${errText}` }, { status: openAiRes.status });
      }

      const openAiData = await openAiRes.json();
      const rawJson = openAiData.choices?.[0]?.message?.content || "{}";
      const parsed = JSON.parse(rawJson);
      return NextResponse.json({ success: true, provider: "openai_gpt4o", data: parsed });
    }

    return NextResponse.json({ error: "No se pudo procesar el documento con ningún proveedor de IA" }, { status: 500 });
  } catch (err: any) {
    console.error("AI Scan Document API Error:", err);
    return NextResponse.json({ error: err?.message || "Error escaneando documento con IA" }, { status: 500 });
  }
}
