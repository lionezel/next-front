import { LeadStatus } from "./common";

export type RiskProfile = 'conservador' | 'moderado' | 'dinamico';

export interface InvestmentPlan {
  id: string;
  name: string;
  tagline: string;
  riskProfile: RiskProfile;
  minCapital: number;
  expectedAnnualYieldPct: number; // e.g. 14.5%
  minTermMonths: number;
  liquidity: string; // e.g. "Mensual", "Trimestral", "Al vencimiento"
  description: string;
  benefits: string[];
  popular?: boolean;
}

export interface InvestmentSimulation {
  initialCapital: number;
  monthlyContribution: number;
  termMonths: number;
  expectedAnnualYieldPct: number;
  totalInvested: number;
  estimatedEarnings: number;
  finalBalance: number;
  growthTimeline: {
    month: number;
    invested: number;
    earnings: number;
    total: number;
  }[];
}

export interface InvestmentLead {
  id?: string;
  fullName: string;
  email: string;
  phone: string;
  city: string;
  investmentExperience: 'principiante' | 'intermedio' | 'avanzado';
  riskProfile: RiskProfile;
  intendedCapital: number;
  plannedTermMonths: number;
  preferredPlanId?: string;
  status: LeadStatus;
  notes?: string;
  source: string;
  createdAt?: any;
  updatedAt?: any;
}
