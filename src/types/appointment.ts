export type AppointmentModality = "presencial" | "virtual";

export type AppointmentStatus = "pendiente" | "aceptada" | "cancelada" | "completada";

export type DocumentType = "CC" | "CE" | "NIT" | "PASAPORTE";

export interface Appointment {
  id?: string;
  code: string; // e.g. CITA-2026-8921
  clientName: string;
  documentType: DocumentType;
  documentNumber: string;
  phone: string;
  email: string;
  modality: AppointmentModality;
  branch?: string; // e.g. "Sede Bogotá - Calle 100", "Sede Medellín - El Poblado"
  branchId?: string;
  meetUrl?: string; // e.g. "https://meet.google.com/xxx-yyyy-zzz"
  meetCode?: string; // e.g. "xxx-yyyy-zzz"
  vertical: "credito" | "inversiones" | "seguros" | "fit" | "ecosistema";
  serviceName: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "09:00 AM", "10:30 AM"
  notes?: string;
  calendarEventId?: string;
  status: AppointmentStatus;
  createdAt?: any;
  updatedAt?: any;
}

export interface BranchOffice {
  id: string;
  name: string;
  city: string;
  address: string;
  schedule: string;
  phone?: string;
  active?: boolean;
  createdAt?: any;
  updatedAt?: any;
}

export const BRANCH_OFFICES: BranchOffice[] = [
  {
    id: "bogota_principal",
    name: "Sede Principal Bogotá",
    city: "Bogotá D.C.",
    address: "Calle 100 # 15-20, Torre Financiera, Piso 8",
    schedule: "Lunes a Viernes 8:00 AM - 5:00 PM, Sábados 8:00 AM - 12:00 PM",
    phone: "+57 (601) 745-0000",
    active: true,
  },
  {
    id: "medellin_poblado",
    name: "Sede Medellín - El Poblado",
    city: "Medellín",
    address: "Carrera 43A # 5A-113, Centro Empresarial, Oficina 402",
    schedule: "Lunes a Viernes 8:00 AM - 5:00 PM, Sábados 8:00 AM - 12:00 PM",
    phone: "+57 (604) 604-1111",
    active: true,
  },
  {
    id: "cali_granada",
    name: "Sede Cali - Granada",
    city: "Cali",
    address: "Avenida 9N # 12N-35, Edificio Corporativo, Piso 3",
    schedule: "Lunes a Viernes 8:00 AM - 5:00 PM",
    phone: "+57 (602) 889-2222",
    active: true,
  },
];

export const AVAILABLE_TIME_SLOTS = [
  "08:00 AM",
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
];

export const APPOINTMENT_SERVICES = [
  {
    vertical: "credito" as const,
    title: "Asesoría de Crédito & Financiación",
    description: "Estudio de crédito personal, comercial o libre inversión con asesor financiero.",
    estimatedDuration: "30 min",
    icon: "Coins",
  },
  {
    vertical: "inversiones" as const,
    title: "Asesoría en Inversiones & Portafolios",
    description: "Evaluación de rentabilidad, portafolios diversificados y custodia de capital.",
    estimatedDuration: "45 min",
    icon: "TrendingUp",
  },
  {
    vertical: "seguros" as const,
    title: "Cotización y Emisión de Seguros",
    description: "Pólizas de salud, vida, accidentes, hogar y protección vehicular.",
    estimatedDuration: "30 min",
    icon: "ShieldCheck",
  },
  {
    vertical: "fit" as const,
    title: "Consulta Nutricional y Suplementación Fit",
    description: "Planes de suplementación deportiva, bienestar físico y asesoría nutricional.",
    estimatedDuration: "30 min",
    icon: "Dumbbell",
  },
  {
    vertical: "ecosistema" as const,
    title: "Atención Integral Ecosistema",
    description: "Orientación integral de múltiples servicios para personas y empresas.",
    estimatedDuration: "30 min",
    icon: "Building2",
  },
];
