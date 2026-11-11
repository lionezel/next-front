"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Coins,
  TrendingUp,
  ShieldCheck,
  Dumbbell,
  Check,
  Calendar,
  ArrowRight,
  Shield,
  Clock,
  Award,
  Zap,
  BadgeCheck,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  HeartPulse,
  Car,
  FileCheck,
} from "lucide-react";
import { VerticalKey } from "@/src/types/common";
import {
  Finance3DVault,
  Insurance3DShield,
  Investment3DGrowth,
  Health3DHeart,
  Car3DAuto,
  Contract3DSeal,
  Lightning3DExpress,
} from "@/src/components/common/Icons3D";

export type ServiceModalKey =
  | VerticalKey
  | "salud_vida"
  | "poliza_autos"
  | "cumplimiento"
  | "viabilidad_24h";

interface VerticalInfoModalProps {
  verticalKey: ServiceModalKey | string | null;
  onClose: () => void;
  onBookAppointment?: (verticalKey: any) => void;
}

interface VerticalData {
  title: string;
  subtitle: string;
  badge: string;
  icon: any;
  icon3D?: React.ComponentType<{ width?: number | string; height?: number | string; className?: string }>;
  accentColor: string;
  iconBg: string;
  badgeBg: string;
  headerGradient: string;
  topAccent: string;
  glowColor: string;
  overview: {
    description: string;
    keyPoints: string[];
  };
  solutions: {
    title: string;
    desc: string;
    highlight: string;
  }[];
  benefits: {
    title: string;
    desc: string;
    icon: any;
  }[];
  requirements: string[];
  steps: {
    step: string;
    title: string;
    desc: string;
  }[];
}

