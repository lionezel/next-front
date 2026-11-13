import { LeadStatus } from "./common";

export type CreditType = 'personal' | 'libre_inversion' | 'negocio' | 'microcredito' | 'vehiculo';

export interface CreditOption {
  id: CreditType;
  title: string;
  tagline: string;
  minAmount: number;
  maxAmount: number;
  minTermMonths: number;
  maxTermMonths: number;
  annualRatePct: number; // e.g. 18.5%
  monthlyRatePct: number; // e.g. 1.42%
  features: string[];
  recommended?: boolean;
}

export interface CreditCalculation {
  amount: number;
  termMonths: number;
  monthlyRatePct: number;
  monthlyPayment: number;
  totalInterest: number;
  totalPayment: number;
  creditType: CreditType;
}

export interface CreditApplication {
  id?: string;
  applicantName: string;
  documentType: 'CC' | 'CE' | 'NIT' | 'PASAPORTE';
  documentNumber: string;
  email: string;
  phone: string;
  city: string;
  monthlyIncome: number;
  occupation: string;
  creditType: CreditType;
  requestedAmount: number;
  termMonths: number;
  calculatedMonthlyPayment: number;
  status: LeadStatus;
  notes?: string;
  source: string;
  createdAt?: any;
  updatedAt?: any;
}

export type CreditCaseStatus =
  | "estudio_inicial"
  | "documentos_solicitados"
  | "en_revision"
  | "aprobado"
  | "en_desembolso"
  | "desembolsado"
  | "rechazado";

export type CreditDocumentStatus = "pendiente" | "en_revision" | "aprobado" | "rechazado";
export type CreditDocumentCategory = "empresa" | "avalista" | "rep_legal" | "pago" | "otros";

export const resolveDocumentCategory = (d: { id?: string; title?: string; description?: string; category?: string }): "empresa" | "rep_legal" => {
  if (d.category === "empresa") return "empresa";
  if (d.category === "rep_legal" || d.category === "avalista") return "rep_legal";
  if (d.id?.startsWith("empresa_")) return "empresa";
  if (d.id?.startsWith("avalista_") || d.id?.startsWith("rep_")) return "rep_legal";

  const lower = `${d.id || ""} ${d.title || ""} ${d.description || ""}`.toLowerCase();

  if (
    lower.includes("avalista") ||
    lower.includes("del socio") ||
    lower.includes("socio con participacion") ||
    lower.includes("socio con participación") ||
    lower.includes("superior al 50%") ||
    lower.includes("anexos a la declaración de renta") ||
    lower.includes("anexos avalista") ||
    lower.includes("sey 2026") ||
    lower.includes("en caso de que el banco los solicite")
  ) {
    return "rep_legal";
  }

  if (
    lower.includes("del representante legal") ||
    lower.includes("camara") ||
    lower.includes("cámara") ||
    lower.includes("de la empresa") ||
    lower.includes("trimestre de la empresa") ||
    lower.includes("iva 2026") ||
    lower.includes("composicion accionaria") ||
    lower.includes("composición accionaria") ||
    lower.includes("contador") ||
    lower.includes("estatutos") ||
    lower.includes("revisor fiscal") ||
    lower.includes("beneficiario final") ||
    lower.includes("rut actualizado") ||
    lower.includes("corte septiembre 2026")
  ) {
    return "empresa";
  }

  if (lower.includes("socio") || lower.includes("personal")) {
    return "rep_legal";
  }

  return "empresa";
};

export interface CreditDocumentFile {
  id: string;
  name: string;
  url: string;
  uploadedAt?: string;
  size?: number;
}

export interface CreditDocumentItem {
  id: string; // e.g. "empresa_cedula_rep_legal", "avalista_rut"
  title: string;
  description?: string;
  category?: CreditDocumentCategory;
  required: boolean;
  status: CreditDocumentStatus;
  fileUrl?: string; // Firebase Storage download URL (principal o primer archivo para retrocompatibilidad)
  fileDataUrl?: string; // Base64 data URL fallback for instant CORS-proof access
  fileName?: string;
  files?: CreditDocumentFile[]; // 🔥 Soporte para múltiples archivos (ej. 3 últimos extractos)
  rejectionReason?: string;
  uploadedAt?: any;
  reviewedAt?: any;
}

