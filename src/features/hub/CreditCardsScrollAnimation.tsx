"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Zap,
  Lock,
  Layers,
  Percent,
  Clock,
  Compass,
} from "lucide-react";
import { VerticalKey } from "@/src/types/common";

interface CreditCardsScrollAnimationProps {
  onSelectVertical: (vertical: VerticalKey | any) => void;
}

export default function CreditCardsScrollAnimation({
  onSelectVertical,
}: CreditCardsScrollAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState<number>(0.7); // default expanded
  const [activeCardIndex, setActiveCardIndex] = useState<number>(0);

  // Track scroll position of the section to drive the fan-out animation smoothly
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Start animation when section enters viewport, finish when centered
      const startOffset = windowHeight * 0.85;
      const endOffset = windowHeight * 0.15;
      const totalRange = startOffset - endOffset;

      const currentProgress = (startOffset - rect.top) / totalRange;
      const clamped = Math.max(0, Math.min(1, currentProgress));
      setScrollProgress(clamped);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const cardsData = [
    {
      id: "platinum",
      name: "NEXT Platinum Corporate",
      holder: "Empresa S.A.S.",
      tag: "Línea de Crédito & Tesorería",
      bgClass: "bg-gradient-to-br from-white via-slate-100 to-slate-200 text-slate-900 border-white/80 shadow-2xl",
      chipClass: "bg-gradient-to-br from-amber-200 via-amber-300 to-amber-500 border-amber-400/60",
      textColor: "text-slate-900",
      subtextColor: "text-slate-500",
      accentGlow: "rgba(2, 132, 199, 0.3)",
      badge: "Pre-aprobado $250M",
      benefits: "Tasa preferencial IBR + 3.8% • Sin cuota de manejo el 1er año",
    },
    {
      id: "cyan",
      name: "NEXT Business Capital",
      holder: "Gerencia General",
      tag: "Factoring & Capital de Trabajo",
      bgClass: "bg-gradient-to-br from-sky-500 via-sky-600 to-blue-700 text-white border-sky-300/60 shadow-2xl",
      chipClass: "bg-gradient-to-br from-amber-100 via-amber-300 to-amber-500 border-amber-300/80",
      textColor: "text-white",
      subtextColor: "text-sky-100",
      accentGlow: "rgba(56, 189, 248, 0.4)",
      badge: "Anticipo 100% Factoring",
      benefits: "Desembolso en 24h • Liquidez inmediata sobre facturas",
    },
    {
      id: "black",
      name: "NEXT Black Executive",
      holder: "Dirección Financiera",
      tag: "Cupo Rotativo Multibanca",
      bgClass: "bg-gradient-to-br from-slate-900 via-slate-950 to-black text-white border-slate-700/60 shadow-2xl",
      chipClass: "bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-600 border-yellow-300/80",
      textColor: "text-white",
      subtextColor: "text-slate-400",
      accentGlow: "rgba(15, 23, 42, 0.5)",
      badge: "Cupos hasta $5.000M",
      benefits: "Convenios con 35 bancos • Asesor VIP patrimonial asignado",
    },
    {
      id: "emerald",
      name: "NEXT Private Wealth",
      holder: "Patrimonio Familiar",
      tag: "Blindaje & Protección de Activos",
      bgClass: "bg-gradient-to-br from-teal-900 via-slate-950 to-emerald-950 text-white border-teal-500/40 shadow-2xl",
      chipClass: "bg-gradient-to-br from-amber-200 via-amber-300 to-amber-500 border-amber-400/80",
      textColor: "text-white",
      subtextColor: "text-teal-200",
      accentGlow: "rgba(20, 184, 166, 0.35)",
      badge: "Blindaje 360°",
      benefits: "Pólizas integrales • Auditoría con ahorro de hasta 50%",
    },
  ];

  return (
    <section
      ref={containerRef}
      className="relative my-16 py-12 px-6 sm:px-10 rounded-3xl bg-slate-100/70 border border-slate-200/90 overflow-hidden"
    >
      {/* Background Soft Glows */}
      <div className="absolute top-10 right-10 w-96 h-96 rounded-full bg-sky-200/35 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 rounded-full bg-blue-200/25 blur-3xl pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
        {/* LEFT COLUMN: Narrative Copy (Inspired by Lulo Bank's Card Section) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 text-[11px] font-bold text-slate-900 tracking-wider uppercase shadow-2xs">
            <CreditCard className="w-3.5 h-3.5 text-sky-600" />
            <span>Tarjetas & Financiación Empresarial</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
            Tarjetas de crédito y cupos con las mejores tasas del mercado
          </h2>

          <p className="text-sm text-slate-600 leading-relaxed font-medium">
            Accede a cupos rotativos, compras de cartera y factoring con tasas preferenciales negociadas con más de 35 bancos y cooperativas de Colombia.
          </p>

          {/* Bullet Benefits List */}
          <div className="space-y-3 pt-2">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-sky-500/15 text-sky-600 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <p className="text-xs sm:text-sm text-slate-700">
                <strong className="font-bold text-slate-900">Cupos de $20M hasta $5.000M:</strong> Aprobación en 24 horas y avales del Fondo Nacional de Garantías (FNG).
              </p>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-sky-500/15 text-sky-600 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <p className="text-xs sm:text-sm text-slate-700">
                <strong className="font-bold text-slate-900">0% Cobros ocultos:</strong> Sin pagos ni costos de estudio por adelantado, con convenios preferenciales.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-sky-500/15 text-sky-600 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <p className="text-xs sm:text-sm text-slate-700">
                <strong className="font-bold text-slate-900">Personalización institucional:</strong> Emisión con el nombre de tu empresa, control de gastos y pagos por PSE.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-sky-500/15 text-sky-600 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <p className="text-xs sm:text-sm text-slate-700">
                <strong className="font-bold text-slate-900">Factoring & Confirming:</strong> Convierte facturas por cobrar en efectivo en menos de un día hábil.
              </p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-3">
            <button
              onClick={() => onSelectVertical("credito")}
              className="h-11 px-6 rounded-full bg-slate-900 hover:bg-sky-600 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md shadow-slate-900/15 transition-transform active:scale-95 cursor-pointer"
            >
              <Zap className="w-4 h-4 text-sky-400 fill-sky-400" />
              <span>Solicitar Estudio de Crédito</span>
            </button>

            <button
              onClick={() => {
                const el = document.getElementById("agenda-section");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="h-11 px-5 rounded-full bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 text-xs sm:text-sm font-bold transition-colors cursor-pointer shadow-2xs"
            >
              <span>Hablar con un Asesor</span>
            </button>
          </div>

          {/* Micro Card Details Interactive Pill */}
          <div className="p-3 rounded-2xl bg-white/80 border border-slate-200/80 shadow-2xs flex items-center justify-between text-xs font-semibold text-slate-700">
            <span className="flex items-center gap-1.5 text-slate-500">
              <Compass className="w-3.5 h-3.5 text-sky-600" />
              <span>Tarjeta seleccionada:</span>
            </span>
            <span className="font-bold text-slate-900 truncate max-w-[200px]">
              {cardsData[activeCardIndex].name}
            </span>
          </div>
        </div>

        {/* RIGHT COLUMN: 3D ISOMETRIC CARDS FAN-OUT (Lulo Bank Style) */}
        <div className="lg:col-span-6 flex items-center justify-center min-h-[460px] sm:min-h-[520px] relative py-8">
          {/* 3D Perspective Stage Container */}
          <div
            className="relative w-[280px] sm:w-[340px] h-[200px] sm:h-[225px] transition-transform duration-700 ease-out"
            style={{
              perspective: "1200px",
              perspectiveOrigin: "50% 50%",
            }}
          >
            {cardsData.map((card, idx) => {
              // Interpolate translation based on scrollProgress (0 = tight stack, 1 = fully fanned out)
              // Each card slides diagonally down and right in 3D isometric space
              const spread = scrollProgress;
              const xOffset = idx * (30 * spread);
              const yOffset = idx * (65 * spread);
              const zOffset = -idx * (35 * spread);
              const isHovered = activeCardIndex === idx;

              return (
                <div
                  key={card.id}
                  onClick={() => setActiveCardIndex(idx)}
                  onMouseEnter={() => setActiveCardIndex(idx)}
                  className={`absolute inset-0 rounded-[22px] sm:rounded-[26px] p-5 sm:p-6 border flex flex-col justify-between cursor-pointer select-none transition-all duration-500 ${card.bgClass}`}
                  style={{
                    transform: `
                      rotateX(36deg) 
                      rotateZ(-28deg) 
                      rotateY(16deg) 
                      translate3d(${xOffset}px, ${yOffset}px, ${zOffset}px)
                      ${isHovered ? "translateY(-16px) scale(1.04)" : ""}
                    `,
                    transformStyle: "preserve-3d",
                    zIndex: 20 - idx,
                    filter: `drop-shadow(0 ${14 + idx * 4}px ${20 + idx * 6}px rgba(15, 23, 42, ${0.28 + idx * 0.04}))`,
                  }}
                >
                  {/* Card Top: Chip + Contactless + Brand */}
                  <div className="flex items-center justify-between">
                    {/* Metallic EMV Gold Chip */}
                    <div
                      className={`w-10 h-7 rounded-md border shadow-inner relative flex items-center justify-center overflow-hidden ${card.chipClass}`}
                    >
                      <div className="w-full h-[1px] bg-amber-700/40 absolute top-2" />
                      <div className="w-full h-[1px] bg-amber-700/40 absolute bottom-2" />
                      <div className="h-full w-[1px] bg-amber-700/40 absolute left-3" />
                      <div className="h-full w-[1px] bg-amber-700/40 absolute right-3" />
                    </div>

                    {/* Contactless Waves */}
                    <svg
                      viewBox="0 0 24 24"
                      className={`w-5 h-5 opacity-60 ${card.textColor}`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M8.5 16.5a5 5 0 0 1 0-7" strokeLinecap="round" />
                      <path d="M12 19a8.5 8.5 0 0 0 0-14" strokeLinecap="round" />
                      <path d="M15.5 21.5a12 12 0 0 0 0-19" strokeLinecap="round" />
                    </svg>

                    {/* Brand Identifier */}
                    <span
                      className={`text-[10px] font-black tracking-widest uppercase opacity-85 ${card.textColor}`}
                    >
                      NEXT
                    </span>
                  </div>

                  {/* Card Middle: Tier & Highlight Badge */}
                  <div className="my-auto py-1">
                    <div
                      className={`text-xs sm:text-sm font-black tracking-tight ${card.textColor}`}
                    >
                      {card.name}
                    </div>
                    <div
                      className={`text-[10px] font-semibold mt-0.5 ${card.subtextColor}`}
                    >
                      {card.tag}
                    </div>
                  </div>

                  {/* Card Bottom: Holder Name + Dual Mastercard/Visa Circles */}
                  <div className="flex items-end justify-between pt-1">
                    <div>
                      <div
                        className={`text-[9px] font-semibold uppercase tracking-wider opacity-60 ${card.subtextColor}`}
                      >
                        Titular
                      </div>
                      <div
                        className={`text-[11px] sm:text-xs font-bold tracking-wide ${card.textColor}`}
                      >
                        {card.holder}
                      </div>
                    </div>

                    {/* Dual Overlapping Circles (Fintech Payment Network Mark) */}
                    <div className="flex -space-x-2 shrink-0">
                      <div className="w-6 h-6 rounded-full bg-red-500/90 shadow-xs" />
                      <div className="w-6 h-6 rounded-full bg-amber-400/90 shadow-xs" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Floating Live Badge below 3D Cards */}
          <div className="absolute bottom-2 right-4 hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-slate-200 shadow-md text-[11px] font-bold text-slate-800 z-30">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Desplázate con el scroll para desplegar las tarjetas</span>
          </div>
        </div>
      </div>
    </section>
  );
}