const VERTICALS_INFO: Record<string, VerticalData> = {
  credito: {
    title: "Crédito & Financiación",
    subtitle: "Soluciones de liquidez ágil y transparente con acompañamiento financiero especializado",
    badge: "Desembolso en 24h",
    icon: Coins,
    icon3D: Finance3DVault,
    accentColor: "text-sky-700",
    iconBg: "bg-sky-50 text-sky-700 border-sky-200/80",
    badgeBg: "bg-sky-50 text-sky-800 border-sky-200",
    headerGradient: "from-sky-50/70 via-cyan-50/20 to-white",
    topAccent: "from-sky-500 via-sky-600 to-blue-600",
    glowColor: "rgba(2, 132, 199, 0.15)",
    overview: {
      description:
        "Diseñamos líneas de crédito con tasas competitivas y plazos flexibles. Aprobación 100% digital, sin comisiones imprevistas ni letras pequeñas.",
      keyPoints: [
        "Tasas fijas preferenciales durante todo el plazo pactado",
        "Acompañamiento individual por un especialista financiero",
        "Plazos cómodos estructurados de 6 a 72 meses",
        "Estudio ágil y desembolso directo a tu cuenta bancaria",
      ],
    },
    solutions: [
      {
        title: "Crédito de Libre Inversión",
        desc: "Financiación personal para consolidar deudas, proyectos personales o viajes.",
        highlight: "Desde $1M hasta $100M COP",
      },
      {
        title: "Crédito Comercial & PyME",
        desc: "Capital de trabajo, compra de inventario y expansión para tu empresa o negocio.",
        highlight: "Evaluación financiera a tu medida",
      },
      {
        title: "Libranza Institucional",
        desc: "Descuento por nómina con requisitos reducidos y tasa preferencial.",
        highlight: "Trámite ágil sin filas",
      },
      {
        title: "Financiación con Respaldo",
        desc: "Líneas respaldadas para acceder a montos superiores y plazos extendidos.",
        highlight: "Plazos amplios hasta 120 meses",
      },
    ],
    benefits: [
      {
        title: "Desembolso en 24h",
        desc: "Fondos en tu cuenta bancaria una vez validada la documentación básica.",
        icon: Zap,
      },
      {
        title: "Condiciones Claras",
        desc: "Sin cobros ocultos ni seguros forzados innecesarios.",
        icon: ShieldCheck,
      },
      {
        title: "Abonos a Capital",
        desc: "Paga antes de tiempo sin penalidades ni sanciones.",
        icon: Award,
      },
    ],
    requirements: [
      "Cédula de ciudadanía o extranjería vigente.",
      "Comprobantes de ingresos (extractos bancarios o certificación laboral reciente).",
      "Cuenta bancaria activa a nombre del titular para la transferencia.",
      "Tener entre 18 y 75 años de edad.",
    ],
    steps: [
      {
        step: "01",
        title: "Agenda tu Asesoría",
        desc: "Aparta tu cita virtual por Google Meet o presencial en sede.",
      },
      {
        step: "02",
        title: "Estudio & Aprobación",
        desc: "Analizamos tu perfil y te entregamos la mejor tasa disponible.",
      },
      {
        step: "03",
        title: "Firma Digital",
        desc: "Firma tu contrato de forma 100% electrónica y segura.",
      },
      {
        step: "04",
        title: "Desembolso Directo",
        desc: "Recibe los fondos en tu cuenta bancaria.",
      },
    ],
  },
  inversiones: {
    title: "Inversiones & Capital",
    subtitle: "Portafolios diversificados de alta rentabilidad con custodia segura de capital",
    badge: "Hasta 17.8% E.A.",
    icon: TrendingUp,
    icon3D: Investment3DGrowth,
    accentColor: "text-sky-700",
    iconBg: "bg-sky-50 text-sky-700 border-sky-200/80",
    badgeBg: "bg-sky-50 text-sky-800 border-sky-200",
    headerGradient: "from-sky-50/70 via-indigo-50/20 to-white",
    topAccent: "from-sky-500 via-blue-500 to-indigo-600",
    glowColor: "rgba(2, 132, 199, 0.15)",
    overview: {
      description:
        "Estrategias patrimoniales enfocadas en maximizar tu rentabilidad con bajo riesgo. Invierte en instrumentos respaldados con seguimiento en tiempo real.",
      keyPoints: [
        "Rendimientos proyectados y fijos de hasta el 17.8% E.A.",
        "Custodia y respaldo bajo esquemas legales verificados",
        "Diversificación inteligente en sectores productivos y fintech",
        "Abono periódico de utilidades directo a tu cuenta",
      ],
    },
    solutions: [
      {
        title: "Renta Fija Institucional",
        desc: "Rendimiento pactado con fechas claras de liquidación de intereses.",
        highlight: "Desde 3 meses en adelante",
      },
      {
        title: "Fondo de Crecimiento & Expansión",
        desc: "Participación en portafolios con diversificación activa de riesgo.",
        highlight: "Mayor potencial de rentabilidad",
      },
      {
        title: "Inversión Inmobiliaria Colectiva",
        desc: "Participa en proyectos de alta valorización con montos accesibles.",
        highlight: "Respaldo en finca raíz",
      },
      {
        title: "Planes de Ahorro Programado",
        desc: "Crea tu fondo para metas futuras con disciplina y tasa compuesta.",
        highlight: "Aportes mensuales flexibles",
      },
    ],
    benefits: [
      {
        title: "Contratos Auditados",
        desc: "Documentación legal con claridad absoluta sobre titularidad y garantías.",
        icon: ShieldCheck,
      },
      {
        title: "Interés Compuesto",
        desc: "Opción de reinvertir tus rendimientos para acelerar el crecimiento.",
        icon: TrendingUp,
      },
      {
        title: "Asesor Patrimonial",
        desc: "Un consultor asignado para resolver tus dudas de mercado.",
        icon: Award,
      },
    ],
    requirements: [
      "Documento de identidad vigente.",
      "Origen lícito de fondos declarado en formulario digital.",
      "Monto mínimo de apertura según la línea de inversión elegida.",
      "Cuenta bancaria para el depósito de rendimientos.",
    ],
    steps: [
      {
        step: "01",
        title: "Diagnóstico de Perfil",
        desc: "Definimos tus objetivos, horizonte de tiempo y nivel de rentabilidad.",
      },
      {
        step: "02",
        title: "Propuesta de Portafolio",
        desc: "Te presentamos una estructura personalizada con proyecciones claras.",
      },
      {
        step: "03",
        title: "Vinculación Digital",
        desc: "Registro de titularidad y apertura de tu cuenta de inversión.",
      },
      {
        step: "04",
        title: "Generación de Rendimientos",
        desc: "Monitorea tus ganancias desde tu portal de cliente.",
      },
    ],
  },
  seguros: {
    title: "Seguros & Coberturas 360°",
    subtitle: "Protección integral para tu salud, familia, vehículos y empresa. Comparamos +35 aseguradoras líderes",
    badge: "Asesoría Gratuita",
    icon: ShieldCheck,
    icon3D: Insurance3DShield,
    accentColor: "text-sky-700",
    iconBg: "bg-sky-50 text-sky-700 border-sky-200/80",
    badgeBg: "bg-sky-50 text-sky-800 border-sky-200",
    headerGradient: "from-sky-50/70 via-blue-50/20 to-white",
    topAccent: "from-sky-500 via-blue-500 to-sky-600",
    glowColor: "rgba(14, 165, 233, 0.15)",
    overview: {
      description:
        "Tranquilidad y respaldo absoluto ante cualquier imprevisto. Te conectamos con las mejores 35 compañías del país (Sura, Bolívar, Allianz, AXA, Mapfre, Seguros del Estado, Zurich, MetLife), defendiendo tus intereses y acompañándote en caso de reclamaciones.",
      keyPoints: [
        "Comparamos simultáneamente más de 35 aseguradoras para darte la mejor relación cobertura-precio",
        "Acompañamiento prioritario en siniestros: no te dejamos solo ante las aseguradoras",
        "Pólizas de salud con acceso directo a especialistas VIP y clínicas de alta complejidad",
        "Tarifas preferenciales por convenio institucional hasta 30% más económicas",
      ],
    },
    solutions: [
      {
        title: "Seguro de Salud & Medicina Prepagada",
        desc: "Acceso directo a especialistas, clínicas VIP y urgencias médicas domiciliarias sin copagos sorpresa.",
        highlight: "Planes familiares e individuales",
      },
      {
        title: "Póliza de Vida & Ahorro Patrimonial",
        desc: "Protección financiera para tu familia con opción de fondos de ahorro garantizado con interés compuesto.",
        highlight: "Inembargable y deducible de renta",
      },
      {
        title: "Seguro Todo Riesgo Vehículos",
        desc: "Pérdida total y parcial, vehículo de reemplazo, asistencia en carretera y grúa ilimitada 24/7.",
        highlight: "Hasta 30% OFF por convenio",
      },
      {
        title: "Seguros Empresariales & Colectivos",
        desc: "Responsabilidad Civil, D&O, Todo Riesgo Daño Material y pólizas colectivas de salud para empleados.",
        highlight: "Continuidad del negocio blindada",
      },
      {
        title: "Protección Hogar & Bienes",
        desc: "Respaldo contra incendios, inundaciones, terremotos, hurtos y daños de electrodomésticos.",
        highlight: "Desde $35.000 COP/mes",
      },
    ],
    benefits: [
      {
        title: "Asistencia Inmediata 24/7",
        desc: "Línea directa de emergencias para coordinar grúa, médico o asistencia en hogar.",
        icon: Clock,
      },
      {
        title: "Acompañamiento en Siniestros",
        desc: "Te asesoramos personalmente para que la aseguradora responda sin dilaciones.",
        icon: ShieldCheck,
      },
      {
        title: "Precios de Convenio",
        desc: "Tarifas corporativas más económicas que contratando como particular.",
        icon: Award,
      },
    ],
    requirements: [
      "Documento de identidad del tomador o titular.",
      "Datos básicos del bien a asegurar (tarjeta de propiedad en vehículos o dirección en hogar).",
      "Declaración de salud básica para pólizas médicas o de vida.",
    ],
    steps: [
      {
        step: "01",
        title: "Cotización Comparativa",
        desc: "Evaluamos las opciones de las aseguradoras líderes según tu presupuesto.",
      },
      {
        step: "02",
        title: "Personalización",
        desc: "Ajustamos coberturas y deducibles a lo que realmente necesitas.",
      },
      {
        step: "03",
        title: "Emisión de Póliza",
        desc: "Recibe tu carné y número de póliza digital directamente en tu correo.",
      },
      {
        step: "04",
        title: "Protección Activa",
        desc: "Soporte y respaldo permanente para cualquier trámite futuro.",
      },
    ],
  },
  fit: {
    title: "Nutrición & Productos Fit",
    subtitle: "Suplementación deportiva certificada con registro oficial y bienestar integral",
    badge: "Registro Invima",
    icon: Dumbbell,
    accentColor: "text-amber-700",
    iconBg: "bg-amber-50 text-amber-700 border-amber-200/80",
    badgeBg: "bg-amber-50 text-amber-800 border-amber-200",
    headerGradient: "from-amber-50/70 via-orange-50/20 to-white",
    topAccent: "from-amber-500 via-orange-500 to-amber-600",
    glowColor: "rgba(245, 158, 11, 0.12)",
    overview: {
      description:
        "Complementa tu estilo de vida activo con suplementación avalada, materias primas puras y asesoría de profesionales deportivos.",
      keyPoints: [
        "Proteínas aisladas e hidrolizadas con certificación oficial",
        "Creatinas monohidratadas micronizadas de máxima absorción",
        "Pre-entrenos, aminoácidos y multivitamínicos balanceados",
        "Descuento preferencial permanente para miembros del ecosistema",
      ],
    },
    solutions: [
      {
        title: "Proteínas Aisladas (Whey Isolate)",
        desc: "Bajas en carbohidratos y grasas para una absorción limpia y óptima.",
        highlight: "25g de proteína pura por servicio",
      },
      {
        title: "Creatina Monohidrato Creapure®",
        desc: "Fuerza, potencia y recuperación muscular comprobada científicamente.",
        highlight: "100% micronizada sin aditivos",
      },
      {
        title: "Pre-Entrenamientos & Energía",
        desc: "Foco mental, vascularización y resistencia para sesiones intensas.",
        highlight: "Fórmula balanceada sin bajón",
      },
      {
        title: "Salud Articular & Vitaminas",
        desc: "Colágeno hidrolizado, Omega 3 ultra-purificado y multivitamínicos.",
        highlight: "Recuperación y bienestar diario",
      },
    ],
    benefits: [
      {
        title: "Pureza Garantizada",
        desc: "Etiquetas transparentes y tabla nutricional verificada sin rellenos.",
        icon: BadgeCheck,
      },
      {
        title: "20% OFF Ecosistema",
        desc: "Descuento permanente para todos los miembros registrados en Next Connection.",
        icon: Award,
      },
      {
        title: "Envíos Seguros",
        desc: "Despacho protegido y rastreado hasta la puerta de tu casa.",
        icon: Zap,
      },
    ],
    requirements: [
      "Ser usuario registrado para redimir tu descuento del 20% OFF.",
      "Identificar tu objetivo físico (tonificación, fuerza o salud general).",
      "Dirección de envío completa para la transportadora.",
    ],
    steps: [
      {
        step: "01",
        title: "Selecciona tu Objetivo",
        desc: "Revisa los combos recomendados según tus metas físicas.",
      },
      {
        step: "02",
        title: "Aplica tu Descuento",
        desc: "Obtén tu 20% OFF automático como miembro de Next Connection.",
      },
      {
        step: "03",
        title: "Despacho Inmediato",
        desc: "Enviamos tu pedido con empaque seguro y número de guía.",
      },
      {
        step: "04",
        title: "Acompañamiento",
        desc: "Recibe tips prácticos de toma y nutrición para maximizar tus resultados.",
      },
    ],
  },
  salud_vida: {
    title: "Salud & Vida 360°",
    subtitle: "Medicina prepagada, pólizas de salud VIP y respaldo integral para ti y tu familia",
    badge: "Acceso Prioritario VIP",
    icon: HeartPulse,
    icon3D: Health3DHeart,
    accentColor: "text-sky-700",
    iconBg: "bg-sky-50 text-sky-700 border-sky-200/80",
    badgeBg: "bg-sky-50 text-sky-800 border-sky-200",
    headerGradient: "from-sky-50/70 via-rose-50/20 to-white",
    topAccent: "from-sky-500 via-rose-400 to-sky-600",
    glowColor: "rgba(2, 132, 199, 0.15)",
    overview: {
      description:
        "Cuida lo más valioso: la salud y el bienestar de quienes amas. Accede a las mejores redes clínicas del país con citas directas sin pasar por médico general, hospitalización en habitación individual y cobertura en el exterior.",
      keyPoints: [
        "Acceso directo a especialistas médicos sin autorizaciones complejas",
        "Habitación individual y atención prioritaria en las mejores clínicas",
        "Cobertura de maternidad, terapias y medicamentos de alta complejidad",
        "Tarifas especiales para grupos familiares y colectivos empresariales",
      ],
    },
    solutions: [
      {
        title: "Póliza de Salud Integral",
        desc: "Cobertura hospitalaria y ambulatoria completa al 100% en las mejores instituciones.",
        highlight: "Sin filas ni autorizaciones",
      },
      {
        title: "Medicina Prepagada Flexible",
        desc: "Planes ajustados a tu presupuesto con libre elección de especialistas y centros médicos.",
        highlight: "Red médica nacional e internacional",
      },
      {
        title: "Seguro de Vida & Invalidez",
        desc: "Protección del futuro económico de tus beneficiarios ante cualquier eventualidad imprevista.",
        highlight: "Indemnización directa inembargable",
      },
      {
        title: "Asistencia Médica Domiciliaria",
        desc: "Médico general y pediatra en casa 24/7 y orientación telefónica continua.",
        highlight: "Atención ágil en minutos",
      },
    ],
    benefits: [
      {
        title: "Trámite 100% Acompañado",
        desc: "Gestionamos tus autorizaciones y reembolsos directamente.",
        icon: ShieldCheck,
      },
      {
        title: "Cobertura Internacional",
        desc: "Asistencia médica de emergencia en tus viajes al exterior.",
        icon: Award,
      },
      {
        title: "Atención Inmediata",
        desc: "Líneas de urgencia prioritarias disponibles las 24 horas.",
        icon: Clock,
      },
    ],
    requirements: [
      "Documento de identidad de cada miembro a afiliar.",
      "Diligenciamiento de la declaración de asegurabilidad digital.",
      "Afiliación activa al sistema general de salud (EPS).",
    ],
    steps: [
      {
        step: "01",
        title: "Evaluación Médica",
        desc: "Revisamos tu grupo familiar y necesidades clínicas particulares.",
      },
      {
        step: "02",
        title: "Cuadro Comparativo",
        desc: "Comparamos tarifas y coberturas entre Sura, Allianz, Colmédica y Bolívar.",
      },
      {
        step: "03",
        title: "Emisión & Carnetización",
        desc: "Activación inmediata de tus carnés digitales en tu celular.",
      },
      {
        step: "04",
        title: "Respaldo Continuo",
        desc: "Asignación de asesor personal para citas y trámites.",
      },
    ],
  },
  poliza_autos: {
    title: "Póliza Todo Riesgo Autos",
    subtitle: "Protección total para tu vehículo con asistencia ilimitada y los deducibles más bajos",
    badge: "Ahorra hasta 35%",
    icon: Car,
    icon3D: Car3DAuto,
    accentColor: "text-sky-700",
    iconBg: "bg-sky-50 text-sky-700 border-sky-200/80",
    badgeBg: "bg-sky-50 text-sky-800 border-sky-200",
    headerGradient: "from-sky-50/70 via-cyan-50/20 to-white",
    topAccent: "from-sky-500 via-sky-600 to-cyan-500",
    glowColor: "rgba(2, 132, 199, 0.15)",
    overview: {
      description:
        "Conduce con total tranquilidad. Tu auto está protegido contra pérdida total, hurto, choques, daños a terceros y eventos naturales. Incluye grúa sin límite de kilómetros y carro sustituto.",
      keyPoints: [
        "Responsabilidad Civil Extracontractual ampliada hasta $4.000 millones",
        "Amparo total por pérdida parcial o total por daños y hurto",
        "Vehículo de reemplazo mientras el tuyo está en taller",
        "Asistencia jurídica en el sitio del siniestro en todo el país",
      ],
    },
    solutions: [
      {
        title: "Todo Riesgo Premium",
        desc: "Cero deducible en pérdidas totales, taller de concesionario y conductor elegido ilimitado.",
        highlight: "La cobertura más completa",
      },
      {
        title: "Todo Riesgo Estándar",
        desc: "Excelente balance cobertura/precio para vehículos familiares de uso particular.",
        highlight: "Deducible módico fijo",
      },
      {
        title: "Póliza de Responsabilidad Civil Pura",
        desc: "Respaldo jurídico y financiero si causas daños a otros vehículos o personas.",
        highlight: "Económica y obligatoria para blindarte",
      },
      {
        title: "Flotas & Vehículos Comerciales",
        desc: "Tarifas especiales para camionetas, utilitarios y flotas empresariales de trabajo.",
        highlight: "Tarifa corporativa por volumen",
      },
    ],
    benefits: [
      {
        title: "Grúa & Asistencia 24/7",
        desc: "Remolque, cerrajería vial, paso de corriente y cambio de llanta en minutos.",
        icon: Clock,
      },
      {
        title: "Carro de Reemplazo",
        desc: "No te quedes a pie: recibe un vehículo sustituto durante reparaciones.",
        icon: Car,
      },
      {
        title: "Defensa Legal Incluida",
        desc: "Abogados especializados te representan ante fiscalía o tránsito.",
        icon: ShieldCheck,
      },
    ],
    requirements: [
      "Tarjeta de propiedad del vehículo o factura de compra.",
      "Cédula del propietario o tomador.",
      "Inspección física o virtual por app según el modelo del auto.",
    ],
    steps: [
      {
        step: "01",
        title: "Ingreso de Placa",
        desc: "Con solo la placa y modelo cotizamos en +35 aseguradoras simultáneamente.",
      },
      {
        step: "02",
        title: "Selección de Opción",
        desc: "Eliges la propuesta con mejor deducible y precio para ti.",
      },
      {
        step: "03",
        title: "Inspección Rápida",
        desc: "Inspección en taller aliado, a domicilio o 100% digital por fotos.",
      },
      {
        step: "04",
        title: "Emisión Inmediata",
        desc: "Tu carro queda asegurado desde el primer minuto con carné digital.",
      },
    ],
  },
  cumplimiento: {
    title: "Cumplimiento & Licitaciones",
    subtitle: "Garantías y pólizas fiduciarias para contratos con el Estado, privadas y obra civil",
    badge: "Emisión en 24h",
    icon: FileCheck,
    icon3D: Contract3DSeal,
    accentColor: "text-sky-700",
    iconBg: "bg-sky-50 text-sky-700 border-sky-200/80",
    badgeBg: "bg-sky-50 text-sky-800 border-sky-200",
    headerGradient: "from-sky-50/70 via-amber-50/20 to-white",
    topAccent: "from-sky-500 via-amber-400 to-sky-600",
    glowColor: "rgba(2, 132, 199, 0.15)",
    overview: {
      description:
        "Respaldo técnico y financiero para que tu empresa gane y ejecute contratos con tranquilidad. Emitimos pólizas de seriedad de la oferta, buen manejo del anticipo, cumplimiento del contrato, salarios y prestaciones sociales, y estabilidad de obra.",
      keyPoints: [
        "Líneas de cupo ágiles pre-aprobadas para licitantes frecuentes",
        "Emisión garantizada en menos de 24 horas para cierres de licitación",
        "Validación fiduciaria y fianza con aseguradoras avaladas por el SECOP",
        "Acompañamiento por abogados especialistas en contratación estatal",
      ],
    },
    solutions: [
      {
        title: "Seriedad de la Oferta",
        desc: "Garantiza tu propuesta en licitaciones públicas o privadas desde la presentación.",
        highlight: "Emisión express el mismo día",
      },
      {
        title: "Cumplimiento de Contrato & Calidad",
        desc: "Ampara la correcta ejecución de las obligaciones contractuales acordadas.",
        highlight: "Aceptadas por el 100% de entidades",
      },
      {
        title: "Buen Manejo de Anticipo",
        desc: "Garantiza la correcta inversión de los fondos recibidos para el arranque de obra.",
        highlight: "Protección integral del flujo de caja",
      },
      {
        title: "Salarios & Prestaciones Sociales",
        desc: "Cubre a los trabajadores vinculados a la ejecución del contrato.",
        highlight: "Cumplimiento laboral blindado",
      },
    ],
    benefits: [
      {
        title: "Aprobación Rápida de Cupos",
        desc: "Estudio de estados financieros en tiempo récord para que no pierdas licitaciones.",
        icon: Zap,
      },
      {
        title: "Aceptación Nacional",
        desc: "Pólizas con respaldo de las principales aseguradoras de fianza de Colombia.",
        icon: Award,
      },
      {
        title: "Asesoría Contractual",
        desc: "Revisión preventiva de los pliegos y condiciones por expertos legales.",
        icon: ShieldCheck,
      },
    ],
    requirements: [
      "RUT y Cámara de Comercio reciente de la empresa contratista.",
      "Estados financieros de los dos últimos años con notas de contador.",
      "Pliego de condiciones o borrador/minuta del contrato a suscribir.",
    ],
    steps: [
      {
        step: "01",
        title: "Envío del Pliego o Minuta",
        desc: "Nos compartes los requerimientos del contratante o SECOP.",
      },
      {
        step: "02",
        title: "Estudio Financiero",
        desc: "Apertura o uso de cupo fiduciario con la aseguradora aliada.",
      },
      {
        step: "03",
        title: "Emisión de la Póliza",
        desc: "Generación de la póliza con firma digital y constancia de pago.",
      },
      {
        step: "04",
        title: "Cargue al SECOP o Entrega",
        desc: "Entrega del documento listo para legalizar y arrancar el contrato.",
      },
    ],
  },
  viabilidad_24h: {
    title: "Viabilidad Express 24h",
    subtitle: "Diagnóstico financiero y pre-aprobación ágil sin afectar tu puntaje en centrales de riesgo",
    badge: "Diagnóstico Sin Costo",
    icon: Zap,
    icon3D: Lightning3DExpress,
    accentColor: "text-sky-700",
    iconBg: "bg-sky-50 text-sky-700 border-sky-200/80",
    badgeBg: "bg-sky-50 text-sky-800 border-sky-200",
    headerGradient: "from-sky-50/70 via-yellow-50/20 to-white",
    topAccent: "from-sky-500 via-yellow-400 to-sky-600",
    glowColor: "rgba(2, 132, 199, 0.15)",
    overview: {
      description:
        "¿No sabes cuánto te pueden prestar o qué banco te ofrece la tasa más baja? Con nuestro sistema inteligente evaluamos tu perfil crediticio en más de 35 bancos y cooperativas al instante, identificando la mejor opción sin desgastes ni rechazos.",
      keyPoints: [
        "Diagnóstico financiero 100% gratuito sin costo de consulta",
        "Consulta preventiva sin huella negativa en centrales de riesgo (Datacrédito / TransUnion)",
        "Pre-aprobación formal en menos de 24 horas con montos y cuotas reales",
        "Ruta clara para mejorar tu capacidad de endeudamiento y saneamiento financiero",
      ],
    },
    solutions: [
      {
        title: "Pre-Aprobación Multibanco",
        desc: "Simulación simultánea en 35 entidades financieras con un solo formulario.",
        highlight: "Compara tasas en una sola pantalla",
      },
      {
        title: "Diagnóstico de Capacidad de Pago",
        desc: "Análisis exacto de cuánto puedes solicitar según tus ingresos y gastos fijos.",
        highlight: "Evita rechazos bancarios",
      },
      {
        title: "Estrategia de Consolidación",
        desc: "Unificación de deudas para reducir tu cuota mensual hasta en un 40%.",
        highlight: "Alivia tu flujo de caja",
      },
      {
        title: "Asesoría Especializada 1 a 1",
        desc: "Un especialista analiza tu caso y te guía en la documentación necesaria.",
        highlight: "Acompañamiento hasta el desembolso",
      },
    ],
    benefits: [
      {
        title: "Respuesta en Menos de 24h",
        desc: "Conoce tu viabilidad real de aprobación antes de radicar documentos.",
        icon: Zap,
      },
      {
        title: "Cero Costos Ocultos",
        desc: "El diagnóstico y la asesoría inicial son 100% gratuitos.",
        icon: Award,
      },
      {
        title: "Sin Afectar Centrales",
        desc: "Consulta preventiva controlada que protege tu score crediticio.",
        icon: ShieldCheck,
      },
    ],
    requirements: [
      "Cédula de ciudadanía del solicitante.",
      "Monto estimado de crédito requerido y plazo deseado.",
      "Ingresos mensuales aproximados (empleado, independiente o pensionado).",
    ],
    steps: [
      {
        step: "01",
        title: "Solicitud Express",
        desc: "Diligencias el formulario rápido o reservas tu asesoría en tiempo real.",
      },
      {
        step: "02",
        title: "Diagnóstico del Perfil",
        desc: "Corremos el simulador multibanco con tus parámetros.",
      },
      {
        step: "03",
        title: "Presentación de Opciones",
        desc: "Te mostramos las 3 mejores ofertas bancarias con sus tasas.",
      },
      {
        step: "04",
        title: "Radicación & Desembolso",
        desc: "Avanzamos con la entidad elegida para el desembolso ágil.",
      },
    ],
  },
};

