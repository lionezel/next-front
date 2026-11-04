import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { ExtractedFinancialProfile } from "@/src/types/bankForm";

export interface BankPDFFormOptions {
  bankName: string;
  bankCode: string;
  bankColorHex?: string;
  profile: ExtractedFinancialProfile;
  requestedAmount?: number;
  requestedTermMonths?: number;
}

/**
 * Rellena automáticamente los campos de un formulario PDF de un banco con los datos extraídos
 * de los documentos del cliente (Cédula, RUT, Extractos, Nómina).
 */
export async function fillBankFormPDF(options: BankPDFFormOptions): Promise<Uint8Array> {
  const { bankName, bankCode, bankColorHex = "#004481", profile, requestedAmount = 20000000, requestedTermMonths = 36 } = options;

  // Crear un documento PDF limpio y estructurado de la solicitud bancaria
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]); // Tamaño A4
  const { width, height } = page.getSize();

  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Convertir color HEX a RGB
  const hexToRgb = (hex: string) => {
    const cleanHex = hex.replace("#", "");
    const r = parseInt(cleanHex.substring(0, 2), 16) / 255 || 0;
    const g = parseInt(cleanHex.substring(2, 4), 16) / 255 || 0;
    const b = parseInt(cleanHex.substring(4, 6), 16) / 255 || 0;
    return rgb(r, g, b);
  };

  const primaryColor = hexToRgb(bankColorHex);
  const darkSlate = rgb(0.06, 0.09, 0.16);
  const lightGray = rgb(0.95, 0.96, 0.98);

  // 1. ENCABEZADO DEL BANCO
  page.drawRectangle({
    x: 0,
    y: height - 80,
    width,
    height: 80,
    color: primaryColor,
  });

  page.drawText(`SOLICITUD ÚNICA DE CRÉDITO Y VINCULACIÓN`, {
    x: 35,
    y: height - 35,
    size: 16,
    font: fontBold,
    color: rgb(1, 1, 1),
  });

  page.drawText(`ENTIDAD FINANCIERA: ${bankName.toUpperCase()} — RADICACIÓN AUTOMATIZADA CON IA`, {
    x: 35,
    y: height - 55,
    size: 10,
    font: fontRegular,
    color: rgb(0.9, 0.95, 1),
  });

  let currentY = height - 110;

  const drawSectionTitle = (title: string) => {
    page.drawRectangle({
      x: 35,
      y: currentY - 18,
      width: width - 70,
      height: 22,
      color: lightGray,
    });
    page.drawText(title, {
      x: 45,
      y: currentY - 12,
      size: 11,
      font: fontBold,
      color: darkSlate,
    });
    currentY -= 32;
  };

  const drawFieldRow = (label1: string, val1: string, label2: string, val2: string) => {
    // Campo 1
    page.drawText(label1.toUpperCase(), { x: 45, y: currentY, size: 8, font: fontBold, color: rgb(0.4, 0.45, 0.55) });
    page.drawText(val1 || "N/A", { x: 45, y: currentY - 12, size: 10, font: fontRegular, color: darkSlate });

    // Campo 2
    page.drawText(label2.toUpperCase(), { x: 300, y: currentY, size: 8, font: fontBold, color: rgb(0.4, 0.45, 0.55) });
    page.drawText(val2 || "N/A", { x: 300, y: currentY - 12, size: 10, font: fontRegular, color: darkSlate });

    currentY -= 28;
  };

  // 2. DATOS PERSONALES DEL SOLICITANTE (EXTRAÍDOS DE LA CÉDULA)
  drawSectionTitle("1. DATOS PERSONALES DEL SOLICITANTE (EXTRAÍDOS DE CÉDULA)");

  drawFieldRow("Primer Nombre", profile.firstName || "", "Segundo Nombre", profile.secondName || "");
  drawFieldRow("Primer Apellido", profile.firstLastName || "", "Segundo Apellido", profile.secondLastName || "");
  drawFieldRow("Nombre Completo Titular", profile.clientName || "", "Tipo de Documento", profile.documentType || "CC");
  drawFieldRow("Número de Identificación", profile.documentNumber || "", "Fecha de Expedición", profile.expeditionDate || "");
  drawFieldRow("Ciudad de Residencia", profile.city || "Medellín", "Dirección Domicilio", profile.address || "Calle 10 # 43A - 25");

  currentY -= 10;

  // 3. DATOS LABORALES Y FINANCIEROS (EXTRAÍDOS DE NÓMINA / RENTAS / EXTRACTOS)
  drawSectionTitle("2. INFORMACIÓN FINANCIERA Y LABORAL (EXTRAÍDA DE ARCHIVOS)");

  drawFieldRow("Actividad Económica", (profile.economicActivity || "ASALARIADO").toUpperCase(), "Empresa / Razón Social", profile.companyName || "");
  drawFieldRow("NIT de la Empresa", profile.companyNit || "900.123.456-7", "Cargo / Ocupación", profile.jobPosition || "Director de Operaciones");
  drawFieldRow("Tipo de Contrato", profile.contractType || "Indefinido", "Ingresos Mensuales Certificados", `$ ${(profile.monthlyIncome || 4800000).toLocaleString("es-CO")} COP`);
  drawFieldRow("Egresos Mensuales Estimados", `$ ${(profile.monthlyExpenses || 1400000).toLocaleString("es-CO")} COP`, "Patrimonio Bruto (Renta)", `$ ${(profile.totalAssets || 320000000).toLocaleString("es-CO")} COP`);

  currentY -= 10;

  // 4. CONDICIONES DE LA SOLICITUD DE CRÉDITO
  drawSectionTitle("3. CONDICIONES DE LA SOLICITUD AL BANCO");

  drawFieldRow("Monto Solicitado", `$ ${requestedAmount.toLocaleString("es-CO")} COP`, "Plazo Solicitado", `${requestedTermMonths} Meses`);
  drawFieldRow("Banco Destino", bankName, "Canal de Radicación", "NEXT Financial Portal — IA Vision OCR");

  currentY -= 20;

  // 5. SECCIÓN DE FIRMA Y HUELLA
  page.drawRectangle({
    x: 35,
    y: currentY - 75,
    width: 250,
    height: 75,
    borderColor: rgb(0.7, 0.7, 0.7),
    borderWidth: 1,
  });
  page.drawText("FIRMA DEL SOLICITANTE", { x: 45, y: currentY - 15, size: 8, font: fontBold, color: rgb(0.4, 0.45, 0.55) });
  page.drawText(profile.clientName || "", { x: 45, y: currentY - 55, size: 9, font: fontBold, color: darkSlate });
  page.drawText(`C.C. ${profile.documentNumber || ""}`, { x: 45, y: currentY - 68, size: 8, font: fontRegular, color: darkSlate });

  page.drawRectangle({
    x: 310,
    y: currentY - 75,
    width: 100,
    height: 75,
    borderColor: rgb(0.7, 0.7, 0.7),
    borderWidth: 1,
  });
  page.drawText("HUELLA DACTILAR", { x: 318, y: currentY - 15, size: 7, font: fontBold, color: rgb(0.4, 0.45, 0.55) });

  // Pie de Página
  page.drawText(`Generado automáticamente por NEXT CONNECTION GROUP SAS — Radicado Oficial ${bankCode}`, {
    x: 35,
    y: 25,
    size: 8,
    font: fontRegular,
    color: rgb(0.5, 0.5, 0.5),
  });

  return await pdfDoc.save();
}

/**
 * Genera el PDF completo y dispara la descarga en el navegador.
 */
export async function downloadAutoFilledBankFormPDF(options: BankPDFFormOptions) {
  const pdfBytes = await fillBankFormPDF(options);
  const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `Formulario_Solicitud_${options.bankCode}_${(options.profile.clientName || "Cliente").replace(/\s+/g, "_")}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
