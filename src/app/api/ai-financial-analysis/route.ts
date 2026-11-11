import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { clientCase, documentsSummary, rawText } = body;

    const geminiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    const openAiKey = process.env.OPENAI_API_KEY;

    if (!geminiKey && !openAiKey) {
      return NextResponse.json(
        { error: "No hay API Key configurada para el análisis de IA." },
        { status: 500, headers: corsHeaders }
      );
    }

    const uploadedDocsCount = (documentsSummary || []).filter((d: any) => !!d.fileUrl).length;

    const systemPrompt = `Eres el Director de Riesgos Financieros y Auditoría de Crédito de Next Connection Group en Colombia.
Tu misión es evaluar con estricto rigor técnico y bancario (conforme a la Superintendencia Financiera de Colombia - SFC) si el cliente o empresa tiene capacidad real y probada para asumir la deuda solicitada.

🚨 REGLAS CRÍTICAS DE AUDITORÍA Y EVIDENCIA DOCUMENTAL:
1. ESTADO ACTUAL DE DOCUMENTOS ADJUNTOS EN ESTE EXPEDIENTE: ${uploadedDocsCount} documento(s) con archivo adjunto cargado.
   Detalle de documentos: ${JSON.stringify(documentsSummary || [])}

2. AUDITORÍA DOCUMENTAL OBLIGATORIA:
   - Si NO hay extractos bancarios, declaración de renta ni soportes de ingresos cargados (${uploadedDocsCount === 0 ? "CASO ACTUAL: 0 DOCUMENTOS ADJUNTOS" : "HAY DOCUMENTOS"}):
     * ESTÁ ESTRICTAMENTE PROHIBIDO emitir veredicto "VIABLE" ni otorgar scores altos (máximo 40/100).
     * El veredicto DEBE SER "VIABLE_CON_CONDICIONES" (si los números declarados lucen coherentes en teoría) o "NO_VIABLE" (si además el monto solicitado es elevado).
     * El nivel de riesgo ("riskLevel") DEBE SER "ALTO".
     * En "incomeAnalysis.verifiedIncome" debe colocarse 0, y en "notes" explicar: "Ingreso puramente declarado por el solicitante; NO verificado por falta de extractos bancarios o soportes fiscales."
     * El primer factor de riesgo ("riskFactors") DEBE SER: "⚠️ AUSENCIA CRÍTICA DE SOPORTES: No se han adjuntado extractos bancarios ni soportes de ingresos para validar el flujo de caja real."
     * La primera condición obligatoria ("conditionsAndRequirements") DEBE SER: "Radicación obligatoria de los 3 últimos extractos bancarios y declaración de renta para comprobar solvencia antes de cualquier radicación bancaria."
   - Si SÍ hay extractos y soportes cargados y verificados:
     * Evalúa el flujo de caja real demostrado. Si el DTI es <= 40% y los ingresos cubren la cuota con holgura, puedes emitir "VIABLE" con score acorde (70-95%).

3. Parámetros clave de riesgo crediticio colombiano:
   - Capacidad de pago libre = Ingresos verificados - Gastos fijos - Pasivos/cuotas actuales.
   - DTI (Debt to Income): Relación cuota total / ingreso. Máximo sano: 30% a 40%.
   - Aspectos Financieros Comparativos (Multi-anual: 2024, 2025, 2026 Proyectado):
     Reconstruye la matriz completa del Balance General, Estado de Resultados (PyG) y los 15 Ratios Financieros coherentes con la realidad económica del solicitante.

Información del solicitante analizado:
${JSON.stringify({ clientCase, documentsSummary, rawText, uploadedDocsCount }, null, 2)}

Devuelve ÚNICAMENTE un objeto JSON válido con la siguiente estructura:
{
  "verdict": ${uploadedDocsCount === 0 ? '"VIABLE_CON_CONDICIONES" | "NO_VIABLE"' : '"VIABLE" | "VIABLE_CON_CONDICIONES" | "NO_VIABLE"'},
  "viabilityScore": ${uploadedDocsCount === 0 ? 35 : 80}, // Si no hay documentos soporte, el score NUNCA puede superar 40
  "riskLevel": ${uploadedDocsCount === 0 ? '"ALTO"' : '"BAJO" | "MEDIO" | "ALTO"'},
  "executiveSummary": "Resumen técnico objetivo señalando la situación de solvencia y la presencia o carencia de soportes.",
  "incomeAnalysis": {
    "declaredIncome": 5000000,
    "verifiedIncome": ${uploadedDocsCount === 0 ? 0 : 5000000},
    "stability": ${uploadedDocsCount === 0 ? '"BAJA"' : '"ALTA" | "MEDIA"'},
    "notes": "Detalle sobre la fuente y si está o no demostrada con documentos."
  },
  "capacityAndDebt": {
    "estimatedMonthlyDebt": 800000,
    "fixedExpenses": 1500000,
    "freeCashFlow": 2900000,
    "currentDtiPercentage": 15.4,
    "projectedDtiPercentage": 32.8,
    "maxMonthlyInstallment": 1800000,
    "requestedMonthlyInstallmentEstimated": 950000,
    "maxRecommendedLoanAmount": 55000000
  },
  "strengths": [
    "Punto positivo"
  ],
  "riskFactors": [
    "Factor de riesgo (ej: ausencia de extractos si no los hay)"
  ],
  "conditionsAndRequirements": [
    "Condición indispensable para proceder"
  ],
  "recommendationsForAdvisor": [
    "Recomendación para el asesor"
  ],
  "suggestedBanks": [
    {
      "bank": "Bancolombia",
      "suitability": "ALTA" | "MEDIA",
      "reason": "Motivo",
      "estimatedTerm": "36 a 60 meses"
    }
  ],
  "financialAspects": {
    "unit": "Cifras en millones de COP",
    "periods": [
      { "year": "2024", "months": 12, "days": 360 },
      { "year": "2025", "months": 12, "days": 360 },
      { "year": "2026 (Proy.)", "months": 6, "days": 180 }
    ],
    "balanceSheet": {
      "caja": [764, 764, 16],
      "cuentasPorCobrarNetas": [554, 1180, 1853],
      "inventarios": [10333, 13487, 17555],
      "cuentasXCobrarVinculadas": [0, 0, 0],
      "activoCorriente": [12502, 16150, 19918],
      "activosTotales": [16150, 21400, 20489],
      "proveedores": [1106, 2504, 2779],
      "pasivoFinanciero": [5538, 3977, 3062],
      "cuentasXPagarVinculadas": [0, 0, 4510],
      "pasivoCorriente": [8774, 8671, 8290],
      "pasivosTotales": [14318, 14245, 11384],
      "capitalPagado": [1500, 1502, 1504],
      "patrimonio": [5093, 7154, 9104]
    },
    "incomeStatement": {
      "ventas": [16451, 17414, 10379],
      "costos": [13815, 14693, 8355],
      "utilidadBruta": [2635, 2720, 2024],
      "gastosOperacionales": [1476, 1517, 1061],
      "deprecAmortiz": [0, 0, 0],
      "utilidadOperacional": [1159, 1203, 962],
      "gastosFinancieros": [425, 442, 354],
      "utilidadNeta": [727, 749, 600]
    },
    "financialRatios": [
      { "name": "Margen Bruto", "values": ["16.02%", "15.62%", "19.50%"] },
      { "name": "Margen Operacional", "values": ["7.05%", "6.91%", "9.27%"] },
      { "name": "Margen Neto", "values": ["4.42%", "4.30%", "5.78%"] },
      { "name": "EBITDA", "values": ["$ 1,159", "$ 1,203", "$ 962"] },
      { "name": "Cobertura de Intereses", "values": ["2.7x", "2.7x", "1.4x"] },
      { "name": "Razón Corriente", "values": ["1.4x", "1.9x", "2.4x"] },
      { "name": "Rotación de Inventario (días)", "values": ["269", "330", "378"] },
      { "name": "Rotación de Cartera (días)", "values": ["12", "24", "32"] },
      { "name": "Rotación de Proveedores (días)", "values": ["29", "61", "60"] },
      { "name": "Ciclo del Negocio (días)", "values": ["253", "293", "350"] },
      { "name": "Índice de Endeudamiento", "values": ["89%", "67%", "56%"] },
      { "name": "DEUDA / EBITDA", "values": ["4.8x", "3.3x", "3.2x"] },
      { "name": "Liquidez Corriente", "values": ["1.4x", "1.9x", "2.4x"] },
      { "name": "Deuda Financiera / Patrimonio", "values": ["109%", "56%", "34%"] },
      { "name": "ROE", "values": ["14.27%", "10.47%", "6.59%"] }
    ],
    "financialConcept": "Concepto cualitativo de facturación, flujo de caja y fundamentación del dictamen."
  }
}`;

    // 1. PRIORIDAD: GOOGLE GEMINI
    if (geminiKey) {
      const geminiModels = ["gemini-3.8-flash", "gemini-2.5-flash", "gemini-flash-latest"];
      for (const model of geminiModels) {
        try {
          const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`;
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 12000);

          const geminiRes = await fetch(geminiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            signal: controller.signal,
            body: JSON.stringify({
              contents: [{ parts: [{ text: systemPrompt }] }],
              generationConfig: {
                temperature: 0.15,
                responseMimeType: "application/json",
              },
            }),
          });
          clearTimeout(timeoutId);

          if (geminiRes.ok) {
            const geminiData = await geminiRes.json();
            const rawTextRes = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
            const parsed = JSON.parse(rawTextRes);
            return NextResponse.json(
              {
                success: true,
                provider: `google_gemini_${model}`,
                data: parsed,
                analyzedAt: new Date().toISOString(),
              },
              { headers: corsHeaders }
            );
          }
        } catch (e) {
          console.warn(`Error en Gemini (${model}):`, e);
        }
      }
    }

    // 2. FALLBACK: OPENAI GPT-4o
    if (openAiKey) {
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
              content: "Eres un Director de Riesgos Financieros de banca colombiana. Evalúas solicitudes con rigor técnico y respondes estrictamente en formato JSON.",
            },
            {
              role: "user",
              content: systemPrompt,
            },
          ],
          temperature: 0.15,
        }),
      });

      if (openAiRes.ok) {
        const openAiData = await openAiRes.json();
        const rawJson = openAiData.choices?.[0]?.message?.content || "{}";
        const parsed = JSON.parse(rawJson);
        return NextResponse.json(
          {
            success: true,
            provider: "openai_gpt4o",
            data: parsed,
            analyzedAt: new Date().toISOString(),
          },
          { headers: corsHeaders }
        );
      }
    }

    return NextResponse.json(
      { error: "No se pudo procesar el análisis con ningún motor de IA disponible." },
      { status: 500, headers: corsHeaders }
    );
  } catch (err: any) {
    console.error("Error en AI Financial Analysis:", err);
    return NextResponse.json(
      { error: err?.message || "Error interno procesando análisis financiero con IA" },
      { status: 500, headers: corsHeaders }
    );
  }
}
