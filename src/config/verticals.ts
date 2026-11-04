import { VerticalKey } from "../types/common";

export interface VerticalConfig {
  key: VerticalKey;
  name: string;
  tagline: string;
  shortDesc: string;
  href: string;
  badge: string;
  isComingSoon?: boolean;
  comingSoonText?: string;
  colorScheme: {
    primary: string;
    primaryLight: string;
    primaryDark: string;
    accent: string;
    bgLight: string;
    border: string;
    gradient: string;
  };
  metrics: {
    label: string;
    value: string;
  }[];
  highlights: string[];
}

export const VERTICALS_CONFIG: Record<VerticalKey, VerticalConfig> = {
  credito: {
    key: 'credito',
    name: 'Crédito',
    tagline: 'Financiamiento Inteligente y Ágil',
    shortDesc: 'Líneas de crédito personal, libre inversión y para empresas con aprobación inmediata y las mejores tasas del mercado.',
    href: '/credito',
    badge: 'Desembolso en 24h',
    isComingSoon: false,
    colorScheme: {
      primary: '#059669',
      primaryLight: '#10B981',
      primaryDark: '#047857',
      accent: '#34D399',
      bgLight: 'bg-emerald-50/70',
      border: 'border-emerald-200',
      gradient: 'from-emerald-600 to-teal-700',
    },
    metrics: [
      { label: 'Tasa desde', value: '1.2% M.V.' },
      { label: 'Aprobación', value: '100% Digital' },
      { label: 'Monto hasta', value: '$100M COP' },
    ],
    highlights: [
      'Sin costos ocultos ni trámites engorrosos',
      'Plazos flexibles desde 6 hasta 72 meses',
      'Estudio de crédito sin costo en minutos',
    ],
  },
  inversiones: {
    key: 'inversiones',
    name: 'Inversiones',
    tagline: 'Rendimientos Sólidos para tu Futuro',
    shortDesc: 'Potencia tu patrimonio con portafolios diversificados, interés compuesto y estrategias financieras respaldadas.',
    href: '/inversiones',
    badge: 'Rentabilidad hasta 16.5% E.A.',
    isComingSoon: false,
    colorScheme: {
      primary: '#4F46E5',
      primaryLight: '#6366F1',
      primaryDark: '#3730A3',
      accent: '#818CF8',
      bgLight: 'bg-indigo-50/70',
      border: 'border-indigo-200',
      gradient: 'from-indigo-600 to-violet-700',
    },
    metrics: [
      { label: 'Rendimiento hasta', value: '16.5% E.A.' },
      { label: 'Desde', value: '$500,000 COP' },
      { label: 'Custodia', value: 'Segura y Auditada' },
    ],
    highlights: [
      'Portafolios conservadores, moderados y dinámicos',
      'Rendimientos periódicos o reinversión automática',
      'Acompañamiento personalizado por expertos',
    ],
  },
  seguros: {
    key: 'seguros',
    name: 'Seguros',
    tagline: 'Protección Integral para lo que más Amas',
    shortDesc: 'Pólizas de salud, vida, autos y protección patrimonial con cobertura inmediata y asistencia integral 24/7.',
    href: '/seguros',
    badge: 'Cobertura 24/7',
    isComingSoon: false,
    colorScheme: {
      primary: '#0284C7',
      primaryLight: '#0EA5E9',
      primaryDark: '#0369A1',
      accent: '#38BDF8',
      bgLight: 'bg-sky-50/70',
      border: 'border-sky-200',
      gradient: 'from-sky-600 to-blue-700',
    },
    metrics: [
      { label: 'Asistencia', value: '24/7 Inmediata' },
      { label: 'Planes desde', value: '$45,000 /mes' },
      { label: 'Red Médica', value: 'Nacional' },
    ],
    highlights: [
      'Pólizas sin deducibles sorpresa',
      'Gestión de siniestros 100% digital',
      'Asistencia en carretera, hogar y salud',
    ],
  },
  fit: {
    key: 'fit',
    name: 'Productos Fit',
    tagline: 'Nutrición, Bienestar y Alto Rendimiento',
    shortDesc: 'Suplementos certificados, nutrición deportiva y productos de bienestar diseñados para potenciar tu salud física y mental.',
    href: '/fit',
    badge: '100% Certificados',
    isComingSoon: false,
    colorScheme: {
      primary: '#D97706',
      primaryLight: '#F59E0B',
      primaryDark: '#B45309',
      accent: '#FBBF24',
      bgLight: 'bg-amber-50/70',
      border: 'border-amber-200',
      gradient: 'from-amber-600 to-orange-600',
    },
    metrics: [
      { label: 'Pureza', value: '100% Garantizada' },
      { label: 'Envío', value: 'A todo el país' },
      { label: 'Asesoría', value: 'Nutricional Gratis' },
    ],
    highlights: [
      'Proteínas aisladas, creatinas y aminoácidos premium',
      'Laboratorios con registro sanitario oficial',
      'Descuentos exclusivos por suscripción y combos',
    ],
  },
};

