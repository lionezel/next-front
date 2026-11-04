import { LeadStatus } from "./common";

export type InsuranceCategory = 'salud' | 'vida' | 'vehiculo' | 'hogar' | 'pyme';

export interface CoverageItem {
  id: string;
  name: string;
  description: string;
  included: boolean;
  limitAmount?: string;
}

export interface InsurancePlan {
  id: string;
  category: InsuranceCategory;
  name: string;
  tagline: string;
  monthlyBasePrice: number; // in COP
  coverages: string[];
  features: string[];
  recommended?: boolean;
}

export interface InsuranceQuote {
  id?: string;
  fullName: string;
  documentNumber?: string;
  email: string;
  phone: string;
  city: string;
  category: InsuranceCategory;
  selectedPlanId: string;
  selectedPlanName: string;
  estimatedMonthlyPremium: number;
  coverageDetails?: string[];
  status: LeadStatus;
  notes?: string;
  source: string;
  createdAt?: any;
  updatedAt?: any;
}
