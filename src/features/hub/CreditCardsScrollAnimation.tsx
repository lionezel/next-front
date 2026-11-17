"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  CreditCard,
  ChevronRight,
  Zap,
} from "lucide-react";
import { VerticalKey } from "@/src/types/common";

interface CreditCardsScrollAnimationProps {
  onSelectVertical: (vertical: VerticalKey | any) => void;
}

export default function CreditCardsScrollAnimation({
  onSelectVertical,
}: CreditCardsScrollAnimationProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  // Measure scroll through the 200vh track to scrub the cards fan-out downward
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (!sectionRef.current) return;
          const rect = sectionRef.current.getBoundingClientRect();
          const windowHeight = window.innerHeight;
          const totalScrollable = sectionRef.current.offsetHeight - windowHeight;

          if (totalScrollable <= 0) return;

          // scrolled distance inside this section
          const scrolled = -rect.top;
          const progress = Math.max(0, Math.min(1, scrolled / totalScrollable));
          setScrollProgress(progress);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const cards = [
    {
      id: "white",
      name: "Majo",
      corporateTitle: "Empresa S.A.S.",
      tag: "NEXT Platinum Corporate",
      bgStyle: "bg-white text-slate-900 border-slate-200/90 shadow-2xl",
      chipStyle: "bg-gradient-to-br from-slate-200 via-slate-300 to-slate-400 border-slate-400/50",
      chipLines: "bg-slate-500/40",
      textColor: "text-slate-900",
      subColor: "text-slate-400",
      logoColor: "text-slate-900",
      networkCircle1: "bg-red-500",
      networkCircle2: "bg-amber-400",
    },
    {
      id: "navy",
      name: "Caro",
      corporateTitle: "Gerencia General",
      tag: "NEXT Business Capital",
      bgStyle: "bg-[#1e2538] text-white border-slate-700/80 shadow-2xl",
      chipStyle: "bg-gradient-to-br from-amber-100 via-amber-300 to-amber-500 border-amber-400/60",
      chipLines: "bg-amber-800/40",
      textColor: "text-white",
      subColor: "text-slate-400",
      logoColor: "text-white",
      networkCircle1: "bg-red-500",
      networkCircle2: "bg-amber-400",
    },
    {
      id: "lime",
      name: "Sebas",
      corporateTitle: "Dirección Financiera",
      tag: "NEXT Factoring 24h",
      bgStyle: "bg-[#e2ff00] text-slate-950 border-lime-300 shadow-2xl",
      chipStyle: "bg-gradient-to-br from-slate-700 via-slate-800 to-slate-950 border-slate-900",
      chipLines: "bg-slate-400/40",
      textColor: "text-slate-950",
      subColor: "text-slate-700",
      logoColor: "text-slate-950",
      networkCircle1: "bg-red-500",
      networkCircle2: "bg-amber-500",
    },
    {
      id: "black",
      name: "VIP",
      corporateTitle: "Patrimonio & Wealth",
      tag: "NEXT Black Executive",
      bgStyle: "bg-[#111622] text-white border-slate-800 shadow-2xl",
      chipStyle: "bg-gradient-to-br from-yellow-200 via-amber-400 to-amber-600 border-amber-500/80",
      chipLines: "bg-amber-900/40",
      textColor: "text-white",
      subColor: "text-slate-500",
      logoColor: "text-white",
      networkCircle1: "bg-red-500",
      networkCircle2: "bg-amber-400",
    },
  ];

  return (
    <div
      ref={sectionRef}
      className="relative my-8 -mx-4 sm:-mx-6"
      style={{ height: "220vh" }}
    >
      {/* STICKY FULL-VIEWPORT WRAPPER (Pins on screen while user scrolls through 220vh) */}
      <div className="sticky top-0 h-screen w-full bg-[#e6e9ee] flex items-center justify-center overflow-hidden py-8 px-6 sm:px-12">
        <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* ================= LEFT COLUMN: Text & Bullets (Matching Lulo Bank exact layout) ================= */}
          <div className="lg:col-span-6 space-y-6 text-left max-w-xl">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.12]">
              Líneas de crédito y tarjetas que potencian tu negocio
            </h2>

            {/* Bullets identical to Lulo Bank style */}
            <ul className="space-y-3.5 text-xs sm:text-sm text-slate-700 font-medium leading-relaxed pt-2">
              <li className="flex items-start gap-2.5">
                <span className="text-slate-900 font-black text-base leading-none mt-0.5">•</span>
                <span>
                  <strong className="text-slate-900 font-bold">Cupos desde $20M hasta $5.000M:</strong> Aprobación ágil en 24h para personas naturales y empresas.
                </span>
              </li>

              <li className="flex items-start gap-2.5">
                <span className="text-slate-900 font-black text-base leading-none mt-0.5">•</span>
                <span>
                  <strong className="text-slate-900 font-bold">Compra de cartera:</strong> Baja tus tasas y unifica todas tus deudas bancarias en una sola cuota mensual más baja.
                </span>
              </li>

              <li className="flex items-start gap-2.5">
                <span className="text-slate-900 font-black text-base leading-none mt-0.5">•</span>
                <span>
                  <strong className="text-slate-900 font-bold">Factoring & Confirming 24h:</strong> Convierte tus facturas comerciales por cobrar en efectivo de inmediato sin endeudarte.
                </span>
              </li>

              <li className="flex items-start gap-2.5">
                <span className="text-slate-900 font-black text-base leading-none mt-0.5">•</span>
                <span>
                  <strong className="text-slate-900 font-bold">0% Cobros ocultos:</strong> Convenios preferenciales con +35 bancos sin costos ni pagos de estudio por adelantado.
                </span>
              </li>

              <li className="flex items-start gap-2.5">
                <span className="text-slate-900 font-black text-base leading-none mt-0.5">•</span>
                <span>
                  <strong className="text-slate-900 font-bold">Personalización & Control:</strong> Emisión con el nombre de tu empresa, control de gastos y pagos seguros por PSE.
                </span>
              </li>
            </ul>

            {/* CTAs matching Lulo button layout */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                onClick={() => onSelectVertical("credito")}
                className="h-12 px-7 rounded-full bg-[#e2ff00] hover:bg-[#d4f000] text-slate-950 font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-md shadow-slate-900/10 transition-transform active:scale-95 cursor-pointer"
              >
                <span>Solicitar Estudio</span>
                <ChevronRight className="w-4 h-4 stroke-[3]" />
              </button>

              <button
                onClick={() => {
                  const el = document.getElementById("agenda-section");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="text-xs sm:text-sm font-bold text-slate-900 hover:text-sky-600 transition-colors cursor-pointer underline underline-offset-4"
              >
                Hablar con un asesor
              </button>
            </div>
          </div>

          {/* ================= RIGHT COLUMN: 3D Isometric Cards Fanning Downward on Scroll ================= */}
          <div className="lg:col-span-6 flex items-center justify-center relative min-h-[360px] sm:min-h-[440px]">
            {/* 3D Isometric Viewport */}
            <div
              className="relative w-[300px] sm:w-[380px] h-[190px] sm:h-[240px]"
              style={{
                perspective: "1200px",
                perspectiveOrigin: "50% 50%",
              }}
            >
              {cards.map((card, idx) => {
                // Exact downward fan-out math from the video:
                // When scrollProgress is 0: Cards are stacked tightly behind the top white card.
                // As scrollProgress increases to 1: Each subsequent card glides DOWNWARDS and rightwards.
                const fanAmount = scrollProgress; // 0 (closed) to 1 (fully fanned down)

                // Downward spread displacement (X right, Y down, Z depth)
                const translateX = idx * (34 * fanAmount);
                const translateY = idx * (75 * fanAmount); // Progressive downward glide!
                const translateZ = -idx * (28 * fanAmount);

                return (
                  <div
                    key={card.id}
                    className={`absolute inset-0 rounded-[22px] sm:rounded-[28px] p-6 sm:p-7 border flex flex-col justify-between select-none cursor-pointer will-change-transform ${card.bgStyle}`}
                    style={{
                      transform: `
                        rotateX(36deg) 
                        rotateZ(-28deg) 
                        rotateY(16deg) 
                        translate3d(${translateX}px, ${translateY}px, ${translateZ}px)
                      `,
                      transformStyle: "preserve-3d",
                      zIndex: 20 - idx,
                      filter: `drop-shadow(0 ${14 + idx * 6}px ${20 + idx * 8}px rgba(15, 23, 42, ${
                        0.25 + idx * 0.05
                      }))`,
                      transition: "transform 0.15s cubic-bezier(0.2, 0.8, 0.2, 1)",
                    }}
                  >
                    {/* Top Row: EMV Chip + Logo */}
                    <div className="flex items-center justify-between">
                      {/* Metallic Gold EMV Chip */}
                      <div
                        className={`w-11 h-8 rounded-md border shadow-xs relative flex items-center justify-center overflow-hidden ${card.chipStyle}`}
                      >
                        <div className={`w-full h-[1px] absolute top-2.5 ${card.chipLines}`} />
                        <div className={`w-full h-[1px] absolute bottom-2.5 ${card.chipLines}`} />
                        <div className={`h-full w-[1px] absolute left-3.5 ${card.chipLines}`} />
                        <div className={`h-full w-[1px] absolute right-3.5 ${card.chipLines}`} />
                      </div>

                      {/* Brand Logo & Debit Indicator */}
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[11px] font-black tracking-widest uppercase ${card.logoColor}`}>
                          NEXT
                        </span>
                        <span className={`text-[10px] font-semibold opacity-70 ${card.subColor}`}>
                          credit ))
                        </span>
                      </div>
                    </div>

                    {/* Middle: Holder Name (like Majo, Caro, Sebas in video) */}
                    <div className="my-auto pt-2">
                      <div className={`text-base sm:text-lg font-black tracking-tight ${card.textColor}`}>
                        {card.name}
                      </div>
                      <div className={`text-[10px] font-bold uppercase tracking-wider opacity-60 ${card.subColor}`}>
                        {card.corporateTitle}
                      </div>
                    </div>

                    {/* Bottom: Overlapping Mastercard Network Circles */}
                    <div className="flex items-end justify-between pt-1">
                      <span className={`text-[9px] font-bold uppercase tracking-wider opacity-50 ${card.subColor}`}>
                        {card.tag}
                      </span>

                      {/* Dual Overlapping Payment Circles (Identical to Lulo video) */}
                      <div className="flex -space-x-2 shrink-0">
                        <div className={`w-6 h-6 rounded-full ${card.networkCircle1} shadow-xs opacity-95`} />
                        <div className={`w-6 h-6 rounded-full ${card.networkCircle2} shadow-xs opacity-95`} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