export default function VerticalInfoModal({
  verticalKey,
  onClose,
  onBookAppointment,
}: VerticalInfoModalProps) {
  const [activeTab, setActiveTab] = useState<"soluciones" | "requisitos">("soluciones");

  if (!verticalKey) return null;
  const data = VERTICALS_INFO[verticalKey];
  if (!data) return null;

  const Icon = data.icon;
  const Icon3D = data.icon3D;

  const handleActionBook = () => {
    onClose();
    if (onBookAppointment) {
      onBookAppointment(verticalKey);
    } else {
      window.location.href = `/citas?specialty=${verticalKey}`;
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-5 md:p-6 overflow-y-auto">
        {/* Animated Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-md"
        />

        {/* Spacious, Elegant Floating Dialog (Separated on Mobile & PC) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
          className="relative w-full max-w-2xl lg:max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 my-auto flex flex-col max-h-[88vh] border border-slate-200/90 mx-auto"
          style={{
            boxShadow: `0 25px 60px -15px ${data.glowColor}, 0 10px 30px -10px rgba(0,0,0,0.1)`,
          }}
        >
          {/* Top Gradient Accent Bar */}
          <div className={`h-1.5 w-full bg-gradient-to-r ${data.topAccent} shrink-0`} />

          {/* Elegant Airy Header */}
          <div className={`p-4 sm:p-7 bg-gradient-to-b ${data.headerGradient} border-b border-slate-100 shrink-0 relative overflow-hidden`}>
            {/* Ambient Background Glow */}
            <div
              className="absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl pointer-events-none opacity-60"
              style={{ backgroundColor: data.glowColor }}
            />

            <div className="flex items-start justify-between gap-3 sm:gap-4 relative z-10">
              <div className="flex items-start gap-3 sm:gap-4 min-w-0">
                <motion.div
                  initial={{ rotate: -8, scale: 0.85 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center shrink-0 border border-sky-100 shadow-sm bg-gradient-to-b from-white to-sky-50/60 p-1"
                >
                  {Icon3D ? (
                    <Icon3D width={46} height={46} className="drop-shadow-sm" />
                  ) : (
                    <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-sky-600" />
                  )}
                </motion.div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border shadow-2xs ${data.badgeBg}`}>
                      {data.badge}
                    </span>
                    <span className="text-[11px] text-slate-400 font-semibold tracking-wide">
                      Next Connection
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight leading-tight truncate">
                    {data.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 font-normal mt-1 leading-relaxed line-clamp-2">
                    {data.subtitle}
                  </p>
                </div>
              </div>

              {/* Close Button with Micro-Interaction */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white hover:bg-slate-100 text-slate-400 hover:text-slate-900 flex items-center justify-center transition-colors shrink-0 shadow-2xs border border-slate-200"
                aria-label="Cerrar modal"
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Elegant Sliding Animated Tabs */}
            <div className="flex items-center p-1 bg-slate-100/80 rounded-2xl mt-5 border border-slate-200/60 relative">
              <button
                type="button"
                onClick={() => setActiveTab("soluciones")}
                className={`relative flex-1 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-colors z-10 ${
                  activeTab === "soluciones" ? "text-slate-900" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {activeTab === "soluciones" && (
                  <motion.div
                    layoutId="activeModalTabIndicator"
                    className="absolute inset-0 bg-white rounded-xl shadow-xs border border-slate-200/80 -z-10"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span>Líneas & Beneficios</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("requisitos")}
                className={`relative flex-1 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-colors z-10 ${
                  activeTab === "requisitos" ? "text-slate-900" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {activeTab === "requisitos" && (
                  <motion.div
                    layoutId="activeModalTabIndicator"
                    className="absolute inset-0 bg-white rounded-xl shadow-xs border border-slate-200/80 -z-10"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span>Requisitos & Proceso</span>
              </button>
            </div>
          </div>

          {/* Modal Body: Spacious & Non-Cramped */}
          <div className="p-5 sm:p-7 overflow-y-auto space-y-6 flex-1 bg-slate-50/40">
            <AnimatePresence mode="wait">
              {/* ============================================================== */}
              {/* TAB 1: LÍNEAS & BENEFICIOS */}
              {/* ============================================================== */}
              {activeTab === "soluciones" && (
                <motion.div
                  key="tab-soluciones"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  {/* Spacious Overview Card */}
                  <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span>Propuesta de Valor</span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                      {data.overview.description}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                      {data.overview.keyPoints.map((point, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 font-medium">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="leading-snug">{point}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Solutions Grid with Micro-Interactions */}
                  <div className="space-y-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block px-1">
                      Líneas & Opciones Disponibles
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {data.solutions.map((sol, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          whileHover={{ y: -3, scale: 1.01 }}
                          className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-slate-300 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <h4 className="text-sm font-extrabold text-slate-900 leading-snug">
                                {sol.title}
                              </h4>
                            </div>
                            <p className="text-xs text-slate-500 leading-relaxed font-normal mb-3">
                              {sol.desc}
                            </p>
                          </div>

                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200/60">
                              {sol.highlight}
                            </span>
                            <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-0.5">
                              <span>Incluido</span>
                              <ChevronRight className="w-3 h-3" />
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Benefits Row */}
                  <div className="space-y-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block px-1">
                      Ventajas Diferenciales
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {data.benefits.map((b, idx) => {
                        const BIcon = b.icon;
                        return (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 + idx * 0.05 }}
                            whileHover={{ y: -2 }}
                            className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-2"
                          >
                            <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-800">
                              <BIcon className="w-4 h-4 text-emerald-600" />
                            </div>
                            <h5 className="text-xs font-bold text-slate-900">{b.title}</h5>
                            <p className="text-[11px] text-slate-500 leading-snug">{b.desc}</p>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ============================================================== */}
              {/* TAB 2: REQUISITOS & PROCESO */}
              {/* ============================================================== */}
              {activeTab === "requisitos" && (
                <motion.div
                  key="tab-requisitos"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  {/* Requirements Checklist */}
                  <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                        Documentación Básica Requerida
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {data.requirements.map((req, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -6 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700"
                        >
                          <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                          <span className="leading-snug font-medium">{req}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* 4 Steps Timeline */}
                  <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-800 block">
                      Paso a Paso del Servicio
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {data.steps.map((st, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          whileHover={{ scale: 1.01 }}
                          className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors"
                        >
                          <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-mono text-xs font-bold flex items-center justify-center shrink-0 shadow-2xs">
                            {st.step}
                          </span>
                          <div>
                            <p className="text-xs font-bold text-slate-900">{st.title}</p>
                            <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{st.desc}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom Action Footer with Spring Animation */}
          <div className="p-4 sm:p-5 bg-white border-t border-slate-200/80 shrink-0">
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={handleActionBook}
              className="w-full py-3.5 sm:py-4 px-6 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-sm transition-all"
            >
              <Calendar className="w-4 h-4 text-slate-300" />
              <span>Agendar Asesoría con este Servicio</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
