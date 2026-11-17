"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  ChevronRight,
  Bell,
  Plus,
  Zap,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  Wifi,
  Building2,
  ShieldCheck,
} from "lucide-react";
import { VerticalKey } from "@/src/types/common";

interface LuloStyleScrollExperienceProps {
  onSelectVertical: (vertical: VerticalKey | any) => void;
}

function clamp(val: number, min: number, max: number) {
  return Math.max(min, Math.min(max, val));
}

function smoothstep(min: number, max: number, value: number) {
  const x = clamp((value - min) / (max - min), 0, 1);
  return x * x * (3 - 2 * x);
}

/**
 * Minimalist, high-precision SVG Card matching Lulo Bank's exact card aesthetic,
 * customized with NEXT Connection Group's official geometric logo + sky-blue arrow.
 */
function NextMinimalCard({
  bg,
  textColor,
  subTextColor,
  arrowColor,
  holderName,
  chipVariant = "silver",
}: {
  bg: string;
  textColor: string;
  subTextColor: string;
  arrowColor: string;
  holderName: string;
  chipVariant?: "silver" | "gold";
}) {
  return (
    <div
      className="w-full h-full rounded-[28px] relative select-none overflow-hidden border border-white/20"
      style={{
        backgroundColor: bg,
        boxShadow:
          "0 35px 70px -15px rgba(8, 28, 69, 0.35), 0 12px 24px -8px rgba(8, 28, 69, 0.2)",
      }}
    >
      {/* Top Right: "credit" + Contactless Waves */}
      <div
        className="absolute top-[11%] right-[8%] flex items-center gap-2"
        style={{ color: subTextColor }}
      >
        <span className="text-base sm:text-xl font-bold tracking-tight">
          credit
        </span>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          className="w-5 h-5 sm:w-6 sm:h-6"
        >
          <path
            d="M8.5 14.5C9.5 13.2 9.5 10.8 8.5 9.5"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            d="M12 16.5C13.8 14 13.8 10 12 7.5"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            d="M15.5 18.5C18.2 14.8 18.2 9.2 15.5 5.5"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Middle Row: Realistic Flat EMV Chip + NEXT Brand Logo with Sky Arrow */}
      <div className="absolute top-[46%] -translate-y-1/2 left-[13%] flex items-center gap-5 sm:gap-7">
        {/* Authentic Vector EMV Chip */}
        <svg
          viewBox="0 0 76 58"
          className="w-14 sm:w-[72px] h-auto shrink-0"
          fill="none"
        >
          <rect
            width="76"
            height="58"
            rx="10"
            fill={chipVariant === "silver" ? "#CBD5E1" : "#E5C168"}
          />
          <path
            d="M0 20H24C27 20 29 22 29 25V33C29 36 27 38 24 38H0"
            stroke="#FFFFFF"
            strokeWidth="1.6"
          />
          <path
            d="M76 20H52C49 20 47 22 47 25V33C47 36 49 38 52 38H76"
            stroke="#FFFFFF"
            strokeWidth="1.6"
          />
          <path d="M38 0V18" stroke="#FFFFFF" strokeWidth="1.6" />
          <path d="M38 40V58" stroke="#FFFFFF" strokeWidth="1.6" />
          <rect
            x="29"
            y="18"
            width="18"
            height="22"
            rx="4"
            stroke="#FFFFFF"
            strokeWidth="1.6"
          />
        </svg>

        {/* Bold Architectural NEXT Logo matching /logo-transparent.png */}
        <div className="relative flex flex-col">
          <div
            className="text-3xl sm:text-[44px] font-black tracking-[-0.04em] leading-none flex items-center"
            style={{ color: textColor }}
          >
            <span>NE</span>
            <span style={{ color: arrowColor }} className="mx-0.5">
              ➔
            </span>
            <span>XT</span>
            <span className="text-[10px] sm:text-xs font-bold ml-1 opacity-70 align-top">
              ®
            </span>
          </div>
          <span
            className="text-[10px] sm:text-[12px] font-bold tracking-widest uppercase self-end mt-0.5 mr-2 opacity-80"
            style={{ color: textColor }}
          >
            corporate
          </span>
        </div>
      </div>

      {/* Bottom Left: Cardholder Name */}
      <div
        className="absolute bottom-[13%] left-[9%] text-lg sm:text-[25px] font-bold tracking-tight"
        style={{ color: textColor }}
      >
        {holderName}
      </div>

      {/* Bottom Right: Mastercard Overlapping Circles */}
      <div className="absolute bottom-[11%] right-[7%] flex items-center">
        <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-[#EB001B]" />
        <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-[#F79E1B] -ml-4 sm:-ml-5 opacity-95" />
      </div>
    </div>
  );
}

export default function LuloStyleScrollExperience({
  onSelectVertical,
}: LuloStyleScrollExperienceProps) {
  const splitSectionRef = useRef<HTMLDivElement>(null);
  const cardsSectionRef = useRef<HTMLDivElement>(null);
  const ecosystemSectionRef = useRef<HTMLDivElement>(null);

  // Smoothed scroll progress values (0 -> 1)
  const [splitProgress, setSplitProgress] = useState(0);
  const [cardsProgress, setCardsProgress] = useState(0);
  const [ecoActive, setEcoActive] = useState(false);

  // Target values updated on native scroll, damped in RAF loop
  const targetSplitRef = useRef(0);
  const currentSplitRef = useRef(0);
  const targetCardsRef = useRef(0);
  const currentCardsRef = useRef(0);

  useEffect(() => {
    let rafId: number;

    const measureScroll = () => {
      const vh = window.innerHeight;

      if (splitSectionRef.current) {
        const rect = splitSectionRef.current.getBoundingClientRect();
        const total = splitSectionRef.current.offsetHeight - vh;
        if (total > 0) {
          targetSplitRef.current = clamp(-rect.top / total, 0, 1);
        }
      }

      if (cardsSectionRef.current) {
        const rect = cardsSectionRef.current.getBoundingClientRect();
        const total = cardsSectionRef.current.offsetHeight - vh;
        if (total > 0) {
          targetCardsRef.current = clamp(-rect.top / total, 0, 1);
        }
      }

      if (ecosystemSectionRef.current) {
        const rect = ecosystemSectionRef.current.getBoundingClientRect();
        if (rect.top < vh * 0.72) {
          setEcoActive(true);
        }
      }
    };

    const tick = () => {
      const diffSplit = targetSplitRef.current - currentSplitRef.current;
      if (Math.abs(diffSplit) > 0.0005) {
        currentSplitRef.current += diffSplit * 0.14;
        setSplitProgress(currentSplitRef.current);
      }

      const diffCards = targetCardsRef.current - currentCardsRef.current;
      if (Math.abs(diffCards) > 0.0005) {
        currentCardsRef.current += diffCards * 0.14;
        setCardsProgress(currentCardsRef.current);
      }

      rafId = window.requestAnimationFrame(tick);
    };

    window.addEventListener("scroll", measureScroll, { passive: true });
    window.addEventListener("resize", measureScroll);
    measureScroll();
    rafId = window.requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("scroll", measureScroll);
      window.removeEventListener("resize", measureScroll);
      window.cancelAnimationFrame(rafId);
    };
  }, []);

  // ============================================================================
  // 1. MATH FOR THE TRAVELING 3D SHOWCASE (50/50 SPLIT SECTION)
  // ============================================================================
  // Glides horizontally from Right (+22vw) across center (0vw) to Left (-22vw)
  const portalGlideT = smoothstep(0.14, 0.86, splitProgress);
  const portalOffsetVw = 22 - 44 * portalGlideT; // +22vw -> 0vw -> -22vw
  const innerSceneSlidePct = -50 * portalGlideT; // 0% (Desembolso) -> -50% (Empresa Creciendo)

  // Live animated numbers for Scene 1 (Desembolso) & Scene 2 (Empresa Creciendo)
  const disbursementCountT = smoothstep(0.0, 0.45, splitProgress);
  const disbursedAmount = Math.round(15000000 + 135000000 * disbursementCountT); // Counts up to $150,000,000 COP

  const growthCountT = smoothstep(0.5, 0.95, splitProgress);
  const growthPct = Math.round(120 + 220 * growthCountT); // Counts up to +340%
  const revenueMillions = Math.round(450 + 1400 * growthCountT); // Counts up to $1.850M COP

  // ============================================================================
  // 2. MATH FOR THE 4 ISOMETRIC 3D CARDS CASCADE (frame_1.png -> frame_2.png)
  // ============================================================================
  const cardEntranceT = smoothstep(0.0, 0.2, cardsProgress);
  const cardFanT = smoothstep(0.2, 0.86, cardsProgress);

  const isoRotateZ = -30 * cardFanT;
  const isoRotateY = 30 * cardFanT;
  const isoRotateX = 45 * cardFanT;
  const isoScaleX = 1.02 - 0.24 * cardFanT;
  const isoScaleY = 1.02 - 0.16 * cardFanT;

  const card1Y = -205 * cardFanT; // White (Top)
  const card2Y = -55 * cardFanT; // Light Sky Blue (Upper-Mid)
  const card3Y = 85 * cardFanT; // Deep Royal Navy (Lower-Mid)
  const card4Y = 230 * cardFanT; // Obsidian Black (Bottom)

  return (
    <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] overflow-x-clip font-sans select-none">
      <style>{`
        @keyframes nextFloatSlow {
          0%, 100% { transform: translateY(0px) scale(1.02); }
          50% { transform: translateY(-8px) scale(1.04); }
        }
        @keyframes nextPulseGlow {
          0%, 100% { opacity: 0.45; transform: scale(0.96); }
          50% { opacity: 0.85; transform: scale(1.06); }
        }
        .anim-3d-scene {
          animation: nextFloatSlow 5.5s ease-in-out infinite;
        }
      `}</style>

      {/* ==================================================================== */}
      {/* SECTION A: 50/50 SPLIT COLOR BLOCKS WITH TRAVELING 3D ANIMATION      */}
      {/* (Row 1: Desembolsando la plata -> Row 2: La empresa creciendo)       */}
      {/* ==================================================================== */}
      <section ref={splitSectionRef} className="relative w-full lg:h-[220vh]">
        {/* STICKY TRAVELING 3D SHOWCASE PORTAL (Glides from Right to Left) */}
        <div className="hidden lg:block absolute inset-0 pointer-events-none z-30">
          <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
            <div
              className="will-change-transform"
              style={{
                transform: `translate3d(${portalOffsetVw}vw, 0px, 0px)`,
              }}
            >
              {/* Ambient Sky-Blue Aura behind the traveling 3D portal */}
              <div className="absolute -inset-6 rounded-[56px] bg-sky-400/25 blur-3xl pointer-events-none" />

              {/* SLEEK GLASS & TITANIUM 3D PORTAL FRAME */}
              <div className="relative w-[395px] h-[565px] rounded-[46px] p-[9px] bg-gradient-to-b from-sky-200 via-sky-400/60 to-sky-900 shadow-[0_35px_85px_rgba(8,28,69,0.42)]">
                <div className="w-full h-full rounded-[38px] bg-[#081c45] overflow-hidden relative ring-1 ring-white/30">
                  {/* HORIZONTAL SLIDING SCENE TRACK (200% width: Scene 1 & Scene 2) */}
                  <div
                    className="w-[200%] h-full flex will-change-transform"
                    style={{
                      transform: `translate3d(${innerSceneSlidePct}%, 0, 0)`,
                    }}
                  >
                    {/* ------------------------------------------------------ */}
                    {/* SCENE 1 (RIGHT SIDE): PERSONA DESEMBOLSANDO EN DATÁFONO */}
                    {/* ------------------------------------------------------ */}
                    <div className="w-1/2 h-full relative overflow-hidden bg-[#081c45] flex flex-col justify-between p-5">
                      {/* Full-bleed 3D Pixar Illustration of Entrepreneur Tapping NEXT Card on POS */}
                      <img
                        src="/assets/next-desembolso-3d.jpg"
                        alt="Empresaria desembolsando con tarjeta NEXT en datáfono"
                        className="absolute inset-0 w-full h-full object-cover object-center anim-3d-scene"
                      />

                      {/* Subtle top & bottom gradient vignettes for crisp HUD readability */}
                      <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#081c45]/80 via-[#081c45]/30 to-transparent pointer-events-none" />
                      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#061533] via-[#061533]/85 to-transparent pointer-events-none" />

                      {/* TOP FLOATING HUD PILL: Contactless Datáfono Status */}
                      <div className="relative z-20 flex items-center justify-between px-3.5 py-2 rounded-full bg-slate-950/75 backdrop-blur-md border border-sky-400/40 text-white shadow-lg">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 -ml-4.5" />
                          <span className="text-[11px] font-extrabold tracking-wide text-sky-200">
                            DATÁFONO POS • DESEMBOLSO ACTIVO
                          </span>
                        </div>
                        <Wifi className="w-4 h-4 text-sky-400 rotate-90 animate-pulse" />
                      </div>

                      {/* BOTTOM LIVE BANK ACCOUNT CREDIT CARD OVERLAY */}
                      <div className="relative z-20 rounded-3xl p-4 bg-white/95 backdrop-blur-xl border border-sky-200 shadow-2xl text-[#0f243c]">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-sky-600 flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-sky-500" />
                            Abono directo a tu cuenta bancaria
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-extrabold">
                            APROBADO ✓
                          </span>
                        </div>

                        <div className="flex items-baseline justify-between mt-1">
                          <div>
                            <span className="text-[11px] text-slate-500 font-semibold block">
                              Monto Desembolsado Hoy
                            </span>
                            <span className="text-2xl font-black tracking-tight text-[#0f243c] font-mono">
                              + ${disbursedAmount.toLocaleString("es-CO")}
                            </span>
                          </div>
                          <div className="w-9 h-9 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center font-black">
                            <CheckCircle2 className="w-5 h-5 text-sky-600" />
                          </div>
                        </div>

                        {/* Animated Sky-Blue Progress Bar */}
                        <div className="w-full h-1.5 rounded-full bg-sky-100 mt-3 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-sky-400 to-emerald-400 transition-all duration-150"
                            style={{
                              width: `${Math.max(
                                35,
                                disbursementCountT * 100
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* ------------------------------------------------------ */}
                    {/* SCENE 2 (LEFT SIDE): LA EMPRESA CRECIENDO Y ESCALANDO  */}
                    {/* ------------------------------------------------------ */}
                    <div className="w-1/2 h-full relative overflow-hidden bg-[#dbf0ff] flex flex-col justify-between p-5">
                      {/* Full-bleed 3D Pixar Illustration of Growing Corporate Building & Charts */}
                      <img
                        src="/assets/next-empresa-creciendo-3d.jpg"
                        alt="Empresa creciendo con edificio corporativo y gráficas ascendentes"
                        className="absolute inset-0 w-full h-full object-cover object-center anim-3d-scene"
                      />

                      {/* Subtle top & bottom gradient vignettes */}
                      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-sky-950/35 to-transparent pointer-events-none" />
                      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#081c45]/90 via-[#081c45]/60 to-transparent pointer-events-none" />

                      {/* TOP FLOATING HUD PILL: Corporate Expansion */}
                      <div className="relative z-20 flex items-center justify-between px-3.5 py-2 rounded-full bg-white/90 backdrop-blur-md border border-sky-300 text-[#0f243c] shadow-lg">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-sky-600" />
                          <span className="text-[11px] font-extrabold tracking-wide text-[#0f243c]">
                            TU EMPRESA ESCALANDO AL SIGUIENTE NIVEL
                          </span>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-black">
                          +{growthPct}%
                        </span>
                      </div>

                      {/* BOTTOM LIVE COMPANY GROWTH METRICS OVERLAY */}
                      <div className="relative z-20 rounded-3xl p-4 bg-[#0f243c]/95 backdrop-blur-xl border border-sky-400/40 shadow-2xl text-white">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-sky-300 flex items-center gap-1">
                            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                            Crecimiento Patrimonial & Operativo
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-sky-400/20 text-sky-300 text-[10px] font-extrabold border border-sky-400/30">
                            EXPANSIÓN 360°
                          </span>
                        </div>

                        <div className="flex items-baseline justify-between mt-1">
                          <div>
                            <span className="text-[11px] text-sky-200/80 font-medium block">
                              Capacidad & Facturación Proyectada
                            </span>
                            <span className="text-2xl font-black tracking-tight text-white font-mono">
                              $ {revenueMillions.toLocaleString("es-CO")}{" "}
                              Millones
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-black text-emerald-400 block">
                              ↑ +{growthPct}%
                            </span>
                            <span className="text-[9px] text-sky-300 block">
                              vs. año anterior
                            </span>
                          </div>
                        </div>

                        {/* Growth Pillars Tags */}
                        <div className="flex items-center gap-1.5 mt-3 pt-2.5 border-t border-white/10 text-[10px] font-bold text-sky-200">
                          <span className="px-2.5 py-0.5 rounded-full bg-sky-500/20 border border-sky-400/30">
                            Nuevas Sedes
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full bg-sky-500/20 border border-sky-400/30">
                            Maquinaria
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                            Flujo Blindado
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================================================================== */}
        {/* ROW 1: DESEMBOLSO ÁGIL (Left #f4f8fc Ice White | Right #081c45 Navy) */}
        {/* ================================================================== */}
        <div className="w-full lg:h-[110vh] grid grid-cols-1 lg:grid-cols-2">
          {/* Left Half: Ice White with Bold Editorial Copy */}
          <div className="bg-[#f4f8fc] flex items-center justify-center px-6 sm:px-14 lg:px-20 xl:px-28 py-16 lg:py-0">
            <div className="max-w-lg">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-700 text-xs font-extrabold uppercase tracking-wider mb-4">
                <Sparkles className="w-3.5 h-3.5 text-sky-500" />
                Paso 1 • Liquidez & Desembolso Inmediato
              </span>

              <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-[#0f243c] leading-[1.06] tracking-[-0.04em] mb-7">
                Una gestión financiera que desembolsa directo a tu cuenta
              </h2>

              <ul className="list-disc pl-5 space-y-4 text-[#0f243c] text-base sm:text-[17px] leading-[1.48] mb-9">
                <li>
                  Estructuramos tu cupo con{" "}
                  <strong className="font-extrabold text-sky-700">
                    más de 35 bancos y entidades aliadas
                  </strong>{" "}
                  para que tengas la tasa más baja del mercado.
                </li>
                <li>
                  <strong className="font-extrabold">
                    $0 de cobros anticipados
                  </strong>
                  , pasas tu tarjeta corporativa NEXT y el capital entra directo
                  a la cuenta bancaria de tu empresa.
                </li>
                <li>
                  Úsalo de inmediato para{" "}
                  <strong className="font-extrabold">
                    capital de trabajo, compra de cartera, nómina o proveedores
                  </strong>
                  .
                </li>
              </ul>

              <div className="flex flex-wrap items-center gap-6">
                <button
                  onClick={() => onSelectVertical("credito")}
                  className="px-7 py-3.5 rounded-full bg-[#38bdf8] hover:bg-[#0ea5e9] text-[#081c45] font-extrabold text-sm sm:text-base flex items-center gap-3 transition-all active:scale-95 cursor-pointer shadow-lg shadow-sky-400/30"
                >
                  <span>Solicitar desembolso</span>
                  <ChevronRight className="w-4 h-4 stroke-[3]" />
                </button>

                <button
                  onClick={() => onSelectVertical("credito")}
                  className="text-[#0f243c] font-extrabold text-sm sm:text-base hover:text-sky-600 transition-colors cursor-pointer"
                >
                  Conoce nuestras líneas
                </button>
              </div>
            </div>
          </div>

          {/* Right Half: Deep NEXT Navy Backdrop (Matches Scene 1 3D Illustration) */}
          <div className="bg-[#081c45] min-h-[460px] lg:min-h-full flex items-center justify-center p-8 lg:p-0">
            {/* Mobile-only preview of Scene 1 */}
            <div className="lg:hidden w-[310px] rounded-[34px] overflow-hidden bg-[#081c45] border-2 border-sky-400/40 shadow-2xl">
              <img
                src="/assets/next-desembolso-3d.jpg"
                alt="Desembolso NEXT"
                className="w-full h-72 object-cover"
              />
              <div className="p-4 bg-white text-[#0f243c]">
                <span className="text-[10px] font-bold text-sky-600 uppercase">
                  Abono directo en cuenta
                </span>
                <div className="text-xl font-black text-[#0f243c]">
                  + $150.000.000 COP
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================================================================== */}
        {/* ROW 2: EMPRESA CRECIENDO (Left #dbf0ff Azul Clarito | Right #f4f8fc)*/}
        {/* ================================================================== */}
        <div className="w-full lg:h-[110vh] grid grid-cols-1 lg:grid-cols-2">
          {/* Left Half: NEXT Light Sky Blue ("Azul Clarito" #dbf0ff) */}
          <div className="bg-[#dbf0ff] min-h-[460px] lg:min-h-full flex items-center justify-center p-8 lg:p-0 order-2 lg:order-1">
            {/* Mobile-only preview of Scene 2 */}
            <div className="lg:hidden w-[310px] rounded-[34px] overflow-hidden bg-[#dbf0ff] border-2 border-sky-400 shadow-2xl">
              <img
                src="/assets/next-empresa-creciendo-3d.jpg"
                alt="Empresa Creciendo con NEXT"
                className="w-full h-72 object-cover"
              />
              <div className="p-4 bg-[#0f243c] text-white">
                <span className="text-[10px] font-bold text-sky-300 uppercase">
                  Expansión Empresarial
                </span>
                <div className="text-xl font-black text-emerald-400">
                  ↑ +340% Crecimiento
                </div>
              </div>
            </div>
          </div>

          {/* Right Half: Ice White with Bold Business Growth Copy */}
          <div className="bg-[#f4f8fc] flex items-center justify-center px-6 sm:px-14 lg:px-20 xl:px-28 py-16 lg:py-0 order-1 lg:order-2">
            <div className="max-w-lg">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-700 text-xs font-extrabold uppercase tracking-wider mb-4">
                <TrendingUp className="w-3.5 h-3.5 text-sky-600" />
                Paso 2 • Escalabilidad & Crecimiento
              </span>

              <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-[#0f243c] leading-[1.06] tracking-[-0.04em] mb-7">
                Un músculo financiero que hace crecer tu empresa
              </h2>

              <ul className="list-disc pl-5 space-y-3.5 text-[#0f243c] text-base sm:text-[17px] leading-[1.48] mb-9">
                <li>
                  Con el dinero desembolsado en tu cuenta, tu empresa{" "}
                  <strong className="font-extrabold text-sky-700">
                    invierte en inventario, tecnología y nuevas sedes
                  </strong>
                  .
                </li>
                <li>
                  <strong className="font-extrabold">
                    Sin filas, sin trámites notariales, sin descapitalizarte.
                  </strong>
                </li>
                <li>
                  Escoge la fecha de pago, el monto de tu cupo y el plazo que se
                  adapte a tu flujo de caja.
                </li>
                <li>
                  Blinda tus activos y multiplica tu facturación con el respaldo
                  integral de NEXT.
                </li>
              </ul>

              <div className="flex flex-wrap items-center gap-6">
                <button
                  onClick={() => onSelectVertical("credito")}
                  className="px-7 py-3.5 rounded-full bg-[#38bdf8] hover:bg-[#0ea5e9] text-[#081c45] font-extrabold text-sm sm:text-base flex items-center gap-3 transition-all active:scale-95 cursor-pointer shadow-lg shadow-sky-400/30"
                >
                  <span>Impulsar mi empresa</span>
                  <ChevronRight className="w-4 h-4 stroke-[3]" />
                </button>

                <button
                  onClick={() => onSelectVertical("inversiones")}
                  className="text-[#0f243c] font-extrabold text-sm sm:text-base hover:text-sky-600 transition-colors cursor-pointer"
                >
                  Conoce el ecosistema NEXT
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* SECTION B: 250VH STICKY 3D ISOMETRIC CARDS FAN-OUT (#e4eef8)         */}
      {/* (4 Minimalist NEXT Cards in Sky Blue, White, Royal Navy & Obsidian)  */}
      {/* ==================================================================== */}
      <section
        ref={cardsSectionRef}
        className="relative w-full h-[250vh] bg-[#e4eef8]"
      >
        <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center">
          <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-14 lg:px-24 grid grid-cols-1 lg:grid-cols-12 items-center gap-8">
            {/* LEFT PINNED COLUMN: Copy & CTAs */}
            <div className="lg:col-span-5 z-30">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 text-sky-700 text-xs font-extrabold uppercase tracking-wider mb-4 shadow-2xs">
                <ShieldCheck className="w-3.5 h-3.5 text-sky-500" />
                Tarjetas & Cupos Corporativos NEXT
              </span>

              <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-[#0f243c] leading-[1.05] tracking-[-0.04em] mb-7">
                Una tarjeta corporativa que te da liquidez por comprar
              </h2>

              <ul className="list-disc pl-5 space-y-3.5 text-[#0f243c] text-sm sm:text-[17px] leading-[1.45] mb-9">
                <li>
                  Obtén{" "}
                  <strong className="font-extrabold text-sky-700">
                    tasas preferenciales y retorno en flujo de caja
                  </strong>{" "}
                  para compras operativas, proveedores e inventario.
                </li>
                <li>
                  Dale la personalidad de tu empresa,{" "}
                  <strong className="font-extrabold">
                    asigna el titular y escoge el nivel
                  </strong>{" "}
                  de cada tarjeta ejecutiva.
                </li>
                <li>
                  Compra por internet o pasa tu tarjeta en datáfonos físicos en
                  Colombia y el mundo.
                </li>
                <li>
                  Realiza pagos empresariales y desembolsos inmediatos por PSE y
                  ACH.
                </li>
                <li>
                  Activa, congela y controla tus cupos en tiempo real desde Mi
                  Portal NEXT.
                </li>
              </ul>

              <div className="flex flex-wrap items-center gap-6">
                <button
                  onClick={() => onSelectVertical("credito")}
                  className="px-7 py-3.5 rounded-full bg-[#38bdf8] hover:bg-[#0ea5e9] text-[#081c45] font-extrabold text-sm sm:text-base flex items-center gap-3 transition-all active:scale-95 cursor-pointer shadow-lg shadow-sky-400/30"
                >
                  <span>Solicitar Tarjeta NEXT</span>
                  <ChevronRight className="w-4 h-4 stroke-[3]" />
                </button>

                <button
                  onClick={() => onSelectVertical("credito")}
                  className="text-[#0f243c] font-extrabold text-sm sm:text-base hover:text-sky-600 transition-colors cursor-pointer"
                >
                  Pide tu cupo empresarial
                </button>
              </div>
            </div>

            {/* RIGHT COLUMN: 4 CARDS IN 3D ISOMETRIC STACK (frame_1 -> frame_2) */}
            <div className="lg:col-span-7 relative h-[420px] sm:h-[620px] flex items-center justify-center">
              <div
                className="relative w-[320px] sm:w-[540px] h-[205px] sm:h-[340px]"
                style={{ perspective: "1200px" }}
              >
                {/* CARD 4 (BOTTOM): EXECUTIVE OBSIDIAN (#091428) */}
                <div
                  className="absolute inset-0 will-change-transform"
                  style={{
                    zIndex: 10,
                    opacity: smoothstep(0.18, 0.35, cardsProgress),
                    transform: `translate3d(${
                      (1 - cardEntranceT) * 120
                    }px, ${card4Y}px, 0px) rotate(${isoRotateZ}deg) rotateY(${isoRotateY}deg) rotateX(${isoRotateX}deg) scale(${isoScaleX}, ${isoScaleY})`,
                  }}
                >
                  <NextMinimalCard
                    bg="#091428"
                    textColor="#FFFFFF"
                    subTextColor="#7DD3FC"
                    arrowColor="#38BDF8"
                    holderName="Andrés"
                    chipVariant="gold"
                  />
                </div>

                {/* CARD 3 (LOWER-MID): NEXT AZUL CLARITO (#7DD3FC) */}
                <div
                  className="absolute inset-0 will-change-transform"
                  style={{
                    zIndex: 20,
                    opacity: smoothstep(0.14, 0.3, cardsProgress),
                    transform: `translate3d(${
                      (1 - cardEntranceT) * 120
                    }px, ${card3Y}px, 0px) rotate(${isoRotateZ}deg) rotateY(${isoRotateY}deg) rotateX(${isoRotateX}deg) scale(${isoScaleX}, ${isoScaleY})`,
                  }}
                >
                  <NextMinimalCard
                    bg="#7DD3FC"
                    textColor="#081C45"
                    subTextColor="#0369A1"
                    arrowColor="#0284C7"
                    holderName="Sebas"
                    chipVariant="silver"
                  />
                </div>

                {/* CARD 2 (UPPER-MID): DEEP ROYAL NAVY (#0F294E) */}
                <div
                  className="absolute inset-0 will-change-transform"
                  style={{
                    zIndex: 30,
                    opacity: smoothstep(0.1, 0.25, cardsProgress),
                    transform: `translate3d(${
                      (1 - cardEntranceT) * 120
                    }px, ${card2Y}px, 0px) rotate(${isoRotateZ}deg) rotateY(${isoRotateY}deg) rotateX(${isoRotateX}deg) scale(${isoScaleX}, ${isoScaleY})`,
                  }}
                >
                  <NextMinimalCard
                    bg="#0F294E"
                    textColor="#FFFFFF"
                    subTextColor="#93C5FD"
                    arrowColor="#38BDF8"
                    holderName="Caro"
                    chipVariant="silver"
                  />
                </div>

                {/* CARD 1 (TOP): PURE WHITE (#FFFFFF) */}
                <div
                  className="absolute inset-0 will-change-transform"
                  style={{
                    zIndex: 40,
                    opacity: clamp(cardEntranceT * 1.5, 0, 1),
                    transform: `translate3d(${
                      (1 - cardEntranceT) * 140
                    }px, ${card1Y}px, 0px) rotate(${isoRotateZ}deg) rotateY(${isoRotateY}deg) rotateX(${isoRotateX}deg) scale(${isoScaleX}, ${isoScaleY})`,
                  }}
                >
                  <NextMinimalCard
                    bg="#FFFFFF"
                    textColor="#0F243C"
                    subTextColor="#64748B"
                    arrowColor="#0EA5E9"
                    holderName="Majo"
                    chipVariant="silver"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* SECTION C: DARK ECOSYSTEM ORBIT SECTION ("Hacemos parte de un...")   */}
      {/* (With NEXT Sky-Blue Palette, Tilted Devices & Dashed Orbit)          */}
      {/* ==================================================================== */}
      <section
        ref={ecosystemSectionRef}
        className="relative w-full py-24 sm:py-32 px-6 overflow-hidden text-center text-white"
        style={{
          background:
            "radial-gradient(52.34% 38.5% at 50% 61.5%, #132f5c 0%, #07142b 100%)",
        }}
      >
        <style>{`
          @keyframes luloOrbitDash {
            to {
              stroke-dashoffset: -120;
            }
          }
          .anim-lulo-orbit {
            animation: luloOrbitDash 6s linear infinite;
          }
        `}</style>

        {/* Heading & Subtitle */}
        <div
          className={`max-w-3xl mx-auto transition-all duration-1000 ${
            ecoActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-5">
            Hacemos parte de un ecosistema
          </h2>
          <p className="text-base sm:text-lg text-sky-100/90 max-w-xl mx-auto leading-relaxed">
            Estamos dentro de la plataforma NEXT junto a nuestras líneas de
            Finanzas, Seguros e Inversiones y queremos ayudarte a construir un
            futuro empresarial y patrimonial mejor.
          </p>
        </div>

        {/* Centerpiece: Two Tilted iPhones + Dashed Sky-Blue Elliptical Orbit */}
        <div className="relative max-w-4xl mx-auto h-[440px] sm:h-[520px] my-8 flex items-center justify-center">
          {/* Animated Dashed SVG Elliptical Orbit */}
          <svg
            viewBox="0 0 800 380"
            className="absolute w-[95%] max-w-[740px] h-auto pointer-events-none z-10"
            fill="none"
          >
            <ellipse
              cx="400"
              cy="190"
              rx="340"
              ry="135"
              transform="rotate(-8 400 190)"
              stroke="rgba(125, 211, 252, 0.55)"
              strokeWidth="2"
              strokeDasharray="9 9"
              className="anim-lulo-orbit"
            />
          </svg>

          {/* Left Orbiting "+" Badge in Light Sky Blue */}
          <div
            className={`absolute left-[8%] sm:left-[14%] bottom-[24%] z-30 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#bae6fd] text-[#081c45] flex items-center justify-center shadow-xl shadow-sky-400/20 transition-all duration-1000 delay-300 ${
              ecoActive ? "opacity-100 scale-100" : "opacity-0 scale-50"
            }`}
          >
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </div>

          {/* Right Orbiting "⚡" Badge in Cyan/Sky */}
          <div
            className={`absolute right-[8%] sm:right-[14%] top-[30%] z-30 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#38bdf8] text-[#081c45] flex items-center justify-center shadow-xl shadow-sky-400/30 transition-all duration-1000 delay-500 ${
              ecoActive ? "opacity-100 scale-100" : "opacity-0 scale-50"
            }`}
          >
            <Zap className="w-5 h-5 fill-[#081c45]" />
          </div>

          {/* LEFT TILTED PHONE (NEXT Cuenta & Desembolso) */}
          <div
            className="w-[210px] sm:w-[250px] h-[410px] sm:h-[470px] rounded-[38px] p-2 bg-gradient-to-b from-sky-200 via-sky-500/60 to-slate-800 shadow-2xl z-20 transition-all duration-1000 ease-out -mr-6 sm:-mr-10"
            style={{
              transform: ecoActive
                ? "translate3d(-12px, 18px, 0) rotate(-11deg)"
                : "translate3d(-40px, 60px, 0) rotate(-16deg)",
              opacity: ecoActive ? 1 : 0,
            }}
          >
            <div className="w-full h-full rounded-[31px] bg-[#0c1d3b] p-3.5 text-left text-white flex flex-col justify-between overflow-hidden relative">
              <div className="flex items-center justify-between text-[9px] text-sky-200">
                <span>9:41</span>
                <Bell className="w-3 h-3" />
              </div>

              <div className="mt-1">
                <div className="w-6 h-6 rounded-full bg-sky-400/30 text-sky-200 flex items-center justify-center text-[9px] font-bold mb-1">
                  NX
                </div>
                <span className="text-[9px] text-sky-300/80 block">
                  Buenos días
                </span>
                <span className="text-xs font-extrabold text-white">
                  Camilo
                </span>
              </div>

              {/* Light Sky-Blue Account Card inside Left Phone */}
              <div className="p-3 rounded-2xl bg-[#e0f2fe] text-[#081c45] my-1.5 shadow-md">
                <span className="text-[9px] font-extrabold text-sky-700 block">
                  NEXT Cuenta Empresarial
                </span>
                <span className="text-[8px] text-slate-600 block mt-2">
                  Saldo desembolsado
                </span>
                <span className="text-sm font-black text-[#081c45] block">
                  $152,460,584
                </span>
                <span className="text-[7px] text-sky-700 font-bold block mt-1">
                  + $150,000,000 acreditados hoy
                </span>
              </div>

              {/* Promo Banner inside Left Phone */}
              <div className="p-2.5 rounded-xl bg-sky-500/15 border border-sky-400/30">
                <span className="px-1.5 py-0.5 rounded-full bg-[#38bdf8] text-[#081c45] text-[7px] font-extrabold">
                  Activo
                </span>
                <span className="text-[9px] font-bold text-white block mt-1">
                  Seguros & Blindaje 360°
                </span>
                <span className="text-[7px] text-sky-200 block">
                  Ahorra hasta 50% en tus pólizas actuales.
                </span>
              </div>

              <div className="pt-1.5 border-t border-white/10 flex items-center justify-between text-[8px] text-sky-300/70">
                <span>Home</span>
                <span>Crédito</span>
                <span className="w-5 h-5 rounded-full bg-[#38bdf8] text-[#081c45] flex items-center justify-center font-black">
                  +
                </span>
                <span>Seguros</span>
              </div>
            </div>
          </div>

          {/* RIGHT TILTED PHONE (NEXT Inversiones & Crecimiento) */}
          <div
            className="w-[210px] sm:w-[250px] h-[410px] sm:h-[470px] rounded-[38px] p-2 bg-gradient-to-b from-sky-300 via-sky-600 to-slate-900 shadow-2xl z-25 transition-all duration-1000 ease-out"
            style={{
              transform: ecoActive
                ? "translate3d(12px, -18px, 0) rotate(11deg)"
                : "translate3d(40px, -60px, 0) rotate(16deg)",
              opacity: ecoActive ? 1 : 0,
            }}
          >
            <div className="w-full h-full rounded-[31px] bg-gradient-to-b from-[#0ea5e9] via-[#0369a1] to-[#081c45] p-3.5 text-left text-white flex flex-col justify-between overflow-hidden relative">
              <div className="flex items-center justify-between text-[9px] text-sky-100">
                <span className="font-black text-xs text-white">nextˣ</span>
                <span className="w-5 h-5 rounded-full bg-white text-[#081c45] font-extrabold text-[8px] flex items-center justify-center">
                  VIP
                </span>
              </div>

              <div>
                <span className="text-[11px] font-extrabold text-white block">
                  Tu empresa crece, Camilo
                </span>
                <span className="text-[8px] text-sky-100 block leading-snug">
                  Multiplica tus excedentes con custodia fiduciaria vigilada.
                </span>
              </div>

              {/* Portfolio Balance */}
              <div className="my-1">
                <span className="text-[8px] text-sky-200 block">
                  Portafolio de inversión activo ≈
                </span>
                <span className="text-base font-black text-white block mt-0.5">
                  $ 185.500.000
                </span>
                <div className="flex items-center gap-2 mt-2">
                  <span className="px-2.5 py-1 rounded-full bg-white/15 text-white text-[8px] font-bold">
                    Renta Fija
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[#7dd3fc] text-[#081c45] text-[8px] font-extrabold">
                    Invertir
                  </span>
                </div>
              </div>

              {/* Rate Highlight Card */}
              <div className="p-2.5 rounded-xl bg-white/15 backdrop-blur-xs border border-white/25 flex items-center justify-between gap-2">
                <span className="text-[8px] text-white font-medium leading-tight">
                  ¡Aprovecha! Rentabilidad objetivo de hasta 17.8% E.A.
                </span>
                <span className="w-6 h-6 rounded-full bg-emerald-400 text-[#081c45] font-black flex items-center justify-center text-[10px] shrink-0">
                  ✓
                </span>
              </div>

              <div className="pt-1.5 border-t border-white/15 flex items-center justify-between text-[8px] text-sky-100">
                <span>Inicio</span>
                <span>Portafolio</span>
                <span>Pólizas</span>
                <span>NEXT 360°</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Description & CTA */}
        <div className="max-w-xl mx-auto space-y-6 mt-4">
          <p className="text-sm sm:text-base text-sky-100/90 leading-relaxed">
            Aprende cómo puedes transformar las finanzas de tu empresa o
            patrimonio con desembolsos ágiles, seguros todo riesgo e inversiones
            de alto rendimiento en un solo lugar.
          </p>

          <div className="flex justify-center">
            <button
              onClick={() => onSelectVertical("inversiones")}
              className="px-8 py-3.5 rounded-full bg-[#38bdf8] hover:bg-[#7dd3fc] text-[#081c45] font-extrabold text-sm sm:text-base flex items-center gap-3 transition-all active:scale-95 cursor-pointer shadow-lg shadow-sky-400/30"
            >
              <span>Conocer más</span>
              <ChevronRight className="w-4 h-4 stroke-[3]" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
