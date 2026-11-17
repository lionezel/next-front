"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Zap,
  ShieldCheck,
  TrendingUp,
  Clock,
  Percent,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  Sparkles,
  DollarSign,
  Building2,
  Car,
  HeartPulse,
} from "lucide-react";
import { VerticalKey } from "@/src/types/common";
import {
  Finance3DVault,
  Insurance3DShield,
  Investment3DGrowth,
} from "@/src/components/common/Icons3D";

interface ScrollShowcaseSectionProps {
  onSelectVertical: (vertical: VerticalKey | any) => void;
}

export default function ScrollShowcaseSection({
  onSelectVertical,
}: ScrollShowcaseSectionProps) {
  const [activeStep, setActiveStep] = useState<number>(0);
  const stepRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ];

  const stepsData = [
    {
      id: "finanzas",
      vertical: "credito" as VerticalKey,
      badge: "Tasas competitivas del mercado",
      title: "Finanzas & Liquidez Empresarial",
      subtitle:
        "Créditos para personas naturales y jurídicas estructurados a la medida de tu flujo de caja.",
      highlights: [
        "Compra de cartera con mejores tasas para optimizar liquidez",
        "Capital de trabajo, cupos rotativos e hipotecarios comerciales",
        "Factoring & Confirming: convierte facturas por cobrar en efectivo en 24h",
        "Acceso preferencial con más de 35 bancos y cooperativas aliadas",
      ],
      primaryCta: "Explorar Soluciones de Finanzas",
      accentBg: "bg-sky-50 text-sky-700 border-sky-200",
      accentDot: "bg-sky-500",
      glowColor: "from-sky-500/15 via-blue-500/10 to-indigo-500/15",
      stageBorder: "border-sky-200/80 hover:border-sky-300",
      pill1: { text: "Cupos: $20M a $5.000M+", icon: Sparkles, color: "text-amber-500" },
      pill2: { text: "Viabilidad en 24h", icon: Clock, color: "text-sky-500" },
      pill3: { text: "Tasas Preferenciales", icon: Percent, color: "text-emerald-500" },
      renderVisual: () => <Finance3DVault width={200} height={165} className="mx-auto" />,
    },
    {
      id: "seguros",
      vertical: "seguros" as VerticalKey,
      badge: "Ahorro hasta un 50% en pólizas",
      title: "Seguros & Blindaje Patrimonial",
      subtitle:
        "Protección 360° para tu empresa, socios, colaboradores y patrimonio familiar.",
      highlights: [
        "Pólizas colectivas e individuales de salud y medicina prepagada",
        "Protección de socios clave y continuidad de negocio ante imprevistos",
        "Seguros todo riesgo para vehículos, flotas y maquinaria pesada",
        "Pólizas de cumplimiento y garantías para licitaciones y contratos",
      ],
      primaryCta: "Ver Coberturas de Seguros",
      accentBg: "bg-teal-50 text-teal-700 border-teal-200",
      accentDot: "bg-teal-500",
      glowColor: "from-teal-500/15 via-cyan-500/10 to-emerald-500/15",
      stageBorder: "border-teal-200/80 hover:border-teal-300",
      pill1: { text: "Ahorro hasta 50%", icon: Percent, color: "text-teal-500" },
      pill2: { text: "Asistencia VIP 24/7", icon: Zap, color: "text-amber-500" },
      pill3: { text: "Blindaje Patrimonial 360°", icon: ShieldCheck, color: "text-sky-500" },
      renderVisual: () => <Insurance3DShield width={180} height={165} className="mx-auto" />,
    },
    {
      id: "inversiones",
      vertical: "inversiones" as VerticalKey,
      badge: "Rentabilidades anuales según el fondo",
      title: "Inversiones & Crecimiento Seguro",
      subtitle:
        "Pon a rentar tus excedentes de liquidez con respaldo fiduciario vigilado y rendimientos estables.",
      highlights: [
        "Portafolios de alta rentabilidad con rendimientos anuales competitivos",
        "Custodia fiduciaria vigilada y respaldo institucional avalado",
        "Abono periódico de utilidades directo a tu cuenta bancaria",
        "Estrategias personalizadas de diversificación y protección de capital",
      ],
      primaryCta: "Conocer Opciones de Inversión",
      accentBg: "bg-indigo-50 text-indigo-700 border-indigo-200",
      accentDot: "bg-indigo-500",
      glowColor: "from-indigo-500/15 via-purple-500/10 to-sky-500/15",
      stageBorder: "border-indigo-200/80 hover:border-indigo-300",
      pill1: { text: "Hasta 17.8% E.A.", icon: TrendingUp, color: "text-indigo-500" },
      pill2: { text: "Respaldo Fiduciario", icon: ShieldCheck, color: "text-emerald-500" },
      pill3: { text: "Abono Mensual de Rendimientos", icon: DollarSign, color: "text-amber-500" },
      renderVisual: () => <Investment3DGrowth width={180} height={165} className="mx-auto" />,
    },
  ];

  // IntersectionObserver to sync activeStep smoothly with scroll
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-25% 0px -40% 0px",
      threshold: 0.2,
    };

    const observers: IntersectionObserver[] = [];

    stepRefs.forEach((ref, index) => {
      if (!ref.current) return;
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveStep(index);
          }
        });
      }, observerOptions);

      observer.observe(ref.current);
      observers.push(observer);
    });

    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, []);

  const scrollToStep = (index: number) => {
    setActiveStep(index);
    stepRefs[index]?.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  const currentStepData = stepsData[activeStep];

  return (
    <section className="relative my-12 pt-4">
      {/* Dynamic Keyframes for the Sticky 3D Showcase Stage */}
      <style>{`
        @keyframes floatStagePill1 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(-1.5deg); }
        }
        @keyframes floatStagePill2 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(8px) rotate(1.5deg); }
        }
        @keyframes stageVisualBounce {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-10px) scale(1.02); }
        }
        .anim-stage-pill-1 { animation: floatStagePill1 5s ease-in-out infinite; }
        .anim-stage-pill-2 { animation: floatStagePill2 6s ease-in-out infinite; }
        .anim-stage-visual { animation: stageVisualBounce 5.5s ease-in-out infinite; }
      `}</style>

      {/* Header of the Showcase */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-3 py-1 rounded-full border border-sky-100">
            Ecosistema Integrado NEXT
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-2">
            Tres pilares esenciales para tu tranquilidad financiera
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl leading-relaxed">
            Explora cómo NEXT potencia la liquidez de tu empresa, protege a tu equipo y hace crecer tus inversiones con un acompañamiento 100% digital.
          </p>
        </div>

        {/* Quick Clickable Switcher Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl shrink-0 self-start md:self-auto border border-slate-200/80">
          {stepsData.map((step, idx) => (
            <button
              key={step.id}
              onClick={() => scrollToStep(idx)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeStep === idx
                  ? "bg-white text-slate-900 shadow-xs border border-slate-200/90"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {step.id.charAt(0).toUpperCase() + step.id.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* SCROLLYTELLING CONTAINER (Grid with Sticky Visual Stage) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative">
        {/* LEFT COLUMN: Scrollable Narrative Cards */}
        <div className="lg:col-span-7 space-y-6">
          {stepsData.map((step, index) => {
            const isActive = activeStep === index;
            return (
              <div
                key={step.id}
                ref={stepRefs[index]}
                onClick={() => setActiveStep(index)}
                className={`p-6 sm:p-7 rounded-3xl border transition-all duration-300 text-left relative cursor-pointer ${
                  isActive
                    ? "bg-white border-sky-300 shadow-xl shadow-sky-500/5 ring-2 ring-sky-400/20"
                    : "bg-white/80 border-slate-200/70 hover:border-slate-300 opacity-75 hover:opacity-100"
                }`}
              >
                {/* Active Indicator Top Accent */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${step.accentBg}`}
                  >
                    {step.badge}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`w-2 h-2 rounded-full transition-all ${
                        isActive ? `${step.accentDot} scale-125` : "bg-slate-300"
                      }`}
                    />
                    <span className="text-[11px] font-bold text-slate-400">
                      0{index + 1} / 03
                    </span>
                  </div>
                </div>

                <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1 leading-relaxed">
                  {step.subtitle}
                </p>

                {/* Bullet Points */}
                <div className="space-y-2 mt-4 pt-3 border-t border-slate-100">
                  {step.highlights.map((item, hIdx) => (
                    <div
                      key={hIdx}
                      className="flex items-start gap-2 text-xs text-slate-600 font-medium"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-sky-500 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                {/* Action CTA */}
                <div className="mt-5 pt-2 flex items-center justify-between">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectVertical(step.vertical);
                    }}
                    className={`h-9 px-4 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      isActive
                        ? "bg-sky-500 hover:bg-sky-600 text-white shadow-md shadow-sky-500/20 active:scale-95"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                    }`}
                  >
                    <span>{step.primaryCta}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
                    Clic para ver detalles
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* RIGHT COLUMN: STICKY 3D VISUAL STAGE (Pins in viewport while user scrolls) */}
        <div className="lg:col-span-5 lg:sticky lg:top-24">
          <div
            className={`rounded-3xl bg-white border p-6 sm:p-7 shadow-xl shadow-slate-200/50 relative overflow-hidden transition-all duration-500 min-h-[380px] sm:min-h-[440px] flex flex-col justify-between ${currentStepData.stageBorder}`}
          >
            {/* Dynamic Ambient Background Glow that morphs with the active vertical */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${currentStepData.glowColor} blur-2xl pointer-events-none transition-all duration-700`}
            />

            {/* Top Interactive Glass Pill 1 */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="anim-stage-pill-1 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/85 backdrop-blur-md border border-slate-200/90 shadow-sm text-xs font-bold text-slate-800 transition-all duration-500">
                <currentStepData.pill1.icon
                  className={`w-3.5 h-3.5 ${currentStepData.pill1.color}`}
                />
                <span>{currentStepData.pill1.text}</span>
              </div>

              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-white/70 px-2 py-0.5 rounded-full border border-slate-200/60">
                NEXT 360°
              </span>
            </div>

            {/* Center Animated 3D Graphic with Persisting Motion */}
            <div className="relative z-10 my-auto py-6 flex items-center justify-center">
              <div className="anim-stage-visual transition-all duration-500 transform hover:scale-105">
                {currentStepData.renderVisual()}
              </div>
            </div>

            {/* Bottom Floating Glass Pills 2 & 3 */}
            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 border-t border-slate-100/80">
              <div className="anim-stage-pill-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-2xs text-[11px] font-bold text-slate-700">
                <currentStepData.pill2.icon
                  className={`w-3 h-3 ${currentStepData.pill2.color}`}
                />
                <span>{currentStepData.pill2.text}</span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 text-white shadow-xs text-[11px] font-bold">
                <currentStepData.pill3.icon
                  className={`w-3 h-3 ${currentStepData.pill3.color}`}
                />
                <span>{currentStepData.pill3.text}</span>
              </div>
            </div>
          </div>

          {/* Quick Indicator Below Stage */}
          <div className="mt-3 flex items-center justify-between px-2 text-[11px] text-slate-400 font-medium">
            <span>Desplázate con el scroll para interactuar</span>
            <span className="text-sky-600 font-bold">NEXT Connection Group</span>
          </div>
        </div>
      </div>
    </section>
  );
}
