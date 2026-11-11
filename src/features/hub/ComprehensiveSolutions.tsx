"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  Building2,
  Coins,
  TrendingUp,
  HeartPulse,
  Car,
  Home,
  Briefcase,
  Users,
  FileCheck2,
  Clock,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  Award,
  Sparkles,
  Zap,
} from "lucide-react";

type SolutionCategory = "individual_insurance" | "corporate_insurance" | "credit" | "investments";

export default function ComprehensiveSolutions() {
  const [activeTab, setActiveTab] = useState<SolutionCategory>("individual_insurance");

  const categories = [
    {
      id: "individual_insurance" as SolutionCategory,
      label: "Seguros Individuales & Familia",
      shortLabel: "Individuales",
      icon: ShieldCheck,
      color: "text-sky-600",
      activeBg: "bg-sky-600 text-white shadow-md shadow-sky-500/20",
      description: "Protección patrimonial integral y salud sin copagos sorpresa para ti y los que más amas.",
    },
    {
      id: "corporate_insurance" as SolutionCategory,
      label: "Seguros Empresariales & Colectivos",
      shortLabel: "Empresariales",
      icon: Building2,
      color: "text-blue-600",
      activeBg: "bg-blue-600 text-white shadow-md shadow-blue-500/20",
      description: "Continuidad del negocio, responsabilidad civil y pólizas colectivas de vida y salud para colaboradores.",
    },
    {
      id: "credit" as SolutionCategory,
      label: "Crédito & Liquidez Ágil",
      shortLabel: "Créditos",
      icon: Coins,
      color: "text-emerald-600",
      activeBg: "bg-emerald-600 text-white shadow-md shadow-emerald-500/20",
      description: "Desembolso en 24h con estudio 100% digital y sin costos ocultos.",
    },
    {
      id: "investments" as SolutionCategory,
      label: "Inversiones & Ahorro Patrimonial",
      shortLabel: "Inversiones",
      icon: TrendingUp,
      color: "text-indigo-600",
      activeBg: "bg-indigo-600 text-white shadow-md shadow-indigo-500/20",
      description: "Estrategias de rentabilidad institucional y fondos con objetivos para tu futuro.",
    },
  ];

  const solutions = {
    individual_insurance: [
      {
        title: "Póliza de Salud & Medicina Prepagada",
        tagline: "Atención médica VIP sin filas ni autorizaciones engorrosas",
        icon: HeartPulse,
        allies: "Sura, Allianz, AXA Colpatria, Seguros Bolívar",
        features: [
          "Acceso directo a especialistas y clínicas de alta complejidad",
          "Cobertura hospitalaria 100% y cirugías programadas",
          "Asistencia médica domiciliaria y cobertura internacional",
        ],
        highlight: "Comparamos 8 opciones para darte el mejor costo mensual",
      },
      {
        title: "Seguro de Vida & Respaldo Patrimonial",
        tagline: "Protección familiar con opción de fondo de ahorro garantizado",
        icon: Award,
        allies: "MetLife, Pan-American Life, Sura, Bolívar",
        features: [
          "Indemnización inmediata ante fallecimiento o incapacidad total",
          "Fondos de ahorro programado para educación de hijos o retiro",
          "Inembargable y con beneficios tributarios en Colombia",
        ],
        highlight: "Planes con devolución de primas e interés compuesto",
      },
      {
        title: "Seguro Todo Riesgo Vehículos & Movilidad",
        tagline: "Tranquilidad en cada kilómetro con asistencia 24/7",
        icon: Car,
        allies: "Sura, Mapfre, HDI, Seguros del Estado, Liberty",
        features: [
          "Pérdida total y parcial por daños o hurto",
          "Vehículo de reemplazo y grúa ilimitada a nivel nacional",
          "Responsabilidad civil extracontractual con amplia cobertura",
        ],
        highlight: "Tarifas con hasta 30% de descuento por convenio colectivo",
      },
      {
        title: "Seguro de Hogar & Bienes Personales",
        tagline: "Tu patrimonio seguro ante desastres, incendios o robos",
        icon: Home,
        allies: "Seguros Bolívar, Zurich, Allianz, Mapfre",
        features: [
          "Amparo contra terremoto, inundación, incendio y asonada",
          "Cobertura de electrodomésticos y equipos portátiles",
          "Plomería, cerrajería y electricidad de emergencia 24/7",
        ],
        highlight: "Protege el esfuerzo de toda una vida desde $35.000 COP/mes",
      },
    ],
    corporate_insurance: [
      {
        title: "Responsabilidad Civil Extracontractual & D&O",
        tagline: "Protección legal y patrimonial para la empresa y directivos",
        icon: Briefcase,
        allies: "Chubb, Berkley, Allianz, Seguros del Estado",
        features: [
          "Amparo ante perjuicios o daños ocasionados a terceros",
          "Protección del patrimonio personal de directores y administradores",
          "Gastos de defensa jurídica y representación legal calificada",
        ],
        highlight: "Cumplimiento obligatorio para contrataciones y licitaciones",
      },
      {
        title: "Pólizas Colectivas de Salud & Vida para Empleados",
        tagline: "Beneficios de alto impacto que fidelizan el talento humano",
        icon: Users,
        allies: "Sura, AXA Colpatria, Seguros Bolívar",
        features: [
          "Planes colectivos con tarifas preferenciales para nómina",
          "Deducción del 100% del gasto en renta corporativa",
          "Acceso a telemedicina, chequeos preventivos y bienestar",
        ],
        highlight: "Mayor productividad y retención del equipo clave",
      },
      {
        title: "Todo Riesgo Daño Material & Cumplimiento",
        tagline: "Garantías contractuales y protección física de activos",
        icon: FileCheck2,
        allies: "Seguros del Estado, Sura, Nacional de Seguros, Mapfre",
        features: [
          "Pólizas de cumplimiento ante entidades públicas y privadas",
          "Protección de bodegas, maquinaria, mercancía e inventario",
          "Amparo por lucro cesante ante interrupción de operaciones",
        ],
        highlight: "Radicación y expedición ágil para no frenar contratos",
      },
      {
        title: "Seguro de Transporte de Mercancías",
        tagline: "Carga nacional e internacional protegida punto a punto",
        icon: Building2,
        allies: "Mapfre, Zurich, HDI, Allianz",
        features: [
          "Cobertura terrestre, marítima y aérea sin vacíos",
          "Pólizas flotantes por despacho o contrato anual",
          "Inspección rápida y liquidación prioritaria de siniestros",
        ],
        highlight: "Indispensable para importadores, distribuidores y logística",
      },
    ],
    credit: [
      {
        title: "Crédito de Libre Inversión",
        tagline: "Liquidez inmediata para cualquier meta o consolidación",
        icon: Coins,
        allies: "Bancolombia, Banco de Bogotá, Fondos Aliados",
        features: [
          "Montos desde $2M hasta $80M COP según tu capacidad",
          "Tasa fija competitiva desde el 1.25% M.V.",
          "Sin comisiones de estudio ni penalidades por prepago",
        ],
        highlight: "Desembolso garantizado en menos de 24 horas hábiles",
      },
      {
        title: "Crédito Comercial & Capital de Trabajo",
        tagline: "Impulsa tu negocio, compra inventario o financia proyectos",
        icon: Zap,
        allies: "Bancos aliados y cooperativas financieras",
        features: [
          "Evaluación financiera a la medida de tu facturación o flujo de caja",
          "Plazos de amortización flexibles de 6 a 60 meses",
          "Acompañamiento en la estructuración del expediente crediticio",
        ],
        highlight: "Atención prioritaria para personas jurídicas e independientes",
      },
      {
        title: "Libranza y Convenios de Nómina",
        tagline: "Las tasas más bajas del mercado con descuento automático",
        icon: FileCheck2,
        allies: "Entidades autorizadas y fondos de empleados",
        features: [
          "Sin necesidad de codeudores ni fiadores",
          "Aprobación rápida aún con perfiles en evaluación en centrales",
          "Plazos de hasta 72 meses para cuotas muy cómodas",
        ],
        highlight: "La mejor alternativa para sanear y unificar deudas caras",
      },
    ],
    investments: [
      {
        title: "Renta Fija Institucional & CDTs Digitales",
        tagline: "Rendimiento pactado con fechas claras y capital 100% blindado",
        icon: TrendingUp,
        allies: "Comisionistas, Fiduciarias y Entidades Vigiladas",
        features: [
          "Tasas proyectadas de hasta el 17.8% E.A. garantizadas por contrato",
          "Plazos desde 3, 6, 12 hasta 24 meses según tus planes",
          "Liquidación periódica de utilidades directo a tu cuenta bancaria",
        ],
        highlight: "Supera la inflación con tranquilidad y certeza",
      },
      {
        title: "Fondos de Ahorro Programado con Objetivos",
        tagline: "Construye el patrimonio para la educación, retiro o vivienda",
        icon: Sparkles,
        allies: "Goque Group Partners, Fiduciarias Internacionales",
        features: [
          "Aportes mensuales accesibles con poder de interés compuesto",
          "Asignación de un Asesor Patrimonial certificado sin costo",
          "Flexibilidad de retiro y coberturas de vida integradas",
        ],
        highlight: "Disciplina financiera con rendimientos por encima del promedio",
      },
      {
        title: "Inversión Colectiva Inmobiliaria",
        tagline: "Participa en proyectos de alta valorización con montos accesibles",
        icon: Building2,
        allies: "Desarrolladores y fondos de inversión inmobiliaria",
        features: [
          "Respaldo en activos tangibles de finca raíz en zonas de alta plusvalía",
          "Rendimientos por valorización y renta comercial periódica",
          "Auditoría legal y fiduciaria completa de cada proyecto",
        ],
        highlight: "Acceso democratizado a las rentas del sector inmobiliario",
      },
    ],
  };

  const handleOpenAppointment = (serviceCategory: string) => {
    let specialtyKey = "seguros";
    if (serviceCategory === "credit") specialtyKey = "credito";
    if (serviceCategory === "investments") specialtyKey = "inversiones";

    window.dispatchEvent(
      new CustomEvent("set-appointment-specialty", {
        detail: { specialty: specialtyKey },
      })
    );

    const el = document.getElementById("agenda-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-white border-b border-slate-200/90 relative">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700">
            <ShieldCheck className="w-4 h-4 text-sky-600" />
            <span>Portafolio Multisolución 360°</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
            Todo lo que necesitas para proteger y hacer crecer tu patrimonio
          </h2>
          <p className="text-xs sm:text-base text-slate-600 leading-relaxed">
            Inspirados en las mejores prácticas de corretaje y gestión patrimonial: comparamos más de 35 compañías aliadas para que tú siempre tengas la mejor tarifa, cobertura y respaldo.
          </p>
        </div>

        {/* Categories Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-8 sm:mb-12">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeTab === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveTab(cat.id)}
                className={`flex items-center gap-2 px-3.5 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? cat.activeBg
                    : "bg-slate-100/80 text-slate-700 hover:bg-slate-200/80 border border-slate-200/80"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-white" : cat.color}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Context Banner */}
        <div className="mb-6 sm:mb-8 p-3.5 sm:p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2 text-slate-700 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
            <span>{categories.find((c) => c.id === activeTab)?.description}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-500 font-bold shrink-0 text-xs">
            <Award className="w-3.5 h-3.5 text-amber-500" />
            <span>Asesoría 100% gratuita y sin compromiso</span>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {solutions[activeTab].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex flex-col justify-between p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/90 hover:border-slate-300 hover:shadow-lg transition-all duration-300 group relative"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="w-11 h-11 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800 group-hover:scale-105 group-hover:bg-sky-50 group-hover:text-sky-700 transition-all">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50 border border-slate-200/60 px-2 py-0.5 rounded-full">
                      Convenio Aliado
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-sky-700 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                      {item.tagline}
                    </p>
                  </div>

                  {/* Highlights Bullet List */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    {item.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2 text-xs text-slate-600 font-normal">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 space-y-3">
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-200/70 text-[11px] text-slate-700 font-semibold flex items-center justify-between">
                    <span className="text-slate-500 font-normal">Diferencial:</span>
                    <span className="text-slate-900 font-bold">{item.highlight}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenAppointment(activeTab)}
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <span>Solicitar Asesoría Gratuita</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Global Value Proposition Pill Inspired by Poliseguros & Goque */}
        <div className="mt-10 sm:mt-14 p-5 sm:p-7 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden shadow-xl">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                <CheckCircle2 className="w-3 h-3" />
                Defensa y Acompañamiento en Siniestros
              </span>
              <h3 className="text-lg sm:text-2xl font-black">
                ¿Qué pasa si tienes un siniestro o necesitas apoyo con tu banco?
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                A diferencia de comprar directo con una entidad donde quedas solo haciendo llamadas y trámites, nuestro equipo se encarga de radicar, hacer seguimiento y gestionar tus reclamaciones hasta el desembolso o pago final.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleOpenAppointment(activeTab)}
              className="shrink-0 px-6 py-3 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs sm:text-sm transition-all shadow-md cursor-pointer flex items-center gap-2"
            >
              <span>Hablar con un Asesor Ahora</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
