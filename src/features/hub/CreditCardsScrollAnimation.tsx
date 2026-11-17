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
  Percent,
  Clock,
  Compass,
  TrendingDown,
  Building2,
  Coins,
  Receipt,
  Truck,
} from "lucide-react";
import { VerticalKey } from "@/src/types/common";

interface CreditCardsScrollAnimationProps {
  onSelectVertical: (vertical: VerticalKey | any) => void;
}

export default function CreditCardsScrollAnimation({
  onSelectVertical,
}: CreditCardsScrollAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [activePhase, setActivePhase] = useState<number>(0);

  const phases = [
    {
      id: "cartera",
      cardIndex: 0,
      phaseNum: "01",
      badge: "Alivio Inmediato de Flujo de Caja",
      badgeIcon: TrendingDown,
      title: "Compra de Cartera: Baja tus tasas y unifica tus deudas",
      subtitle:
        "Recogemos tus obligaciones financieras en múltiples bancos para consolidarlas bajo una sola deuda con una tasa sustancialmente menor y plazos cómodos.",
      highlights: [
        "Ahorra hasta un 35% en el valor de tus cuotas mensuales actuales",
        "Unifica múltiples cobros en un solo pago mensual organizado",
        "Estudio multientidad con +35 bancos para garantizar la tasa más baja",
        "Liberación inmediata de capacidad de endeudamiento para tu empresa",
      ],
      liveMetric: {
        label: "Tasa desde",
        value: "IBR + 2.5%",
        sub: "Ahorro garantizado",
      },
      cardName: "NEXT Platinum Corporate",
      cardTag: "Compra de Cartera & Optimización",
      cardHolder: "Empresa S.A.S.",
      cardBg: "bg-gradient-to-br from-white via-slate-100 to-slate-200 text-slate-900 border-white/80 shadow-2xl",
      chipBg: "bg-gradient-to-br from-amber-200 via-amber-300 to-amber-500 border-amber-400/60",
      accentGlow: "from-sky-400/30 to-blue-500/20",
    },
    {
      id: "capital",
      cardIndex: 1,
      phaseNum: "02",
      badge: "Inyección de Liquidez Rápida",
      badgeIcon: Coins,
      title: "Capital de Trabajo & Cupos Rotativos de Tesorería",
      subtitle:
        "Financiación ágil para compra de inventarios, nóminas, materia prima o expansión operativa sin descapitalizar la caja de tu empresa.",
      highlights: [
        "Cupos rotativos y préstamos de liquidez de $20M hasta $5.000M+",
        "Desembolso express en 24 a 48 horas tras aprobación",
        "Plazos flexibles desde 6 hasta 60 meses adaptados a tu flujo de ingresos",
        "Acceso a garantías institucionales con respaldo del FNG",
      ],
      liveMetric: {
        label: "Desembolso en",
        value: "24 Horas",
        sub: "Cupos hasta $5.000M",
      },
      cardName: "NEXT Business Capital",
      cardTag: "Capital de Trabajo & Liquidez",
      cardHolder: "Gerencia General",
      cardBg: "bg-gradient-to-br from-sky-500 via-sky-600 to-blue-700 text-white border-sky-300/60 shadow-2xl",
      chipBg: "bg-gradient-to-br from-amber-100 via-amber-300 to-amber-500 border-amber-300/80",
      accentGlow: "from-sky-400/40 to-cyan-500/30",
    },
    {
      id: "factoring",
      cardIndex: 2,
      phaseNum: "03",
      badge: "Anticipo de Facturas sin Endeudarte",
      badgeIcon: Receipt,
      title: "Factoring & Confirming: Anticipa tus facturas hoy",
      subtitle:
        "No esperes 30, 60 o 90 días a que tus clientes te paguen. Convierte tus facturas comerciales en dinero líquido inmediato en menos de un día hábil.",
      highlights: [
        "Anticipo de hasta el 100% del valor de tu factura en menos de 24 horas",
        "No genera pasivo financiero en tu balance ni ocupa tus cupos bancarios",
        "Confirming para pagar a proveedores con descuentos por pronto pago",
        "Operación 100% digital a través de la plataforma Radian de la DIAN",
      ],
      liveMetric: {
        label: "Anticipo",
        value: "Hasta 100%",
        sub: "Sin pasivo bancario",
      },
      cardName: "NEXT Black Executive",
      cardTag: "Factoring & Confirming 24h",
      cardHolder: "Dirección Financiera",
      cardBg: "bg-gradient-to-br from-slate-900 via-slate-950 to-black text-white border-slate-700/60 shadow-2xl",
      chipBg: "bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-600 border-yellow-300/80",
      accentGlow: "from-slate-700/40 to-slate-900/40",
    },
    {
      id: "leasing",
      cardIndex: 3,
      phaseNum: "04",
      badge: "Financiación de Activos Productivos",
      badgeIcon: Truck,
      title: "Leasing, Hipotecario & Vehículos Comerciales",
      subtitle:
        "Financiación a largo plazo para bodegas, oficinas, locales comerciales y flotas de transporte con atractivos beneficios tributarios.",
      highlights: [
        "Financiación de hasta el 80% del valor de vehículos o inmuebles comerciales",
        "Importantes deducciones fiscales y ahorro tributario mediante leasing",
        "Plazos extendidos de hasta 15 o 20 años en hipotecario comercial",
        "Tasas preferenciales con los bancos líderes en crédito automotriz y constructor",
      ],
      liveMetric: {
        label: "Plazos hasta",
        value: "20 Años",
        sub: "Beneficio tributario leasing",
      },
      cardName: "NEXT Private Wealth",
      cardTag: "Leasing & Activos Productivos",
      cardHolder: "Patrimonio VIP",
      cardBg: "bg-gradient-to-br from-teal-900 via-slate-950 to-emerald-950 text-white border-teal-500/40 shadow-2xl",
      chipBg: "bg-gradient-to-br from-amber-200 via-amber-300 to-amber-500 border-amber-400/80",
      accentGlow: "from-teal-500/30 to-emerald-600/20",
    },
  ];

  // Continuous Scroll Tracker: Drives the 3D card motions smoothly
  useEffect(() => {
    let animationFrameId: number;

    const onScroll = () => {
      animationFrameId = requestAnimationFrame(() => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const totalHeight = containerRef.current.offsetHeight;
        const windowHeight = window.innerHeight;

        // Progress based on how much of the tall track has scrolled through the viewport
        const scrolled = -rect.top;
        const scrollableDistance = totalHeight - windowHeight;

        if (scrollableDistance <= 0) return;

        const rawProgress = scrolled / scrollableDistance;
        const progress = Math.max(0, Math.min(1, rawProgress));
        setScrollProgress(progress);

        // Determine active phase (4 phases: 0 to 3)
        const phaseIndex = Math.min(
          phases.length - 1,
          Math.floor(progress * phases.length)
        );
        setActivePhase(phaseIndex);
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, [phases.length]);

  const currentPhaseData = phases[activePhase];

  const jumpToPhase = (index: number) => {
    if (!containerRef.current) return;
    const totalHeight = containerRef.current.offsetHeight;
    const windowHeight = window.innerHeight;
    const scrollableDistance = totalHeight - windowHeight;
    const targetScrollY =
      containerRef.current.offsetTop +
      (index / (phases.length - 1)) * scrollableDistance;

    window.scrollTo({
      top: targetScrollY,
      behavior: "smooth",
    });
  };

  return (
    <div
      ref={containerRef}
      className="relative my-8"
      // Height track for natural, comfortable scroll-driven progression
      style={{ minHeight: "260vh" }}
    >
      {/* STICKY VIEWPORT CONTAINER (Pins to screen while user scrolls through the 260vh track) */}
      <div className="sticky top-20 h-[86vh] flex flex-col justify-center py-4">
        <div className="rounded-3xl bg-slate-100/80 backdrop-blur-md border border-slate-200/90 p-6 sm:p-10 shadow-xl shadow-slate-200/40 relative overflow-hidden h-full flex flex-col justify-between">
          {/* Ambient morphing background glow */}
          <div
            className={`absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-gradient-to-br ${currentPhaseData.accentGlow} blur-3xl pointer-events-none transition-all duration-700`}
          />

          {/* TOP BAR: Interactive Phase Switcher Pill */}
          <div className="flex flex-wrap items-center justify-between gap-3 relative z-20 pb-4 border-b border-slate-200/70">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-ping" />
              <span className="text-[11px] font-black uppercase tracking-widest text-slate-900">
                Líneas de Financiación NEXT
              </span>
              <span className="text-[10px] text-slate-400 font-bold hidden sm:inline">
                • Desplázate con el scroll para ver cada solución
              </span>
            </div>

            {/* Step Pills Buttons */}
            <div className="flex items-center gap-1 p-1 bg-white rounded-xl border border-slate-200 shadow-2xs">
              {phases.map((p, idx) => (
                <button
                  key={p.id}
                  onClick={() => jumpToPhase(idx)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activePhase === idx
                      ? "bg-slate-900 text-white shadow-xs"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  <span>{p.phaseNum}</span>
                  <span className="hidden md:inline ml-1">
                    {p.id === "cartera"
                      ? "Cartera"
                      : p.id === "capital"
                      ? "Capital"
                      : p.id === "factoring"
                      ? "Factoring"
                      : "Leasing"}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* MAIN 2-COLUMN STICKY CONTENT */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center my-auto py-2 relative z-10">
            {/* LEFT COLUMN: Dynamic Financial Copy Updating on Scroll */}
            <div className="lg:col-span-6 space-y-4 text-left transition-all duration-500">
              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-2xs text-[11px] font-bold text-sky-700">
                <currentPhaseData.badgeIcon className="w-3.5 h-3.5 text-sky-500" />
                <span>{currentPhaseData.badge}</span>
              </div>

              {/* Title */}
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                {currentPhaseData.title}
              </h2>

              {/* Subtitle */}
              <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                {currentPhaseData.subtitle}
              </p>

              {/* Live Metric Highlight Box */}
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    {currentPhaseData.liveMetric.label}
                  </div>
                  <div className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                    {currentPhaseData.liveMetric.value}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">
                    {currentPhaseData.liveMetric.sub}
                  </span>
                </div>
              </div>

              {/* Highlights List */}
              <div className="space-y-2 pt-1">
                {currentPhaseData.highlights.map((item, hIdx) => (
                  <div
                    key={hIdx}
                    className="flex items-start gap-2 text-xs text-slate-700 font-medium"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              {/* Action Button */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={() => onSelectVertical("credito")}
                  className="h-10 px-5 rounded-full bg-slate-900 hover:bg-sky-600 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-slate-900/15 transition-transform active:scale-95 cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5 text-sky-400 fill-sky-400" />
                  <span>Solicitar Esta Solución</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <span className="text-[11px] font-semibold text-slate-400 hidden sm:inline">
                  Sin pagos anticipados
                </span>
              </div>
            </div>

            {/* RIGHT COLUMN: 3D ISOMETRIC CARDS ACTIVELY MOVING ON SCROLL */}
            <div className="lg:col-span-6 flex items-center justify-center min-h-[340px] sm:min-h-[420px] relative">
              <div
                className="relative w-[270px] sm:w-[330px] h-[190px] sm:h-[220px]"
                style={{
                  perspective: "1200px",
                  perspectiveOrigin: "50% 50%",
                }}
              >
                {phases.map((phase, idx) => {
                  const isActive = activePhase === idx;

                  // Progressive Fan Spread based on continuous scrollProgress
                  // Smoothly interpolates the card fan-out and elevates the active card to the front
                  const baseSpread = 0.5 + scrollProgress * 0.7;
                  const xOffset = idx * (28 * baseSpread);
                  const yOffset = idx * (58 * baseSpread);
                  const zOffset = -idx * (32 * baseSpread);

                  // If active, elevate card forward in Z-space and lift it slightly
                  const activeElevationY = isActive ? -22 : 0;
                  const activeElevationZ = isActive ? 50 : 0;
                  const activeScale = isActive ? 1.05 : 1;

                  return (
                    <div
                      key={phase.id}
                      onClick={() => jumpToPhase(idx)}
                      className={`absolute inset-0 rounded-[22px] sm:rounded-[26px] p-5 sm:p-6 border flex flex-col justify-between cursor-pointer select-none transition-all duration-500 ${
                        phase.cardBg
                      } ${
                        isActive
                          ? "ring-2 ring-sky-400/80 shadow-2xl"
                          : "opacity-85 hover:opacity-100"
                      }`}
                      style={{
                        transform: `
                          rotateX(34deg) 
                          rotateZ(-27deg) 
                          rotateY(16deg) 
                          translate3d(${xOffset}px, ${yOffset + activeElevationY}px, ${zOffset + activeElevationZ}px)
                          scale(${activeScale})
                        `,
                        transformStyle: "preserve-3d",
                        zIndex: isActive ? 40 : 20 - idx,
                        filter: `drop-shadow(0 ${16 + idx * 4}px ${22 + idx * 6}px rgba(15, 23, 42, ${
                          isActive ? 0.45 : 0.25
                        }))`,
                      }}
                    >
                      {/* Top: EMV Chip + Brand */}
                      <div className="flex items-center justify-between">
                        <div
                          className={`w-9 h-6 rounded-md border shadow-inner relative flex items-center justify-center ${phase.chipBg}`}
                        >
                          <div className="w-full h-[1px] bg-amber-700/40 absolute top-2" />
                          <div className="h-full w-[1px] bg-amber-700/40 absolute left-3" />
                        </div>

                        {/* Contactless symbol */}
                        <svg
                          viewBox="0 0 24 24"
                          className="w-4 h-4 opacity-60"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M8.5 16.5a5 5 0 0 1 0-7" strokeLinecap="round" />
                          <path d="M12 19a8.5 8.5 0 0 0 0-14" strokeLinecap="round" />
                          <path d="M15.5 21.5a12 12 0 0 0 0-19" strokeLinecap="round" />
                        </svg>

                        <span className="text-[10px] font-black tracking-widest uppercase opacity-85">
                          NEXT 360°
                        </span>
                      </div>

                      {/* Middle: Title & Tag */}
                      <div className="my-auto py-1">
                        <div className="text-xs sm:text-sm font-black tracking-tight">
                          {phase.cardName}
                        </div>
                        <div className="text-[10px] font-semibold opacity-75 mt-0.5">
                          {phase.cardTag}
                        </div>
                      </div>

                      {/* Bottom: Holder Name + Payment Network circles */}
                      <div className="flex items-end justify-between pt-1">
                        <div>
                          <div className="text-[9px] font-semibold uppercase tracking-wider opacity-60">
                            Titular
                          </div>
                          <div className="text-[11px] sm:text-xs font-bold tracking-wide">
                            {phase.cardHolder}
                          </div>
                        </div>

                        <div className="flex -space-x-2 shrink-0">
                          <div className="w-5 h-5 rounded-full bg-red-500/90 shadow-xs" />
                          <div className="w-5 h-5 rounded-full bg-amber-400/90 shadow-xs" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Floating Status Pill */}
              <div className="absolute -bottom-2 right-2 hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-slate-200 shadow-md text-[11px] font-bold text-slate-800 z-50">
                <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
                <span>
                  Fase {currentPhaseData.phaseNum}: {currentPhaseData.cardTag}
                </span>
              </div>
            </div>
          </div>

          {/* BOTTOM PROGRESS TIMELINE BAR */}
          <div className="relative z-20 pt-4 border-t border-slate-200/70 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900">
                Progreso del recorrido:
              </span>
              <div className="w-24 sm:w-44 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-sky-500 h-full rounded-full transition-all duration-150"
                  style={{ width: `${Math.round(scrollProgress * 100)}%` }}
                />
              </div>
              <span className="text-[11px] font-bold text-sky-600">
                {Math.round(scrollProgress * 100)}%
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
              <span>Baja con el scroll para avanzar de fase</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