export interface CreditContractData {
  companyName?: string;
  companyNit?: string;
  repLegalName?: string;
  repLegalDoc?: string;
  city?: string;
  address?: string;
  phone?: string;
  email?: string;
  // Financial commissions / Honorarios
  studyCost?: number; // Default: 250000
  studyBankInfo?: string; // "Cuenta Corriente # 29899994884 BANCOLOMBIA NIT 901500993"
  successFeePct?: number; // Comisión de éxito del X%
  successFeeValue?: number; // Equivale al valor de $
  preApprovedFeePct?: number; // Comisión sobre crédito preaprobado o no tomado %
  preApprovedFeeValue?: number;
  virtualViabilityPct?: number; // Comisión por viabilidades virtuales %
  virtualViabilityValue?: number;
  // Execution & Signature state
  signed?: boolean;
  signatureDataUrl?: string;
  signatureType?: "canvas" | "electronic" | "upload";
  signedAt?: any;
  signedDateDay?: string;
  signedDateMonth?: string;
  signedDateYear?: string;
  notes?: string;
}

export interface CreditStudyPayment {
  cost: number; // 250000
  bankName: string; // BANCOLOMBIA
  accountType: string; // Cuenta Corriente
  accountNumber: string; // 29899994884
  accountNit: string; // 901500993
  fileUrl?: string;
  fileName?: string;
  status: "pendiente" | "en_revision" | "verificado" | "rechazado";
  rejectionReason?: string;
  uploadedAt?: any;
  verifiedAt?: any;
}

export interface CreditCase {
  id?: string;
  code: string; // e.g. CRED-2026-9142
  userId: string; // Firebase Auth UID
  clientName: string;
  documentType: "CC" | "CE" | "NIT" | "PASAPORTE";
  documentNumber: string;
  email: string;
  phone: string;
  city?: string;
  address?: string;
  companyName?: string;
  companyNit?: string;
  creditType: CreditType;
  amount: number;
  termMonths: number;
  monthlyInterestRate: number; // e.g. 1.35
  estimatedMonthlyPayment: number;
  status: CreditCaseStatus;
  statusNote?: string;
  appointmentCode?: string;
  documents: CreditDocumentItem[];
  contract?: CreditContractData;
  studyPayment?: CreditStudyPayment;
  createdAt?: any;
  updatedAt?: any;
}

