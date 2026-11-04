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
export type CreditDocumentCategory = "empresa" | "avalista" | "pago" | "otros";

export interface CreditDocumentItem {
  id: string; // e.g. "empresa_cedula_rep_legal", "avalista_rut"
  title: string;
  description?: string;
  category?: CreditDocumentCategory;
  required: boolean;
  status: CreditDocumentStatus;
  fileUrl?: string; // Firebase Storage download URL
  fileDataUrl?: string; // Base64 data URL fallback for instant CORS-proof access
  fileName?: string;
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
  signatureType?: "canvas" | "electronic";
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
    title: "Copia de cédula al 150 % del Representante legal",
    description: "Fotocopia legible por ambas caras del documento de identidad del representante legal, ampliada al 150%.",
    required: true,
  },
  {
    id: "empresa_rut",
    category: "empresa",
    title: "Rut actualizado de la Empresa",
    description: "Registro Único Tributario con fecha de generación del año en curso.",
    required: true,
  },
  {
    id: "empresa_camara_comercio",
    category: "empresa",
    title: "Cámara de comercio actualizada",
    description: "Certificado de existencia y representación legal con vigencia no superior a 30 días.",
    required: true,
  },
  {
    id: "empresa_declaraciones_renta",
    category: "empresa",
    title: "Dos últimas declaraciones de renta",
    description: "Formularios oficiales presentados ante la DIAN con sello de recibido/pago.",
    required: true,
  },
  {
    id: "empresa_balances_estados_resultados",
    category: "empresa",
    title: "Balances y estados de resultados dos últimos periodos fiscales y corte comercial",
    description: "Balances y estados de resultados a Dic 2023, Dic 2024, Dic 2025 y corte junio 2026 con sus respectivas notas.",
    required: true,
  },
  {
    id: "empresa_declaraciones_iva",
    category: "empresa",
    title: "Declaraciones de IVA 2026",
    description: "Formularios de IVA presentados y pagados correspondientes a los bimestres/cuatrimestres de 2026.",
    required: true,
  },
  {
    id: "empresa_composicion_accionaria",
    category: "empresa",
    title: "Composición accionaria actualizada",
    description: "Certificación firmada por contador o revisor fiscal detallando socios y porcentajes de participación.",
    required: true,
  },
  {
    id: "empresa_tarjeta_profesional_contador",
    category: "empresa",
    title: "Tarjeta profesional del contador",
    description: "Copia de la tarjeta profesional y antecedentes vigentes de la Junta Central de Contadores.",
    required: true,
  },
  {
    id: "empresa_extractos_bancarios",
    category: "empresa",
    title: "Extractos bancarios último trimestre",
    description: "Copia íntegra de los extractos bancarios de las cuentas empresariales de los últimos 3 meses.",
    required: true,
  },
  {
    id: "empresa_estatutos_reformas",
    category: "empresa",
    title: "Estatutos y reformas",
    description: "Escritura de constitución de la sociedad y reformas vigentes inscritas en Cámara de Comercio.",
    required: true,
  },
  {
    id: "empresa_dictamen_revisor_fiscal",
    category: "empresa",
    title: "Dictamen de revisor fiscal",
    description: "Informe o dictamen emitido por el revisor fiscal correspondiente al último ejercicio contable.",
    required: false,
  },
  {
    id: "empresa_beneficiario_final_dian",
    category: "empresa",
    title: "Formulario Beneficiario final de la DIAN",
    description: "Registro Único de Beneficiarios Finales (RUB) radicado formalmente ante la DIAN.",
    required: true,
  },

  // ================= AVALISTA SOCIO CON PARTICIPACION SUPERIOR AL 50% (6) =================
  {
    id: "avalista_cedula_huella",
    category: "avalista",
    title: "Copia de cédula al 150 % con firma y huella",
    description: "Fotocopia ampliada al 150% de la cédula del socio avalista (>50%) con firma original y huella.",
    required: true,
  },
  {
    id: "avalista_rut",
    category: "avalista",
    title: "Rut actualizado del Avalista",
    description: "RUT como persona natural con fecha de generación del año en curso.",
    required: true,
  },
  {
    id: "avalista_declaracion_renta",
    category: "avalista",
    title: "Declaración de renta 2023, 2024",
    description: "Formularios de renta personal correspondientes a los años gravables 2023 y 2024.",
    required: true,
  },
  {
    id: "avalista_anexos_renta",
    category: "avalista",
    title: "Anexos a la declaración de renta",
    description: "Soportes, deducciones y certificados anexos a las declaraciones de renta.",
    required: true,
  },
  {
    id: "avalista_balances_estados_resultados",
    category: "avalista",
    title: "Balances y estados de resultados dos últimos periodos fiscales y corte comercial",
    description: "Dic 2023, Dic 2024 y último corte Dic de 2025 con sus respectivas notas, en caso de que el banco los solicite.",
    required: false,
  },
  {
    id: "avalista_extractos_bancarios",
    category: "avalista",
    title: "Extractos bancarios último trimestre (Avalista)",
    description: "Extractos bancarios de cuentas personales del socio avalista del último trimestre.",
    required: true,
  },
];

