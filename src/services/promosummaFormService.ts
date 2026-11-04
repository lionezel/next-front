import { PDFDocument } from "pdf-lib";

export interface PromosummaClientData {
  // Información Personal
  firstName?: string;
  secondName?: string;
  firstLastName?: string;
  secondLastName?: string;
  fullName?: string;
  documentType?: string; // CC, CE, PA
  documentNumber?: string;
  expeditionPlace?: string;
  expeditionDate?: string;
  birthDate?: string;
  birthPlace?: string;
  gender?: "M" | "F" | "MASCULINO" | "FEMENINO";
  maritalStatus?: "soltero" | "casado" | "separado" | "union_libre" | "viudo";
  educationLevel?: "primaria" | "bachillerato" | "tecnologo" | "universitario" | "posgrado";
  occupation?: string;
  housingType?: "propia" | "familiar" | "arrendada";
  yearsInHousing?: string | number;
  address?: string;
  city?: string;
  department?: string;
  stratum?: string | number;
  residencePhone?: string;
  cellphone?: string;
  email?: string;
  numChildren?: number;
  dependents?: number;

  // Información Laboral
  economicActivity?:
    | "empleado"
    | "pensionado"
    | "estudiante"
    | "rentista"
    | "empresario"
    | "ama_de_casa"
    | "comerciante"
    | "independiente"
    | "otro";
  companyName?: string;
  companyNit?: string;
  jobPosition?: string;
  companyAddress?: string;
  companyCity?: string;
  companyDepartment?: string;
  companyPhone?: string;
  entryDate?: string;
  contractType?: string;

  // Información Financiera
  basicSalary?: number;
  commissions?: number;
  fees?: number;
  pension?: number;
  rentIncome?: number;
  otherIncome?: number;
  totalIncome?: number;

  familyExpenses?: number;
  housingCredit?: number;
  vehicleCredit?: number;
  otherCredits?: number;
  creditCards?: number;
  otherExpenses?: number;
  totalExpenses?: number;

  totalAssets?: number;
  totalLiabilities?: number;

  // Crédito Solicitado
  loanAmount?: number;
  loanTermMonths?: number;
  productDestination?: string;
  paymentDay?: number | string;

  // Referencias Personales y Bancarias
  familyRefName?: string;
  familyRefCompany?: string;
  familyRefPhone?: string;
  familyRefCell?: string;
  familyRefRelation?: string;

  personalRefName?: string;
  personalRefCompany?: string;
  personalRefPhone?: string;
  personalRefCell?: string;
  personalRefRelation?: string;

  bankRefEntity?: string;
  bankRefProductType?: string;
  bankRefAccountNumber?: string;

  // Firma y Radicación
  signatureBase64?: string; // DataURL de la firma (PNG con fondo transparente)
  signingCity?: string;
  signingDate?: Date;
}

/**
 * Llena el formulario oficial de Promosumma (3 páginas AcroForm)
 * y estampa la firma digital capturada en el portal.
 */
