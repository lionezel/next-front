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
  Lock,
  ArrowUpRight,
  Check,
  Layers,
  Smartphone,
  CreditCard,
  SlidersHorizontal,
  ChevronDown,
} from "lucide-react";
import { VerticalKey } from "@/src/types/common";

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
      category: "Finanzas & Liquidez",
      badge: "Tasas competitivas del mercado",
      title: "Crédito y Liquidez para Empresas y Personas",
      subtitle:
        "Estructuramos tu financiación con más de 35 bancos y cooperativas para obtener las condiciones más favorables del mercado.",
      metrics: [
        { label: "Cupos desde", value: "$20M a $5.000M" },
        { label: "Tiempo de estudio", value: "24 Horas" },
        { label: "Garantías", value: "Aval FNG disponible" },
      ],
      highlights: [
        "Compra de cartera empresarial y personal para liberar flujo de caja inmediato",
        "Líneas de capital de trabajo y cupos rotativos con desembolsos ágiles",
        "Factoring & Confirming digital: anticipa tus facturas por cobrar en menos de 24h",
        "Crédito para vehículos comerciales y leasing / hipotecario sin sobrecostos",
      ],
      primaryCta: "Solicitar Estudio de Crédito",
      accentColor: "sky",
    },
    {
      id: "seguros",
      vertical: "seguros" as VerticalKey,
      category: "Seguros & Blindaje",
      badge: "Ahorro hasta un 50% en pólizas actuales",
      title: "Protección Integral y Blindaje Patrimonial",
      subtitle:
        "Auditoría técnica de tus pólizas actuales para reducir costos hasta un 50% aumentando la cobertura para tu empresa y familia.",
      metrics: [
        { label: "Ahorro promedio", value: "Hasta 50%" },
        { label: "Aseguradoras", value: "+35 Aliadas" },
        { label: "Asistencia", value: "24/7 VIP" },
      ],
      highlights: [
        "Pólizas de salud colectiva y medicina prepagada con atención prioritaria",
        "Seguro de socios clave para garantizar la continuidad financiera del negocio",
        "Pólizas todo riesgo para flotas vehiculares, maquinaria y transporte",
        "Pólizas de cumplimiento y garantías contractuales avaladas por SECOP",
      ],
      primaryCta: "Cotizar Blindaje y Seguros",
      accentColor: "teal",
    },
    {
      id: "inversiones",
      vertical: "inversiones" as VerticalKey,
      category: "Inversiones & Rentabilidad",
      badge: "Rentabilidades anuales según el fondo",
      title: "Portafolios Fiduciarios de Alto Rendimiento",
      subtitle:
        "Pon a rentar los excedentes de tesorería y patrimonio privado en fondos respaldados institucionalmente y vigilados por la Superfinanciera.",
      metrics: [
        { label: "Rentabilidad objetivo", value: "Hasta 17.8% E.A." },
        { label: "Custodia", value: "Fiduciaria Vigilada" },
        { label: "Abono utilidades", value: "Mensual / Trimestral" },
      ],
      highlights: [
        "Estrategias fiduciarias de renta fija y fondos de inversión colectiva",
        "Diversificación inteligente para blindar el capital contra la inflación",
        "Retiro flexible y abono periódico de intereses directamente a tu cuenta",
        "Asesoría patrimonial privada y confidencial con expertos senior",
      ],
      primaryCta: "Simular Plan de Inversión",
      accentColor: "indigo",
    },
  ];

  // Sync active step with scroll position
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -40% 0px",
      threshold: 0.25,
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

  const currentStep = stepsData[activeStep];

  return (
    <section className="relative my-14">
      {/* Dynamic Keyframes for floating UI chips */}
      <style>{`
        @keyframes floatCard1 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-6px) rotate(-1deg); }
        }
        @keyframes floatCard2 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(7px) rotate(1.2deg); }
        }
        .anim-chip-1 { animation: floatCard1 4.5s ease-in-out infinite; }
        .anim-chip-2 { animation: floatCard2 5s ease-in-out infinite; }
      `}</style>

      {/* Top Section Header */}
      <div className="max-w-2xl mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 border border-sky-100 text-[11px] font-bold text-sky-700 tracking-wider uppercase mb-2">
          <Sparkles className="w-3.5 h-3.5 text-sky-500" />
          <span>Ecosistema Financiero 360°</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
          Tres soluciones estratégicas para potenciar y proteger tu empresa
        </h2>
        <p className="text-sm text-slate-500 mt-2 leading-relaxed">
          Diseñado con estándares de banca corporativa privada: procesos ágiles, sin costos ocultos y con el respaldo de las principales entidades de Colombia.
        </p>

        {/* Top Interactive Switcher Pill Tabs */}
        <div className="inline-flex items-center gap-1 p-1 bg-slate-100/90 rounded-2xl border border-slate-200 mt-5">
          {stepsData.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => scrollToStep(idx)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeStep === idx
                  ? "bg-white text-slate-900 shadow-xs border border-slate-200/90"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <span className="opacity-50 mr-1.5">0{idx + 1}.</span>
              <span>{s.category.split("&")[0].trim()}</span>
            </button>
          ))}
        </div>
      </div>

      {/* SCROLLYTELLING TWO-COLUMN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start relative">
        {/* LEFT COLUMN: Narrative Step Cards with Vertical Connecting Guide */}
        <div className="lg:col-span-7 relative space-y-8">
          {/* Subtle Vertical Timeline Guide Line */}
          <div className="absolute left-4 top-8 bottom-8 w-0.5 bg-gradient-to-b from-sky-400 via-teal-400 to-indigo-400 hidden sm:block opacity-30 pointer-events-none" />

          {stepsData.map((step, idx) => {
            const isActive = activeStep === idx;
            return (
              <div
                key={step.id}
                ref={stepRefs[idx]}
                onClick={() => setActiveStep(idx)}
                className={`sm:pl-10 relative transition-all duration-300 cursor-pointer ${
                  isActive ? "opacity-100" : "opacity-70 hover:opacity-95"
                }`}
              >
                {/* Timeline Bullet Node */}
                <div
                  className={`absolute left-1.5 top-8 w-5 h-5 rounded-full border-2 bg-white hidden sm:flex items-center justify-center transition-all duration-300 z-10 ${
                    isActive
                      ? "border-sky-500 ring-4 ring-sky-100 scale-110"
                      : "border-slate-300"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full transition-colors ${
                      isActive ? "bg-sky-500" : "bg-transparent"
                    }`}
                  />
                </div>

                {/* Main Card */}
                <div
                  className={`rounded-3xl p-6 sm:p-7 border transition-all duration-300 ${
                    isActive
                      ? "bg-white border-slate-300 shadow-xl shadow-slate-200/50 ring-1 ring-slate-900/5"
                      : "bg-white/80 border-slate-200/80 hover:border-slate-300 shadow-xs"
                  }`}
                >
                  {/* Category & Badge Row */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      0{idx + 1} • {step.category}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 bg-sky-50 border border-sky-100 px-2.5 py-0.5 rounded-full">
                      {step.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-slate-900 tracking-tight leading-snug">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1.5 leading-relaxed">
                    {step.subtitle}
                  </p>

                  {/* 3 Key Metrics Strip (Executive Style) */}
                  <div className="grid grid-cols-3 gap-2 my-5 p-3 rounded-2xl bg-slate-50/90 border border-slate-100 text-center">
                    {step.metrics.map((m, mIdx) => (
                      <div key={mIdx} className="space-y-0.5">
                        <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider truncate">
                          {m.label}
                        </div>
                        <div className="text-xs sm:text-sm font-black text-slate-900 tracking-tight truncate">
                          {m.value}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Highlights Bullet List */}
                  <div className="space-y-2 pt-1 border-t border-slate-100">
                    {step.highlights.map((h, hIdx) => (
                      <div
                        key={hIdx}
                        className="flex items-start gap-2 text-xs text-slate-600 font-medium"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Action */}
                  <div className="mt-6 pt-2 flex items-center justify-between">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectVertical(step.vertical);
                      }}
                      className="h-10 px-5 rounded-full bg-slate-900 hover:bg-sky-600 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-sm hover:shadow-md cursor-pointer active:scale-95"
                    >
                      <span>{step.primaryCta}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <span className="text-[11px] font-semibold text-slate-400 hidden sm:inline">
                      Estudio 100% digital
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* RIGHT COLUMN: STICKY TOP-TIER FINTECH DEVICE MOCKUP (Pins in viewport) */}
        <div className="lg:col-span-5 lg:sticky lg:top-24">
          <div className="relative mx-auto max-w-[340px] sm:max-w-[360px]">
            {/* Ambient Background Aura */}
            <div
              className={`absolute -inset-4 rounded-[48px] blur-2xl opacity-40 transition-all duration-700 pointer-events-none ${
                activeStep === 0
                  ? "bg-sky-400/30"
                  : activeStep === 1
                  ? "bg-teal-400/30"
                  : "bg-indigo-400/30"
              }`}
            />

            {/* REALISTIC TITANIUM SMARTPHONE CHASSIS */}
            <div className="relative rounded-[44px] bg-slate-900 p-3.5 shadow-2xl shadow-slate-900/40 ring-1 ring-white/20 border-4 border-slate-800 overflow-hidden select-none">
              {/* Dynamic Island / Speaker Notch */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-5 rounded-full bg-black z-30 flex items-center justify-between px-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-900" />
                <span className="w-2 h-2 rounded-full bg-sky-500/80 animate-pulse" />
              </div>

              {/* Status Bar */}
              <div className="pt-2 px-4 pb-2 flex items-center justify-between text-[10px] font-bold text-slate-400 relative z-20">
                <span>9:41</span>
                <span className="text-[9px] uppercase tracking-wider text-slate-400">
                  NEXT 360°
                </span>
                <div className="flex items-center gap-1">
                  <span className="text-[9px]">5G</span>
                  <div className="w-4 h-2 rounded-xs border border-slate-400 flex items-center p-0.5">
                    <div className="w-full h-full bg-emerald-400 rounded-xs" />
                  </div>
                </div>
              </div>

              {/* SCREEN VIEWPORT CONTAINER (With smooth transition between 3 screens) */}
              <div className="rounded-[32px] bg-slate-950 text-white min-h-[460px] p-4 flex flex-col justify-between relative overflow-hidden transition-all duration-500">
                {/* Subtle App Header */}
                <div className="flex items-center justify-between pt-1 pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-xl bg-white/10 flex items-center justify-center font-black text-xs text-sky-400 border border-white/10">
                      N
                    </div>
                    <div>
                      <div className="text-[11px] font-bold text-white tracking-tight">
                        NEXT Connection
                      </div>
                      <div className="text-[9px] text-slate-400">
                        {currentStep.category}
                      </div>
                    </div>
                  </div>
                  <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-500/25">
                    Verificado
                  </span>
                </div>

                {/* ================= SCREEN CONTENT 1: FINANZAS ================= */}
                {activeStep === 0 && (
                  <div className="space-y-3.5 my-auto py-2 transition-all duration-500">
                    {/* Quota Card */}
                    <div className="rounded-2xl p-4 bg-gradient-to-br from-sky-900/60 via-slate-900 to-blue-950/80 border border-sky-400/30 shadow-lg relative overflow-hidden">
                      <div className="text-[10px] uppercase font-bold text-sky-300 tracking-wider">
                        Cupo de Crédito Empresarial
                      </div>
                      <div className="text-2xl font-black text-white mt-1 tracking-tight">
                        $250.000.000
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-sky-200 mt-2 font-medium">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Pre-aprobado • Tasa IBR + 3.8%</span>
                      </div>
                    </div>

                    {/* Quick Features Chips */}
                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                      <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                        <div className="text-slate-400">Factoring 24h</div>
                        <div className="font-bold text-white mt-0.5">
                          Anticipo 100%
                        </div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                        <div className="text-slate-400">Capital Trabajo</div>
                        <div className="font-bold text-white mt-0.5">
                          Plazo hasta 60m
                        </div>
                      </div>
                    </div>

                    {/* Simulation Widget */}
                    <div className="p-3 rounded-xl bg-slate-900/90 border border-white/10 space-y-1.5">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-slate-400">Cuota mensual aprox.</span>
                        <span className="font-bold text-emerald-400">
                          $8.420.000 / mes
                        </span>
                      </div>
                      <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-sky-400 h-full w-3/4 rounded-full" />
                      </div>
                      <div className="flex justify-between text-[9px] text-slate-500 pt-0.5">
                        <span>35 Bancos Aliados</span>
                        <span>0% Cobros Ocultos</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* ================= SCREEN CONTENT 2: SEGUROS ================= */}
                {activeStep === 1 && (
                  <div className="space-y-3.5 my-auto py-2 transition-all duration-500">
                    {/* Shield Status Card */}
                    <div className="rounded-2xl p-4 bg-gradient-to-br from-teal-900/60 via-slate-900 to-emerald-950/80 border border-teal-400/30 shadow-lg relative overflow-hidden">
                      <div className="flex items-center justify-between">
                        <div className="text-[10px] uppercase font-bold text-teal-300 tracking-wider">
                          Blindaje Activo 360°
                        </div>
                        <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-md">
                          -48.5% Ahorro
                        </span>
                      </div>
                      <div className="text-xl font-black text-white mt-1.5 tracking-tight">
                        Cobertura Integral
                      </div>
                      <div className="text-[10px] text-teal-200 mt-1 font-medium">
                        Auditoría de pólizas • Ahorro verificado
                      </div>
                    </div>

                    {/* Coverage Categories Checklist */}
                    <div className="space-y-1.5 text-[10px]">
                      <div className="p-2 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-slate-200 font-medium">
                          <Check className="w-3.5 h-3.5 text-teal-400" />
                          Salud & Medicina Prepagada
                        </span>
                        <span className="text-teal-400 font-bold">100% VIP</span>
                      </div>
                      <div className="p-2 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-slate-200 font-medium">
                          <Check className="w-3.5 h-3.5 text-teal-400" />
                          Flotas & Vehículos Comerciales
                        </span>
                        <span className="text-slate-400 font-bold">Todo Riesgo</span>
                      </div>
                      <div className="p-2 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-slate-200 font-medium">
                          <Check className="w-3.5 h-3.5 text-teal-400" />
                          Pólizas de Socios & Cumplimiento
                        </span>
                        <span className="text-emerald-400 font-bold">Activa</span>
                      </div>
                    </div>

                    {/* Assist Banner */}
                    <div className="p-2.5 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-between text-[10px]">
                      <span className="text-slate-300 font-medium">
                        Asistencia Médica y Legal
                      </span>
                      <span className="font-bold text-teal-300">24/7 Disponible</span>
                    </div>
                  </div>
                )}

                {/* ================= SCREEN CONTENT 3: INVERSIONES ================= */}
                {activeStep === 2 && (
                  <div className="space-y-3.5 my-auto py-2 transition-all duration-500">
                    {/* Performance Balance Card */}
                    <div className="rounded-2xl p-4 bg-gradient-to-br from-indigo-900/60 via-slate-900 to-purple-950/80 border border-indigo-400/30 shadow-lg relative overflow-hidden">
                      <div className="flex items-center justify-between">
                        <div className="text-[10px] uppercase font-bold text-indigo-300 tracking-wider">
                          Portafolio Fiduciario
                        </div>
                        <span className="text-[10px] font-black text-indigo-300 bg-indigo-500/25 px-2 py-0.5 rounded-md">
                          +17.8% E.A.
                        </span>
                      </div>
                      <div className="text-2xl font-black text-white mt-1 tracking-tight">
                        $580.450.000
                      </div>
                      <div className="text-[10px] text-emerald-400 mt-1 font-semibold flex items-center gap-1">
                        <ArrowUpRight className="w-3 h-3" />
                        <span>+$4.820.000 utilidades este mes</span>
                      </div>
                    </div>

                    {/* SVG Performance Chart Curve */}
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                      <div className="flex justify-between text-[9px] text-slate-400 mb-1">
                        <span>Rendimiento Acumulado</span>
                        <span className="text-indigo-300 font-bold">
                          Fiduciaria Vigilada
                        </span>
                      </div>
                      <svg
                        viewBox="0 0 200 50"
                        className="w-full h-11 overflow-visible"
                      >
                        <defs>
                          <linearGradient
                            id="invest-grad"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop offset="0%" stopColor="#818CF8" stopOpacity="0.5" />
                            <stop offset="100%" stopColor="#818CF8" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        <path
                          d="M0,45 Q30,40 60,32 T120,20 T170,12 T200,4 L200,50 L0,50 Z"
                          fill="url(#invest-grad)"
                        />
                        <path
                          d="M0,45 Q30,40 60,32 T120,20 T170,12 T200,4"
                          fill="none"
                          stroke="#818CF8"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />
                        <circle cx="200" cy="4" r="3.5" fill="#C084FC" />
                      </svg>
                      <div className="flex justify-between text-[8px] text-slate-500 pt-1 border-t border-white/5">
                        <span>Ene</span>
                        <span>Mar</span>
                        <span>May</span>
                        <span>Jul</span>
                        <span>Sep</span>
                        <span>Nov</span>
                      </div>
                    </div>

                    {/* Trust Footnote */}
                    <div className="flex items-center gap-1.5 text-[9px] text-slate-400 justify-center">
                      <Lock className="w-3 h-3 text-emerald-400" />
                      <span>Custodia y respaldo legal vigilado</span>
                    </div>
                  </div>
                )}

                {/* Bottom App Bar inside phone */}
                <div className="pt-2 border-t border-white/10 flex items-center justify-around text-slate-400 text-[10px]">
                  <button
                    onClick={() => onSelectVertical(currentStep.vertical)}
                    className="w-full py-2 rounded-xl bg-white text-slate-950 font-black text-xs hover:bg-sky-50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <span>{currentStep.primaryCta}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

            {/* FLOATING GLASS CHIP 1 (Top Left) */}
            <div className="anim-chip-1 absolute -top-4 -left-6 z-30 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-xl text-slate-800 text-[11px] font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>{currentStep.metrics[0].value}</span>
            </div>

            {/* FLOATING GLASS CHIP 2 (Bottom Right) */}
            <div className="anim-chip-2 absolute -bottom-4 -right-4 z-30 hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-slate-900/95 backdrop-blur-md border border-white/20 shadow-xl text-white text-[11px] font-bold">
              <ShieldCheck className="w-4 h-4 text-sky-400" />
              <span>Respaldo Multibanca 360°</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