export const ECOSYSTEM_INFO = {
  name: 'Next Connection Group',
  fullName: 'Ecosistema Financiero & Bienestar Integral',
  tagline: 'Crédito, Inversiones, Seguros y Bienestar en una sola plataforma integrada',
  adminPortalUrl: 'http://localhost:3001', // Reference to next-admin
  contact: {
    phone: '+57 (300) 123-4567',
    whatsapp: '+573001234567',
    email: 'contacto@gruponext.com',
    address: 'Torre Empresarial Financiera, Calle 100 # 15-20, Bogotá, Colombia',
    schedule: 'Lunes a Viernes 8:00 AM - 6:00 PM',
  },
};

export const CALENDLY_CONFIG = {
  defaultUrl: process.env.NEXT_PUBLIC_CALENDLY_URL || 'https://calendly.com/d/cp3m-k3m-v8g',
  events: {
    general: {
      title: 'Asesoría General Integral',
      desc: 'Orientación 360° sobre todas las soluciones del ecosistema.',
      url: process.env.NEXT_PUBLIC_CALENDLY_GENERAL_URL || 'https://calendly.com/d/cp3m-k3m-v8g',
      duration: '30 min',
      color: 'sky',
    },
    credito: {
      title: 'Asesoría en Crédito & Financiación',
      desc: 'Evaluación de perfil crediticio, tasas y capacidad de endeudamiento.',
      url: process.env.NEXT_PUBLIC_CALENDLY_CREDITO_URL || 'https://calendly.com/d/cp3m-k3m-v8g',
      duration: '30 min',
      color: 'emerald',
    },
    inversiones: {
      title: 'Asesoría en Inversiones & Rendimientos',
      desc: 'Portafolios de alta rentabilidad, interés compuesto y diversificación.',
      url: process.env.NEXT_PUBLIC_CALENDLY_INVERSIONES_URL || 'https://calendly.com/d/cp3m-k3m-v8g',
      duration: '45 min',
      color: 'indigo',
    },
    seguros: {
      title: 'Asesoría en Seguros & Coberturas',
      desc: 'Cotización personalizada de pólizas de vida, salud, autos y hogar.',
      url: process.env.NEXT_PUBLIC_CALENDLY_SEGUROS_URL || 'https://calendly.com/d/cp3m-k3m-v8g',
      duration: '30 min',
      color: 'blue',
    },
    fit: {
      title: 'Asesoría Nutricional & Productos Fit',
      desc: 'Guía personalizada de suplementación deportiva y bienestar.',
      url: process.env.NEXT_PUBLIC_CALENDLY_FIT_URL || 'https://calendly.com/d/cp3m-k3m-v8g',
      duration: '20 min',
      color: 'amber',
    },
  },
};
