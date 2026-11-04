export type VerticalKey = 'credito' | 'inversiones' | 'seguros' | 'fit';

export type LeadStatus = 'pendiente' | 'contactado' | 'en_evaluacion' | 'aprobado' | 'rechazado' | 'completado';

export interface GeneralLead {
  id?: string;
  fullName: string;
  email: string;
  phone: string;
  city?: string;
  verticalInterest: VerticalKey | 'ecosistema';
  message?: string;
  source?: string;
  status: LeadStatus;
  createdAt?: any;
  updatedAt?: any;
}