export async function generatePromosummaFilledPDF(
  clientData: PromosummaClientData,
  templatePdfBytes?: Uint8Array
): Promise<Uint8Array> {
  let pdfBytes = templatePdfBytes;

  // 1. Cargar plantilla PDF si no se suministraron bytes
  if (!pdfBytes) {
    try {
      const response = await fetch("/templates/promosumma_persona_natural.pdf");
      if (!response.ok) {
        throw new Error(`No se pudo cargar la plantilla local: ${response.statusText}`);
      }
      const buffer = await response.arrayBuffer();
      pdfBytes = new Uint8Array(buffer);
    } catch (err) {
      console.error("Error fetching template from /templates/promosumma_persona_natural.pdf:", err);
      throw new Error("No se pudo cargar la plantilla oficial de Promosumma. Verifica que el archivo exista en /templates/.");
    }
  }

  const pdfDoc = await PDFDocument.load(pdfBytes);
  const form = pdfDoc.getForm();

  // Helper seguro para asignar texto a campos del formulario
  const setField = (fieldName: string, value: any) => {
    if (value === undefined || value === null) return;
    const strVal = String(value).trim();
    if (!strVal) return;
    try {
      const field = form.getTextField(fieldName);
      if (field) field.setText(strVal);
    } catch {
      // Ignorar si el campo no es de tipo TextField o no existe
    }
  };

  // Helper seguro para marcar CheckBoxes
  const checkField = (fieldName: string, shouldCheck = true) => {
    if (!shouldCheck) return;
    try {
      const field = form.getCheckBox(fieldName);
      if (field) field.check();
    } catch {
      // Ignorar si no existe
    }
  };

  // Desglosar nombres si no vienen separados
  let fName = clientData.firstName || "";
  let sName = clientData.secondName || "";
  let lName1 = clientData.firstLastName || "";
  let lName2 = clientData.secondLastName || "";

  if ((!fName || !lName1) && clientData.fullName) {
    const parts = clientData.fullName.trim().split(/\s+/);
    if (parts.length === 1) fName = parts[0];
    else if (parts.length === 2) { fName = parts[0]; lName1 = parts[1]; }
    else if (parts.length === 3) { fName = parts[0]; lName1 = parts[1]; lName2 = parts[2]; }
    else if (parts.length >= 4) { fName = parts[0]; sName = parts[1]; lName1 = parts[2]; lName2 = parts.slice(3).join(" "); }
  }

  const completeName = [fName, sName, lName1, lName2].filter(Boolean).join(" ");

  // 1. ENCABEZADO Y TIPO DE SOLICITUD
  checkField("Check Box3"); // Titular [X]
  setField("Nombre del titular", completeName);

  // Fecha de diligenciamiento
  const now = clientData.signingDate || new Date();
  const dayStr = String(now.getDate()).padStart(2, "0");
  const monthStr = String(now.getMonth() + 1).padStart(2, "0");
  const yearStr = String(now.getFullYear());
  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];
  const monthName = monthNames[now.getMonth()];

  setField("Dia", dayStr);
  setField("Mes", monthStr);
  setField("Año", yearStr);

  // 2. INFORMACIÓN PERSONAL
  setField("Primer nombre", fName.toUpperCase());
  setField("Segundo nombre", sName.toUpperCase());
  setField("Primer apellido", lName1.toUpperCase());
  setField("Segundo apellido", lName2.toUpperCase());
  setField("Correo electrónico", (clientData.email || "").toLowerCase());
  setField("No de identificación", clientData.documentNumber || "");
  setField("Lugar de expedición", (clientData.expeditionPlace || "MEDELLÍN").toUpperCase());
  setField("Lugar de Nacimiento", (clientData.birthPlace || clientData.expeditionPlace || "MEDELLÍN").toUpperCase());

  // Tipo de documento
  const docType = (clientData.documentType || "CC").toUpperCase();
  if (docType === "CC") checkField("Check Box1");
  else if (docType === "CE") checkField("Check Box2");
  else if (docType === "PA" || docType === "PASAPORTE") checkField("Check Box4");

  // Fechas expedición / nacimiento
  if (clientData.expeditionDate || clientData.birthDate) {
    const combinedDates = `${clientData.expeditionDate || ""}  |  ${clientData.birthDate || ""}`;
    setField("Fde expedición Fde nacimiento Lugar de nacimiento", combinedDates);
  }

  // Sexo / Género
  const g = (clientData.gender || "M").toUpperCase();
  if (g.startsWith("F") || g === "FEMENINO") {
    checkField("Check Box14"); // Femenino
  } else {
    checkField("Check Box13"); // Masculino
  }

  // Estado Civil
  const st = (clientData.maritalStatus || "soltero").toLowerCase();
  if (st.includes("solter")) checkField("Solteroa");
  else if (st.includes("casad")) checkField("Casadoa");
  else if (st.includes("separad")) checkField("Separadoa");
  else if (st.includes("union") || st.includes("libre")) checkField("U Libre");
  else if (st.includes("viud")) checkField("Viudoa");

  // Nivel Educativo
  const edu = (clientData.educationLevel || "universitario").toLowerCase();
  if (edu.includes("primaria")) checkField("Primaria");
  else if (edu.includes("bachiller")) checkField("Bachillerat");
  else if (edu.includes("tecnolog")) checkField("Tecnólogo");
  else if (edu.includes("universita")) checkField("Universitari");
  else if (edu.includes("posgrado") || edu.includes("maestr")) checkField("Posgrado");

  // Vivienda y Ubicación
  const hType = (clientData.housingType || "propia").toLowerCase();
  if (hType.includes("propia")) checkField("Propia");
  else if (hType.includes("arrend")) checkField("Arrendada");
  else if (hType.includes("fam")) checkField("Familiar");

  setField("Años en dicha vivienda", clientData.yearsInHousing || "3");
  setField("Dirección de residencia", (clientData.address || "").toUpperCase());
  setField("Ciudad", (clientData.city || "MEDELLÍN").toUpperCase());
  setField("Departamento", (clientData.department || "ANTIOQUIA").toUpperCase());
  setField("Estrato", clientData.stratum || "3");
  setField("Tel residencia", clientData.residencePhone || "");
  setField("Celular", clientData.cellphone || "");
  setField("No de hijos", String(clientData.numChildren ?? 0));
  setField("Personas a cargo", String(clientData.dependents ?? 0));
  setField("Ocupación/Profesión", (clientData.occupation || "EMPLEADO").toUpperCase());

  // 3. INFORMACIÓN LABORAL
  const act = (clientData.economicActivity || "empleado").toLowerCase();
  if (act.includes("emplead") || act.includes("asalariad")) checkField("Empelado");
  else if (act.includes("pensionad")) checkField("Pensionad");
  else if (act.includes("empresari") || act.includes("socio")) checkField("Empresari");
  else if (act.includes("comerciant")) checkField("Comerciant");
  else if (act.includes("rentista")) checkField("Rentista de");
  else if (act.includes("estudiant")) checkField("Estudiante");
  else checkField("Otro");

  setField("Empresa donde trabaja", (clientData.companyName || "").toUpperCase());
  setField("Cargo", (clientData.jobPosition || "").toUpperCase());
  setField("Dirección de la empresa", (clientData.companyAddress || clientData.address || "").toUpperCase());
  setField("Ciudad_2", (clientData.companyCity || clientData.city || "MEDELLÍN").toUpperCase());
  setField("Departamento_2", (clientData.companyDepartment || clientData.department || "ANTIOQUIA").toUpperCase());
  setField("Tel empresa", clientData.companyPhone || clientData.cellphone || "");
  setField("Tipo de contrato", (clientData.contractType || "TÉRMINO INDEFINIDO").toUpperCase());
  if (clientData.entryDate) {
    setField("Fecha de ingreso Tipo de contrato", `${clientData.entryDate} - ${(clientData.contractType || "INDEFINIDO").toUpperCase()}`);
  }

  // 4. INFORMACIÓN FINANCIERA
  const formatCOP = (val?: number) => (val ? Math.round(val).toLocaleString("es-CO") : "");
  const basic = clientData.basicSalary || clientData.totalIncome || 0;
  const totInc = clientData.totalIncome || basic;
  const totExp = clientData.totalExpenses || clientData.familyExpenses || Math.round(totInc * 0.35);

  setField("INGRESOS MENSUALES 1", formatCOP(basic));
  if (clientData.commissions) setField("INGRESOS MENSUALES 2", formatCOP(clientData.commissions));
  if (clientData.fees) setField("INGRESOS MENSUALES 3", formatCOP(clientData.fees));
  if (clientData.otherIncome) setField("Otros Ingresos", formatCOP(clientData.otherIncome));
  setField("Total ingresos", formatCOP(totInc));

  setField("Gastos Familiares", formatCOP(clientData.familyExpenses || Math.round(totExp * 0.7)));
  if (clientData.housingCredit) setField("Crédito de Vivienda", formatCOP(clientData.housingCredit));
  if (clientData.vehicleCredit) setField("Crédito de Vehículo", formatCOP(clientData.vehicleCredit));
  if (clientData.otherExpenses) setField("Otros Gastos", formatCOP(clientData.otherExpenses));
  setField("Total Gastos", formatCOP(totExp));

  if (clientData.totalAssets) setField("Valor Total de Activos", formatCOP(clientData.totalAssets));
  if (clientData.totalLiabilities) setField("Valor Total de Pasivos", formatCOP(clientData.totalLiabilities));

  // 5. CRÉDITO A SOLICITAR
  setField("Producto a financiardestino", clientData.productDestination || "LIBRE INVERSIÓN / VINCULACIÓN");
  if (clientData.loanAmount) setField("Valor a financiar", formatCOP(clientData.loanAmount));
  if (clientData.loanTermMonths) setField("Meses plazo de crédito", String(clientData.loanTermMonths));
  setField("Dial del mes que prefiere hacer el pago", String(clientData.paymentDay || 15));

  // 6. REFERENCIAS (PÁGINA 2)
  if (clientData.familyRefName) {
    setField("NOMBRE Y APELLIDOSFamiliar", clientData.familyRefName.toUpperCase());
    setField("EMPRESA DONDE TRABAJAFamiliar", (clientData.familyRefCompany || "").toUpperCase());
    setField("TELÉFONO FIJOFamiliar", clientData.familyRefPhone || "");
    setField("TELÉFONO CELULARFamiliar", clientData.familyRefCell || "");
    setField("PARENTESCOFamiliar", (clientData.familyRefRelation || "FAMILIAR").toUpperCase());
  }

  if (clientData.personalRefName) {
    setField("NOMBRE Y APELLIDOSPersonal", clientData.personalRefName.toUpperCase());
    setField("EMPRESA DONDE TRABAJAPersonal", (clientData.personalRefCompany || "").toUpperCase());
    setField("TELÉFONO FIJOPersonal", clientData.personalRefPhone || "");
    setField("TELÉFONO CELULARPersonal", clientData.personalRefCell || "");
    setField("PARENTESCOPersonal", (clientData.personalRefRelation || "AMIGO / CONOCIDO").toUpperCase());
  }

  if (clientData.bankRefEntity) {
    setField("NOMBRE DE LA ENTIDADEntidad 1", clientData.bankRefEntity.toUpperCase());
    setField("TIPO DE PRODUCTOEntidad 1", (clientData.bankRefProductType || "CUENTA DE AHORROS").toUpperCase());
    setField("NUMERO DEL PRODUCTOEntidad 1", clientData.bankRefAccountNumber || "");
  }

  // 7. DECLARACIÓN DE FONDOS (PÁGINA 2)
  setField("Nombre", completeName.toUpperCase());

  // 8. AUTORIZACIÓN Y FIRMA (PÁGINA 3)
  const signCity = (clientData.signingCity || clientData.city || "MEDELLÍN").toUpperCase();
  setField("Cuidad de firma", signCity);
  setField("días", dayStr);
  setField("días del mes de", monthName);
  setField("de", yearStr);

  setField("Nombre completo", completeName.toUpperCase());
  setField("CC_3", clientData.documentNumber || "");
  checkField("Check Box10"); // "En nombre Propio [X]"

  // 9. ESTAMPAR FIRMA DIGITAL (PNG / CANVAS) EN PÁGINA 3
  if (clientData.signatureBase64 && clientData.signatureBase64.startsWith("data:image")) {
    try {
      const pages = pdfDoc.getPages();
      if (pages.length >= 3) {
        const page3 = pages[2];

        const base64Data = clientData.signatureBase64.split(",")[1];
        const imageBytes = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));

        let embeddedImage;
        if (clientData.signatureBase64.includes("image/png")) {
          embeddedImage = await pdfDoc.embedPng(imageBytes);
        } else {
          embeddedImage = await pdfDoc.embedJpg(imageBytes);
        }

        const signatureWidth = 140;
        const signatureHeight = 42;
        const signatureX = 110;
        const signatureY = 190;

        page3.drawImage(embeddedImage, {
          x: signatureX,
          y: signatureY,
          width: signatureWidth,
          height: signatureHeight,
        });
      }
    } catch (sigErr) {
      console.warn("No se pudo estampar la imagen de la firma en el PDF:", sigErr);
    }
  }

  // 10. Guardar y devolver PDF diligenciado
  const filledPdfBytes = await pdfDoc.save();
  return filledPdfBytes;
}
