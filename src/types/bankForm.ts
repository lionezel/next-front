export type BankId = 'bbva' | 'itau' | 'av_villas' | 'bogota' | 'bancolombia' | string;

export type EconomicActivityProfile =
  | 'asalariado_empleado'
  | 'pensionado'
  | 'independiente_prestador'
  | 'independiente_transportador'
  | 'socio_empresa'
  | 'rentista_capital'
  | 'profesional_independiente'
  | 'otros_independientes';

export type DocumentTypeId =
  | 'cedula'
  | 'certificacion_laboral'
  | 'desprendibles_nomina'
  | 'declaracion_renta'
  | 'extractos_bancarios'
  | 'certificacion_ingresos_retenciones'
  | 'certificado_pension'
  | 'desprendibles_pension'
  | 'contrato'
  | 'rut'
  | 'tarjeta_propiedad_vehiculo'
  | 'certificacion_empresa_vehiculo'
  | 'camara_comercio'
  | 'composicion_accionaria'
  | 'estados_financieros'
  | 'tarjeta_profesional_contador'
  | 'contratos_arrendamiento'
  | 'certificacion_tradicion_libertad';

export interface DocumentTypeDefinition {
  id: DocumentTypeId;
  label: string;
  category: 'personal' | 'laboral' | 'financiero' | 'vehiculo' | 'empresa' | 'propiedad';
  description?: string;
}

export interface ProfileRequirementRule {
  activityProfile: EconomicActivityProfile;
  profileLabel: string;
  activityCategory: 'ASALARIADO' | 'PENSIONADO' | 'INDEPENDIENTES';
  requiredDocuments: Record<BankId, DocumentTypeId[]>;
}

export interface BankTemplate {
  id: string;
  bankId: BankId;
  title: string;
  description?: string;
  fileUrl?: string;
  fileName?: string;
  formType: 'pdf_acroform' | 'web_portal' | 'google_form';
  externalUrl?: string;
  mappedFields?: Record<string, string>;
  createdAt?: any;
  updatedAt?: any;
}

export interface BankFolder {
  id: BankId;
  name: string;
  code: string;
  logoUrl?: string;
  color: string;
  description: string;
  active: boolean;
  templates: BankTemplate[];
  portalUrl?: string;
  order: number;
}

export interface ExtractedFinancialProfile {
  creditCaseId?: string;
  clientName?: string;
  firstName?: string;
  secondName?: string;
  firstLastName?: string;
  secondLastName?: string;
  documentType?: 'CC' | 'CE' | 'NIT' | 'PASAPORTE';
  documentNumber?: string;
  expeditionDate?: string;
  expeditionPlace?: string;
  birthDate?: string;
  gender?: string;
  rh?: string;
  email?: string;
  phone?: string;
  city?: string;
  address?: string;
  
  // Laboral & Financiero
  economicActivity?: EconomicActivityProfile;
  companyName?: string;
  companyNit?: string;
  jobPosition?: string;
  contractType?: 'Indefinido' | 'Fijo' | 'Obra Labor' | 'Prestacion Servicios';
  seniorityMonths?: number;
  monthlyIncome?: number;
  otherIncome?: number;
  monthlyExpenses?: number;
  totalAssets?: number;
  totalLiabilities?: number;
  netWorth?: number;
  
  // Específicos por Actividad
  vehiclePlate?: string;
  vehicleModel?: string;
  rentalIncomeMonthly?: number;
  propertyCount?: number;
  contadorName?: string;
  contadorTP?: string;
  
  // Documentos escaneados procesados
  parsedDocuments?: {
    documentId: string;
    documentType: DocumentTypeId;
    fileName: string;
    fileUrl: string;
    parsedAt: any;
    confidenceScore: number;
    rawExtractedText?: string;
  }[];
  
  updatedAt?: any;
}