export const PRESET_DOCUMENTS: Omit<CreditDocumentItem, "status" | "fileUrl" | "fileName" | "uploadedAt" | "reviewedAt">[] = [
  // ================= DOCUMENTOS DE LA EMPRESA (12) =================
  {
    id: "empresa_cedula_rep_legal",
    category: "empresa",
    title: "Copia de cédula al 150 % del Representante legal, firma y huella",
    description: "Fotocopia legible por ambas caras del documento de identidad del representante legal, ampliada al 150%, con firma original y huella.",
    required: true,
  },
  {
    id: "empresa_rut",
    category: "empresa",
    title: "Rut actualizado",
    description: "Registro Único Tributario (RUT) actualizado de la empresa con fecha de generación del año en curso.",
    required: true,
  },
  {
    id: "empresa_camara_comercio",
    category: "empresa",
    title: "Cámara de comercio actualizada, no mayor a 30 dias",
    description: "Certificado de existencia y representación legal expedido por la Cámara de Comercio con vigencia no mayor a 30 días.",
    required: true,
  },
  {
    id: "empresa_declaraciones_renta",
    category: "empresa",
    title: "Dos últimas declaraciones de renta 2024, 2025",
    description: "Declaraciones de renta de la empresa de los periodos gravables 2024 y 2025 debidamente presentadas ante la DIAN.",
    required: true,
  },
  {
    id: "empresa_balances_estados_resultados",
    category: "empresa",
    title: "Balances y estados de resultados dos últimos periodos fiscales y corte comercial, a Dic Dic 2024, dic 2025 y corte septiembre 2026 con sus respectivas notas.",
    description: "Balances y estados de resultados a Dic 2024, Dic 2025 y corte a septiembre 2026 con sus respectivas notas contables firmadas.",
    required: true,
  },
  {
    id: "empresa_declaraciones_iva",
    category: "empresa",
    title: "Declaraciones de IVA 2026",
    description: "Formularios de IVA presentados y pagados correspondientes a los bimestres/cuatrimestres del año 2026.",
    required: true,
  },
  {
    id: "empresa_composicion_accionaria",
    category: "empresa",
    title: "Composición accionaria actualizada no mayor a 30 dias",
    description: "Certificación firmada por contador o revisor fiscal detallando socios y porcentajes de participación no mayor a 30 días.",
    required: true,
  },
  {
    id: "empresa_tarjeta_profesional_contador",
    category: "empresa",
    title: "Tarjeta profesional del contador",
    description: "Copia de la tarjeta profesional del contador público y certificado de antecedentes disciplinarios vigente ante la JCC.",
    required: true,
  },
  {
    id: "empresa_extractos_bancarios",
    category: "empresa",
    title: "Extractos bancarios último trimestre de la empresa",
    description: "Copia íntegra de los extractos bancarios de las cuentas empresariales del último trimestre.",
    required: true,
  },
  {
    id: "empresa_estatutos_reformas",
    category: "empresa",
    title: "Estatutos y reformas actuales",
    description: "Escritura o documento de constitución y reformas vigentes inscritas en Cámara de Comercio.",
    required: true,
  },
  {
    id: "empresa_dictamen_revisor_fiscal",
    category: "empresa",
    title: "Dictamen de revisor fiscal y tarjeta de profesional",
    description: "Dictamen o informe de auditoría emitido por el revisor fiscal correspondiente al último ejercicio contable junto con su tarjeta profesional.",
    required: false,
  },
  {
    id: "empresa_beneficiario_final_dian",
    category: "empresa",
    title: "Formulario Beneficiario final de la DIAN",
    description: "Registro Único de Beneficiarios Finales (RUB) radicado formalmente ante la DIAN.",
    required: true,
  },

  // ================= AVALISTA SOCIO CON PARTICIPACION SUPERIOR AL 50% Y REPRESENTANTE LEGAL (6) =================
  {
    id: "avalista_cedula_huella",
    category: "avalista",
    title: "Copia de cédula al 150 % con firma y huella",
    description: "Fotocopia ampliada al 150% de la cédula del socio avalista (>50%) o representante legal con firma y huella.",
    required: true,
  },
  {
    id: "avalista_rut",
    category: "avalista",
    title: "Rut actualizado no mayor a 30 dias",
    description: "RUT como persona natural con fecha de generación no mayor a 30 días.",
    required: true,
  },
  {
    id: "avalista_declaracion_renta",
    category: "avalista",
    title: "Declaración de renta , 2024 y 2025",
    description: "Declaraciones de renta persona natural correspondientes a los periodos gravables 2024 y 2025.",
    required: true,
  },
  {
    id: "avalista_anexos_renta",
    category: "avalista",
    title: "Anexos a la declaración de renta 2024, 2025 y corte a sep 2026 con sus notas",
    description: "Soportes, deducciones y anexos explicativos a la declaración de renta 2024, 2025 y corte a septiembre 2026 con sus notas.",
    required: true,
  },
  {
    id: "avalista_balances_estados_resultados",
    category: "avalista",
    title: "Balances y estados de resultados dos últimos periodos fiscales y corte comercial Dic 2024 y último corte Dic de 2025 con sus respectivas notas, en caso de que el banco los solicite.",
    description: "Dic 2024 y último corte Dic de 2025 con sus respectivas notas, en caso de que el banco los solicite.",
    required: false,
  },
  {
    id: "avalista_extractos_bancarios",
    category: "avalista",
    title: "Extractos bancarios último trimestre del socio",
    description: "Extractos bancarios de cuentas personales del socio / representante legal del último trimestre.",
    required: true,
  },
];

