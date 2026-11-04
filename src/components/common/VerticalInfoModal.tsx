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
} from "lucide-react";
import { VerticalKey } from "@/src/types/common";

interface VerticalInfoModalProps {
  verticalKey: VerticalKey | null;
  onClose: () => void;
  onBookAppointment?: (verticalKey: VerticalKey) => void;
}

interface VerticalData {
  title: string;
  subtitle: string;
  badge: string;
  icon: any;
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

const VERTICALS_INFO: Record<VerticalKey, VerticalData> = {
  credito: {
    title: "Crédito & Financiación",
    subtitle: "Soluciones de liquidez ágil y transparente con acompañamiento financiero especializado",
    badge: "Desembolso en 24h",
    icon: Coins,
    accentColor: "text-emerald-700",
    iconBg: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
    badgeBg: "bg-emerald-50 text-emerald-800 border-emerald-200",
    headerGradient: "from-emerald-50/70 via-teal-50/20 to-white",
    topAccent: "from-emerald-500 via-teal-500 to-emerald-600",
    glowColor: "rgba(16, 185, 129, 0.12)",
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
    accentColor: "text-indigo-700",
    iconBg: "bg-indigo-50 text-indigo-700 border-indigo-200/80",
    badgeBg: "bg-indigo-50 text-indigo-800 border-indigo-200",
    headerGradient: "from-indigo-50/70 via-violet-50/20 to-white",
    topAccent: "from-indigo-500 via-violet-500 to-indigo-600",
    glowColor: "rgba(99, 102, 241, 0.12)",
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
    subtitle: "Protección integral para tu salud, tu familia, tus vehículos y tu patrimonio",
    badge: "Cobertura 24/7",
    icon: ShieldCheck,
    accentColor: "text-sky-700",
    iconBg: "bg-sky-50 text-sky-700 border-sky-200/80",
    badgeBg: "bg-sky-50 text-sky-800 border-sky-200",
    headerGradient: "from-sky-50/70 via-blue-50/20 to-white",
    topAccent: "from-sky-500 via-blue-500 to-sky-600",
    glowColor: "rgba(14, 165, 233, 0.12)",
    overview: {
      description:
        "Tranquilidad total para los imprevistos de la vida. Te conectamos con las mejores aseguradoras con pólizas integrales y asistencia nacional inmediata.",
      keyPoints: [
        "Pólizas de salud con acceso directo a especialistas sin trámites engorrosos",
        "Seguros de autos con asistencia en carretera y carro taller 24/7",
        "Pólizas de vida con respaldo familiar e indemnización ágil",
        "Coberturas transparentes sin letra pequeña ni sorpresas de deducibles",
      ],
    },
    solutions: [
      {
        title: "Seguro de Salud & Medicina Prepagada",
        desc: "Acceso a las mejores clínicas del país y atención médica domiciliaria.",
        highlight: "Planes familiares e individuales",
      },
      {
        title: "Póliza de Vida & Futuro Familiar",
        desc: "Protección económica integral para los tuyos ante cualquier eventualidad.",
        highlight: "Cobertura por invalidez y fallecimiento",
      },
      {
        title: "Seguro Todo Riesgo Vehículos",
        desc: "Pérdida total, daños a terceros, grúa y asistencia legal en carretera.",
        highlight: "Tarifas preferenciales por convenio",
      },
      {
        title: "Protección Hogar & Bienes",
        desc: "Respaldo contra incendios, inundaciones, terremotos y hurtos.",
        highlight: "Asistencias para cerrajería y plomería",
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
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6 overflow-y-auto">
        {/* Animated Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-md"
        />

        {/* Spacious, Elegant & Highly Animated Dialog Sheet */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
          className="relative w-full max-w-2xl lg:max-w-3xl bg-white rounded-t-[32px] sm:rounded-3xl shadow-2xl overflow-hidden z-10 mt-auto sm:my-auto flex flex-col max-h-[88vh] border border-slate-200/90"
          style={{
            boxShadow: `0 25px 60px -15px ${data.glowColor}, 0 10px 30px -10px rgba(0,0,0,0.1)`,
          }}
        >
          {/* Mobile Drag Indicator */}
          <div className="w-12 h-1.5 rounded-full bg-slate-300 mx-auto mt-3 mb-1 sm:hidden shrink-0" />

          {/* Top Gradient Accent Bar */}
          <div className={`h-1.5 w-full bg-gradient-to-r ${data.topAccent} shrink-0`} />

          {/* Elegant Airy Header */}
          <div className={`p-5 sm:p-7 bg-gradient-to-b ${data.headerGradient} border-b border-slate-100 shrink-0 relative overflow-hidden`}>
            {/* Ambient Background Glow */}
            <div
              className="absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl pointer-events-none opacity-60"
              style={{ backgroundColor: data.glowColor }}
            />

            <div className="flex items-start justify-between gap-4 relative z-10">
              <div className="flex items-start gap-3.5 sm:gap-4 min-w-0">
                <motion.div
                  initial={{ rotate: -10, scale: 0.8 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shrink-0 border shadow-sm bg-white ${data.iconBg}`}
                >
                  <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
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
