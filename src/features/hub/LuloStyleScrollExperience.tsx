"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  ArrowUp,
  Send,
  HandCoins,
  ArrowDown,
  ChevronRight,
  ChevronLeft,
  Eye,
  Settings,
  Bell,
  Home,
  CreditCard,
  Plus,
  GraduationCap,
  HelpCircle,
  Zap,
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
 * Minimalist, high-precision SVG Card matching Lulo Bank's exact card aesthetic
 * (Chip on mid-left, bold geometric brand mark in center, debit/credit + contactless top-right,
 * holder name bottom-left, overlapping Mastercard circles bottom-right).
 */
function LuloMinimalCard({
  bg,
  textColor,
  subTextColor,
  logoColor,
  holderName,
  chipVariant = "silver",
}: {
  bg: string;
  textColor: string;
  subTextColor: string;
  logoColor: string;
  holderName: string;
  chipVariant?: "silver" | "gold";
}) {
  return (
    <div
      className="w-full h-full rounded-[28px] relative select-none overflow-hidden"
      style={{
        backgroundColor: bg,
        boxShadow:
          "0 35px 70px -15px rgba(15, 23, 42, 0.38), 0 12px 24px -8px rgba(15, 23, 42, 0.22)",
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

      {/* Middle Row: Realistic Flat EMV Chip + Geometric Brand Logo */}
      <div className="absolute top-[46%] -translate-y-1/2 left-[14%] flex items-center gap-5 sm:gap-7">
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
            fill={chipVariant === "silver" ? "#C5C8CE" : "#E5C168"}
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

        {/* Bold Architectural Logo ("next" in Lulo geometric style) */}
        <div className="relative flex flex-col">
          <div
            className="text-3xl sm:text-[46px] font-black tracking-[-0.06em] leading-none flex items-baseline"
            style={{ color: logoColor }}
          >
            <span>next</span>
            <span className="text-[10px] sm:text-xs font-bold ml-1 opacity-70 align-top">
              ®
            </span>
          </div>
          <span
            className="text-[11px] sm:text-[13px] font-bold tracking-tight self-end -mt-0.5 mr-2"
            style={{ color: textColor }}
          >
            finance
          </span>
        </div>
      </div>

      {/* Bottom Left: Cardholder Name */}
      <div
        className="absolute bottom-[13%] left-[9%] text-lg sm:text-[26px] font-bold tracking-tight"
        style={{ color: textColor }}
      >
        {holderName}
      </div>

      {/* Bottom Right: Mastercard Overlapping Circles */}
      <div className="absolute bottom-[11%] right-[7%] flex items-center">
        <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-[#EB001B]" />
        <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-[#F79E1B] -ml-4 sm:-ml-5 mix-blend-normal opacity-95" />
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

  // Target values updated on native scroll, damped in RAF loop (like Lulo's glxp ticker)
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
      // Damped interpolation (0.14 factor for silky Lulo-like inertia)
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
  // 1. MATH FOR THE TRAVELING IPHONE (50/50 SPLIT SECTION)
  // ============================================================================
  // As splitProgress goes from 0.12 to 0.88, the phone glides from Right (+22vw)
  // across the 4-corner center (0vw) to Left (-22vw).
  const phoneGlideT = smoothstep(0.12, 0.88, splitProgress);
  const phoneOffsetVw = 22 - 44 * phoneGlideT; // +22vw -> 0vw -> -22vw
  const innerScreenSlidePct = -50 * phoneGlideT; // 0% -> -50%

  // Dynamic credit calculator values that respond slightly to scroll in Block 2
  const calcSubT = smoothstep(0.55, 0.98, splitProgress);
  const selectedMonths = Math.round(24 + 24 * calcSubT); // 24 to 48 meses
  const monthlyInstallment = Math.round(150000000 / selectedMonths + 420000);

  // ============================================================================
  // 2. MATH FOR THE 4 ISOMETRIC 3D CARDS CASCADE (frame_1.png -> frame_2.png)
  // ============================================================================
  // Stage 1 (0.0 -> 0.22): Single large flat White card enters on the right.
  // Stage 2 (0.22 -> 0.88): Rotates into 3D isometric angle & fans out 4 cards vertically.
  const cardEntranceT = smoothstep(0.0, 0.2, cardsProgress);
  const cardFanT = smoothstep(0.2, 0.86, cardsProgress);

  // Isometric angles matching Lulo Bank's exact GSAP transform:
  // rotate(-30deg) rotateY(30deg) rotateX(45deg) scale(0.76, 0.84)
  const isoRotateZ = -30 * cardFanT;
  const isoRotateY = 30 * cardFanT;
  const isoRotateX = 45 * cardFanT;
  const isoScaleX = 1.02 - 0.24 * cardFanT;
  const isoScaleY = 1.02 - 0.16 * cardFanT;

  // Vertical fan-out offsets (in px) for the 4 stacked cards
  const card1Y = -205 * cardFanT; // White (Top)
  const card2Y = -55 * cardFanT; // Dark Navy (Upper-Mid)
  const card3Y = 85 * cardFanT; // Neon Lime (Lower-Mid)
  const card4Y = 230 * cardFanT; // Matte Black (Bottom)

  return (
    <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] overflow-x-clip font-sans select-none">
      {/* ==================================================================== */}
      {/* SECTION A: 50/50 SPLIT COLOR BLOCKS WITH TRAVELING IPHONE MOCKUP     */}
      {/* (Replicates Lulo Cuenta -> Transition Slide -> Lulo Crédito)         */}
      {/* ==================================================================== */}
      <section ref={splitSectionRef} className="relative w-full lg:h-[215vh]">
        {/* STICKY FLOATING IPHONE LAYER (Glides from Right to Left on Desktop) */}
        <div className="hidden lg:block absolute inset-0 pointer-events-none z-30">
          <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
            <div
              className="will-change-transform"
              style={{
                transform: `translate3d(${phoneOffsetVw}vw, 0px, 0px)`,
              }}
            >
              {/* REALISTIC IPHONE CHASSIS (Matches Lulo Bank's Metallic Bezel) */}
              <div className="w-[305px] h-[618px] rounded-[50px] p-[11px] bg-gradient-to-b from-[#d6d3cd] via-[#8f8c86] to-[#c9c5be] shadow-[0_35px_80px_rgba(0,0,0,0.45)] relative">
                {/* Inner Black Glass Bezel */}
                <div className="w-full h-full rounded-[40px] bg-[#0b0e17] p-[6px] relative overflow-hidden ring-1 ring-black">
                  {/* iPhone Notch */}
                  <div className="absolute top-[6px] left-1/2 -translate-x-1/2 w-32 h-6 bg-[#0b0e17] rounded-b-2xl z-40 flex items-center justify-center gap-3">
                    <span className="w-10 h-1 rounded-full bg-slate-800" />
                    <span className="w-2 h-2 rounded-full bg-slate-800" />
                  </div>

                  {/* Top iOS Status Bar */}
                  <div className="absolute top-3 left-6 right-6 flex items-center justify-between text-[11px] font-semibold text-white z-30">
                    <span>9:41</span>
                    <div className="flex items-center gap-1.5">
                      <div className="flex items-end gap-0.5 h-2.5">
                        <span className="w-0.5 h-1 bg-white rounded-xs" />
                        <span className="w-0.5 h-1.5 bg-white rounded-xs" />
                        <span className="w-0.5 h-2 bg-white rounded-xs" />
                        <span className="w-0.5 h-2.5 bg-white rounded-xs" />
                      </div>
                      <div className="w-4 h-2.5 rounded-[3px] border border-white/80 p-[1px]">
                        <div className="w-full h-full bg-white rounded-[1px]" />
                      </div>
                    </div>
                  </div>

                  {/* HORIZONTAL SLIDING SCREEN VIEWPORT (200% width: Screen 1 & Screen 2) */}
                  <div className="w-full h-full rounded-[34px] bg-[#1a2030] overflow-hidden relative">
                    <div
                      className="w-[200%] h-full flex will-change-transform"
                      style={{
                        transform: `translate3d(${innerScreenSlidePct}%, 0, 0)`,
                      }}
                    >
                      {/* ---------------------------------------------------- */}
                      {/* PHONE SCREEN 1: CUENTA & LIQUIDEZ (Matches frame_0)  */}
                      {/* ---------------------------------------------------- */}
                      <div className="w-1/2 h-full pt-11 pb-4 px-4 flex flex-col justify-between text-white bg-[#1b2234]">
                        {/* Top Gear & Cuenta/Tarjeta Tabs */}
                        <div>
                          <div className="flex justify-end mb-1">
                            <Settings className="w-4 h-4 text-slate-300" />
                          </div>
                          <div className="flex items-center justify-center gap-6 text-xs font-bold">
                            <div className="text-[#e0f500] flex flex-col items-center">
                              <span>Cuenta</span>
                              <span className="w-4 h-0.5 bg-[#e0f500] rounded-full mt-1" />
                            </div>
                            <span className="text-slate-400">Tarjeta</span>
                          </div>

                          {/* Center Balance */}
                          <div className="text-center mt-5">
                            <span className="text-[10px] text-slate-400 block">
                              Saldo disponible
                            </span>
                            <div className="flex items-center justify-center gap-1.5 mt-0.5">
                              <span className="text-2xl font-extrabold tracking-tight text-white">
                                $150,000,000
                              </span>
                              <Eye className="w-3.5 h-3.5 text-slate-400" />
                            </div>
                            <span className="text-[10px] text-slate-400 block mt-0.5">
                              Total $152,450,000
                            </span>
                          </div>

                          {/* 4 Circular Action Buttons (Exact match to frame_0) */}
                          <div className="grid grid-cols-4 gap-2 mt-6 px-1">
                            {[
                              { icon: ArrowUp, label: "Recargar" },
                              { icon: Send, label: "Transferir" },
                              { icon: HandCoins, label: "Solicitar" },
                              { icon: ArrowDown, label: "Retirar" },
                            ].map((act, i) => (
                              <div
                                key={i}
                                className="flex flex-col items-center gap-1.5"
                              >
                                <div className="w-11 h-11 rounded-full bg-[#252e44] border border-white/10 flex items-center justify-center text-white shadow-sm">
                                  <act.icon className="w-4 h-4" />
                                </div>
                                <span className="text-[9px] text-slate-300 font-medium">
                                  {act.label}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Movimientos Feed */}
                        <div className="mt-4 flex-1 flex flex-col justify-end">
                          <span className="text-xs font-bold text-white mb-2">
                            Movimientos
                          </span>
                          {/* Filter Pills */}
                          <div className="flex items-center gap-1.5 mb-3 overflow-hidden">
                            <span className="px-2.5 py-1 rounded-full bg-[#3b4766] text-white text-[9px] font-bold">
                              Todos
                            </span>
                            <span className="px-2.5 py-1 rounded-full bg-[#242c40] text-slate-300 text-[9px] font-medium">
                              Ingresos
                            </span>
                            <span className="px-2.5 py-1 rounded-full bg-[#242c40] text-slate-300 text-[9px] font-medium">
                              Gastos
                            </span>
                            <span className="px-2.5 py-1 rounded-full bg-[#242c40] text-slate-300 text-[9px] font-medium">
                              Pendientes
                            </span>
                          </div>

                          <span className="text-[9px] text-slate-400 mb-2">
                            Hoy
                          </span>

                          {/* Transaction Rows */}
                          <div className="space-y-2.5 mb-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-400 to-emerald-400 flex items-center justify-center text-[#1b2132] font-black text-[10px]">
                                  NX
                                </div>
                                <div>
                                  <span className="text-[10px] font-bold text-white block leading-tight">
                                    Desembolso NEXT
                                  </span>
                                  <span className="text-[9px] text-slate-400 block">
                                    Cupo Empresarial • 4:30 p.m.
                                  </span>
                                </div>
                              </div>
                              <span className="text-[10px] font-bold text-[#e0f500]">
                                + $150,000,000
                              </span>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold text-[10px]">
                                  PR
                                </div>
                                <div>
                                  <span className="text-[10px] font-bold text-white block leading-tight">
                                    Pago Proveedores
                                  </span>
                                  <span className="text-[9px] text-slate-400 block">
                                    Transferencia • 6:45 p.m.
                                  </span>
                                </div>
                              </div>
                              <span className="text-[10px] font-bold text-white">
                                - $2,370,000
                              </span>
                            </div>
                          </div>

                          {/* Bottom App Tab Bar */}
                          <div className="pt-2 border-t border-white/10 flex items-center justify-between px-1 text-[8px] text-slate-400">
                            <div className="flex flex-col items-center gap-0.5 text-white">
                              <Home className="w-3.5 h-3.5" />
                              <span>Home</span>
                            </div>
                            <div className="flex flex-col items-center gap-0.5">
                              <CreditCard className="w-3.5 h-3.5" />
                              <span>Productos</span>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-[#e0f500] text-[#1b2132] flex items-center justify-center -mt-3 shadow-md">
                              <Plus className="w-4 h-4 stroke-[3]" />
                            </div>
                            <div className="flex flex-col items-center gap-0.5">
                              <GraduationCap className="w-3.5 h-3.5" />
                              <span>Seguros</span>
                            </div>
                            <div className="flex flex-col items-center gap-0.5">
                              <HelpCircle className="w-3.5 h-3.5" />
                              <span>Ayuda</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* ---------------------------------------------------- */}
                      {/* PHONE SCREEN 2: CALCULA TU CRÉDITO (Matches step_167)*/}
                      {/* ---------------------------------------------------- */}
                      <div className="w-1/2 h-full pt-11 pb-5 px-4 flex flex-col justify-between text-white bg-[#1b2132]">
                        {/* Header */}
                        <div className="flex items-center justify-between">
                          <ChevronLeft className="w-4 h-4 text-white" />
                          <span className="text-[11px] font-bold text-white">
                            Calcula tu crédito
                          </span>
                          <span className="w-4" />
                        </div>

                        {/* Credit Amount */}
                        <div className="text-center mt-2">
                          <span className="text-[10px] text-slate-400 block">
                            Valor del crédito
                          </span>
                          <span className="text-xl font-extrabold text-white block mt-0.5">
                            $150,000,000
                          </span>
                          <span className="text-[9px] font-bold text-[#e0f500] block mt-0.5">
                            Presiona para editar
                          </span>
                        </div>

                        {/* Monthly Approximation */}
                        <div className="text-center my-2">
                          <span className="text-[10px] text-slate-400 block">
                            Cuota mensual aproximada
                          </span>
                          <span className="text-xl font-extrabold text-white block mt-0.5">
                            ${monthlyInstallment.toLocaleString("es-CO")}
                          </span>
                          <span className="text-[10px] text-slate-400 block mt-0.5">
                            por {selectedMonths} meses
                          </span>
                        </div>

                        {/* Interactive-Looking Ruler Slider */}
                        <div className="my-2">
                          <p className="text-[9px] text-slate-300 text-center px-3 leading-snug">
                            Desliza para ajustar el plazo y la cuota mensual.
                          </p>
                          <span className="text-[11px] font-extrabold text-[#e0f500] block text-center mt-2">
                            {selectedMonths} meses
                          </span>

                          {/* Ruler Ticks */}
                          <div className="relative h-10 mt-1 flex items-center justify-between px-1">
                            {Array.from({ length: 25 }).map((_, idx) => (
                              <span
                                key={idx}
                                className={`w-[1.5px] rounded-full ${
                                  idx === 12
                                    ? "h-7 bg-[#e0f500]"
                                    : idx % 5 === 0
                                    ? "h-5 bg-slate-400"
                                    : "h-3 bg-slate-600"
                                }`}
                              />
                            ))}
                            {/* Slider Thumb Circle */}
                            <div
                              className="w-6 h-6 rounded-full bg-slate-300/80 backdrop-blur-xs absolute top-1/2 -translate-y-1/2 shadow-md transition-transform duration-150"
                              style={{
                                left: `${52 + calcSubT * 18}%`,
                              }}
                            />
                          </div>
                        </div>

                        {/* Bottom Action */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-[9px] text-slate-300 pt-2 border-t border-white/10">
                            <span>Tasa preferencial corporativa</span>
                            <span className="font-bold text-white">
                              IBR + 1.1% M.V.
                            </span>
                          </div>
                          <div className="w-full py-2.5 rounded-full bg-[#e0f500] text-[#1b2132] text-center text-xs font-extrabold shadow-md">
                            Continuar
                          </div>
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
        {/* ROW 1: CUENTA & FINANZAS (Left #f4f4f4 Text | Right #242c40 Navy)   */}
        {/* ================================================================== */}
        <div className="w-full lg:h-[107.5vh] grid grid-cols-1 lg:grid-cols-2">
          {/* Left Half: Light Grey with Bold Editorial Copy */}
          <div className="bg-[#f4f4f4] flex items-center justify-center px-6 sm:px-14 lg:px-20 xl:px-28 py-16 lg:py-0">
            <div className="max-w-lg">
              <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-[#1b2132] leading-[1.06] tracking-[-0.04em] mb-7">
                Una gestión financiera que te devuelve plata y tiempo
              </h2>

              <ul className="list-disc pl-5 space-y-4 text-[#1b2132] text-base sm:text-[17px] leading-[1.48] mb-9">
                <li>
                  Estructuramos tu liquidez con{" "}
                  <strong className="font-extrabold">
                    más de 35 bancos y aseguradoras aliadas
                  </strong>{" "}
                  con tasas preferenciales.
                </li>
                <li>
                  <strong className="font-extrabold">
                    $0 de cobros anticipados
                  </strong>
                  , $0 costos ocultos por estudio de viabilidad financiera y
                  acompañamiento directo.
                </li>
                <li>
                  Optimiza el flujo de caja de tu empresa con{" "}
                  <strong className="font-extrabold">
                    capital de trabajo, factoring y compra de cartera
                  </strong>
                  .
                </li>
              </ul>

              <div className="flex flex-wrap items-center gap-6">
                <button
                  onClick={() => onSelectVertical("credito")}
                  className="px-7 py-3.5 rounded-full bg-[#e0f500] hover:bg-[#d4e900] text-[#1b2132] font-extrabold text-sm sm:text-base flex items-center gap-3 transition-transform active:scale-95 cursor-pointer shadow-xs"
                >
                  <span>Solicitar estudio</span>
                  <ChevronRight className="w-4 h-4 stroke-[3]" />
                </button>

                <button
                  onClick={() => onSelectVertical("credito")}
                  className="text-[#1b2132] font-extrabold text-sm sm:text-base hover:opacity-70 transition-opacity cursor-pointer"
                >
                  Conoce nuestras líneas
                </button>
              </div>
            </div>
          </div>

          {/* Right Half: Deep Slate Navy Backdrop */}
          <div className="bg-[#242c40] min-h-[420px] lg:min-h-full flex items-center justify-center p-8 lg:p-0">
            {/* Mobile-only static preview of Phone 1 */}
            <div className="lg:hidden w-[270px] rounded-[38px] bg-[#1b2234] p-5 text-white shadow-2xl border-4 border-slate-400/40">
              <div className="text-center py-4">
                <span className="text-[10px] text-slate-400">
                  Saldo disponible
                </span>
                <div className="text-2xl font-extrabold text-white mt-1">
                  $150,000,000
                </div>
                <span className="text-[11px] text-[#e0f500] font-bold block mt-2">
                  + $150,000,000 Desembolso NEXT
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ================================================================== */}
        {/* ROW 2: CRÉDITO EMPRESARIAL (Left #fff384 Yellow | Right #f4f4f4)    */}
        {/* ================================================================== */}
        <div className="w-full lg:h-[107.5vh] grid grid-cols-1 lg:grid-cols-2">
          {/* Left Half: Warm Lulo Yellow Backdrop (Phone lands here on desktop) */}
          <div className="bg-[#fff384] min-h-[420px] lg:min-h-full flex items-center justify-center p-8 lg:p-0 order-2 lg:order-1">
            {/* Mobile-only static preview of Phone 2 */}
            <div className="lg:hidden w-[270px] rounded-[38px] bg-[#1b2132] p-5 text-white shadow-2xl border-4 border-slate-400/40 text-center">
              <span className="text-[10px] text-slate-400 block">
                Calcula tu crédito
              </span>
              <div className="text-xl font-extrabold text-white mt-1">
                $150,000,000
              </div>
              <div className="text-xs text-[#e0f500] font-bold my-2">
                36 meses • Cuota a tu medida
              </div>
              <div className="mt-3 py-2 rounded-full bg-[#e0f500] text-[#1b2132] text-xs font-extrabold">
                Continuar
              </div>
            </div>
          </div>

          {/* Right Half: Light Grey with Bold Credit Copy */}
          <div className="bg-[#f4f4f4] flex items-center justify-center px-6 sm:px-14 lg:px-20 xl:px-28 py-16 lg:py-0 order-1 lg:order-2">
            <div className="max-w-lg">
              <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-[#1b2132] leading-[1.06] tracking-[-0.04em] mb-7">
                Un crédito NEXT que te devuelve tiempo
              </h2>

              <ul className="list-disc pl-5 space-y-3.5 text-[#1b2132] text-base sm:text-[17px] leading-[1.48] mb-9">
                <li>Inicia tu solicitud digital en menos de 2 minutos.</li>
                <li>
                  Recibe tu desembolso directo en la{" "}
                  <strong className="font-extrabold">
                    cuenta bancaria de tu empresa
                  </strong>{" "}
                  o cuenta personal.
                </li>
                <li>
                  <strong className="font-extrabold">
                    Sin filas, sin trámites notariales, sin cobros por
                    adelantado.
                  </strong>
                </li>
                <li>
                  Escoge la fecha de pago, el monto de tu cupo y el plazo ideal.
                </li>
                <li>
                  Conoce el progreso en tiempo real y tu plan de pagos desde el
                  portal.
                </li>
              </ul>

              <div className="flex flex-wrap items-center gap-6">
                <button
                  onClick={() => onSelectVertical("credito")}
                  className="px-7 py-3.5 rounded-full bg-[#e0f500] hover:bg-[#d4e900] text-[#1b2132] font-extrabold text-sm sm:text-base flex items-center gap-3 transition-transform active:scale-95 cursor-pointer shadow-xs"
                >
                  <span>Pide tu crédito</span>
                  <ChevronRight className="w-4 h-4 stroke-[3]" />
                </button>

                <button
                  onClick={() => onSelectVertical("credito")}
                  className="text-[#1b2132] font-extrabold text-sm sm:text-base hover:opacity-70 transition-opacity cursor-pointer"
                >
                  Conoce el crédito NEXT
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* SECTION B: 260VH STICKY 3D ISOMETRIC CARDS FAN-OUT (#dfe2e7)         */}
      {/* (Replicates frame_1.png flat card -> frame_2.png 4 fanned 3D cards)  */}
      {/* ==================================================================== */}
      <section
        ref={cardsSectionRef}
        className="relative w-full h-[250vh] bg-[#dfe2e7]"
      >
        <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center">
          <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-14 lg:px-24 grid grid-cols-1 lg:grid-cols-12 items-center gap-8">
            {/* LEFT PINNED COLUMN: Copy & CTAs */}
            <div className="lg:col-span-5 z-30">
              <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-[#1b2132] leading-[1.05] tracking-[-0.04em] mb-7">
                Una tarjeta corporativa que te da liquidez por comprar
              </h2>

              <ul className="list-disc pl-5 space-y-3.5 text-[#1b2132] text-sm sm:text-[17px] leading-[1.45] mb-9">
                <li>
                  Obtén{" "}
                  <strong className="font-extrabold">
                    tasas preferenciales y retorno en flujo de caja
                  </strong>{" "}
                  para compras operativas e inventario.
                </li>
                <li>
                  Dale la personalidad de tu empresa,{" "}
                  <strong className="font-extrabold">
                    ponle el nombre y escoge el color
                  </strong>{" "}
                  de cada línea ejecutiva.
                </li>
                <li>
                  Compra por internet, paga proveedores o utiliza datáfonos
                  físicos en Colombia y el mundo.
                </li>
                <li>
                  Haz pagos de nómina, impuestos y compras empresariales por
                  PSE.
                </li>
                <li>
                  Activa, congela y gestiona tus cupos al instante desde la app.
                </li>
              </ul>

              <div className="flex flex-wrap items-center gap-6">
                <button
                  onClick={() => onSelectVertical("credito")}
                  className="px-7 py-3.5 rounded-full bg-[#e0f500] hover:bg-[#d4e900] text-[#1b2132] font-extrabold text-sm sm:text-base flex items-center gap-3 transition-transform active:scale-95 cursor-pointer shadow-xs"
                >
                  <span>Solicitar NEXT</span>
                  <ChevronRight className="w-4 h-4 stroke-[3]" />
                </button>

                <button
                  onClick={() => onSelectVertical("credito")}
                  className="text-[#1b2132] font-extrabold text-sm sm:text-base hover:opacity-70 transition-opacity cursor-pointer"
                >
                  Pide tu tarjeta corporativa
                </button>
              </div>
            </div>

            {/* RIGHT COLUMN: 4 CARDS IN 3D ISOMETRIC STACK (frame_1 -> frame_2) */}
            <div className="lg:col-span-7 relative h-[420px] sm:h-[620px] flex items-center justify-center">
              <div
                className="relative w-[320px] sm:w-[540px] h-[205px] sm:h-[340px]"
                style={{ perspective: "1200px" }}
              >
                {/* CARD 4 (BOTTOM): MATTE BLACK */}
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
                  <LuloMinimalCard
                    bg="#111318"
                    textColor="#FFFFFF"
                    subTextColor="#94A3B8"
                    logoColor="#E0F500"
                    holderName="Andrés"
                    chipVariant="silver"
                  />
                </div>

                {/* CARD 3 (LOWER-MID): NEON LIME (#E0F500) */}
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
                  <LuloMinimalCard
                    bg="#E0F500"
                    textColor="#1B2132"
                    subTextColor="#475569"
                    logoColor="#1B2132"
                    holderName="Sebas"
                    chipVariant="silver"
                  />
                </div>

                {/* CARD 2 (UPPER-MID): DEEP NAVY (#1B2132) */}
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
                  <LuloMinimalCard
                    bg="#1B2132"
                    textColor="#FFFFFF"
                    subTextColor="#94A3B8"
                    logoColor="#E0F500"
                    holderName="Caro"
                    chipVariant="silver"
                  />
                </div>

                {/* CARD 1 (TOP): PURE WHITE (#FFFFFF) - Visible from the very start (frame_1) */}
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
                  <LuloMinimalCard
                    bg="#FFFFFF"
                    textColor="#1B2132"
                    subTextColor="#94A3B8"
                    logoColor="#1B2132"
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
      {/* (Replicates frame_3.png / step_179_shot_1_settled_4_lulox.png)       */}
      {/* ==================================================================== */}
      <section
        ref={ecosystemSectionRef}
        className="relative w-full py-24 sm:py-32 px-6 overflow-hidden text-center text-white"
        style={{
          background:
            "radial-gradient(52.34% 38.5% at 50% 61.5%, #202739 0%, #141925 100%)",
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
          <p className="text-base sm:text-lg text-slate-200 max-w-xl mx-auto leading-relaxed">
            Estamos dentro de la plataforma NEXT junto a nuestras líneas de
            Finanzas, Seguros e Inversiones y queremos ayudarte a construir un
            futuro financiero mejor.
          </p>
        </div>

        {/* Centerpiece: Two Tilted iPhones + Dashed Elliptical Orbit + Floating Badges */}
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
              stroke="rgba(255,255,255,0.45)"
              strokeWidth="2"
              strokeDasharray="9 9"
              className="anim-lulo-orbit"
            />
          </svg>

          {/* Left Orbiting "+" Badge */}
          <div
            className={`absolute left-[8%] sm:left-[14%] bottom-[24%] z-30 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#fef9c3] text-[#1b2132] flex items-center justify-center shadow-xl transition-all duration-1000 delay-300 ${
              ecoActive ? "opacity-100 scale-100" : "opacity-0 scale-50"
            }`}
          >
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </div>

          {/* Right Orbiting "⚡" Badge */}
          <div
            className={`absolute right-[8%] sm:right-[14%] top-[30%] z-30 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#e9d5ff] text-[#1b2132] flex items-center justify-center shadow-xl transition-all duration-1000 delay-500 ${
              ecoActive ? "opacity-100 scale-100" : "opacity-0 scale-50"
            }`}
          >
            <Zap className="w-5 h-5 fill-[#1b2132]" />
          </div>

          {/* LEFT TILTED PHONE (NEXT Cuenta & Crédito) */}
          <div
            className="w-[210px] sm:w-[250px] h-[410px] sm:h-[470px] rounded-[38px] p-2 bg-gradient-to-b from-slate-400 via-slate-600 to-slate-800 shadow-2xl z-20 transition-all duration-1000 ease-out -mr-6 sm:-mr-10"
            style={{
              transform: ecoActive
                ? "translate3d(-12px, 18px, 0) rotate(-11deg)"
                : "translate3d(-40px, 60px, 0) rotate(-16deg)",
              opacity: ecoActive ? 1 : 0,
            }}
          >
            <div className="w-full h-full rounded-[31px] bg-[#171c2b] p-3.5 text-left text-white flex flex-col justify-between overflow-hidden relative">
              <div className="flex items-center justify-between text-[9px] text-slate-300">
                <span>9:41</span>
                <Bell className="w-3 h-3" />
              </div>

              <div className="mt-1">
                <div className="w-6 h-6 rounded-full bg-rose-400/30 text-rose-200 flex items-center justify-center text-[9px] font-bold mb-1">
                  C
                </div>
                <span className="text-[9px] text-slate-400 block">
                  Buenos días
                </span>
                <span className="text-xs font-extrabold text-white">
                  Camilo
                </span>
              </div>

              {/* White Account Card inside Left Phone */}
              <div className="p-3 rounded-2xl bg-[#f1f5f9] text-[#1b2132] my-1.5 shadow-md">
                <span className="text-[9px] font-bold text-slate-500 block">
                  NEXT Cuenta
                </span>
                <span className="text-[8px] text-slate-400 block mt-2">
                  Saldo disponible
                </span>
                <span className="text-sm font-black text-[#1b2132] block">
                  $152,460,584
                </span>
                <span className="text-[7px] text-slate-400 block mt-1">
                  Saldo total $152,460,584
                </span>
              </div>

              {/* Promo Banner inside Left Phone */}
              <div className="p-2.5 rounded-xl bg-[#232b42] border border-white/10">
                <span className="px-1.5 py-0.5 rounded-full bg-white text-[#1b2132] text-[7px] font-extrabold">
                  Nuevo
                </span>
                <span className="text-[9px] font-bold text-white block mt-1">
                  Invierte aquí con NEXT X
                </span>
                <span className="text-[7px] text-slate-300 block">
                  Rentabiliza los excedentes de tu empresa hoy.
                </span>
              </div>

              <div className="pt-1.5 border-t border-white/10 flex items-center justify-between text-[8px] text-slate-400">
                <span>Home</span>
                <span>Productos</span>
                <span className="w-5 h-5 rounded-full bg-[#e0f500] text-[#1b2132] flex items-center justify-center font-black">
                  +
                </span>
                <span>Seguros</span>
              </div>
            </div>
          </div>

          {/* RIGHT TILTED PHONE (NEXT X Inversiones & Seguros) */}
          <div
            className="w-[210px] sm:w-[250px] h-[410px] sm:h-[470px] rounded-[38px] p-2 bg-gradient-to-b from-sky-300/60 via-slate-600 to-slate-900 shadow-2xl z-25 transition-all duration-1000 ease-out"
            style={{
              transform: ecoActive
                ? "translate3d(12px, -18px, 0) rotate(11deg)"
                : "translate3d(40px, -60px, 0) rotate(16deg)",
              opacity: ecoActive ? 1 : 0,
            }}
          >
            <div className="w-full h-full rounded-[31px] bg-gradient-to-b from-[#23194f] via-[#1c163c] to-[#141229] p-3.5 text-left text-white flex flex-col justify-between overflow-hidden relative">
              <div className="flex items-center justify-between text-[9px] text-slate-300">
                <span className="font-black text-xs text-white">nextˣ</span>
                <span className="w-5 h-5 rounded-full bg-purple-300 text-[#1b2132] font-bold text-[8px] flex items-center justify-center">
                  CF
                </span>
              </div>

              <div>
                <span className="text-[11px] font-extrabold text-white block">
                  Es un buen día, Camilo
                </span>
                <span className="text-[8px] text-purple-200 block leading-snug">
                  Y puede ser mejor si inviertes y blindas tu patrimonio hoy.
                </span>
              </div>

              {/* Portfolio Balance */}
              <div className="my-1">
                <span className="text-[8px] text-purple-300 block">
                  Tu inversión en portafolio ≈
                </span>
                <span className="text-base font-black text-white block mt-0.5">
                  $ 85.500,77
                </span>
                <div className="flex items-center gap-2 mt-2">
                  <span className="px-2.5 py-1 rounded-full bg-white/10 text-white text-[8px] font-bold">
                    Cambia a COP
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[#e0f500] text-[#1b2132] text-[8px] font-extrabold">
                    Invertir
                  </span>
                </div>
              </div>

              {/* Rate Highlight Card */}
              <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/15 flex items-center justify-between gap-2">
                <span className="text-[8px] text-purple-100 leading-tight">
                  ¡Aprovecha! Invierte con una tasa preferencial hasta 17.8%
                  E.A.
                </span>
                <span className="w-6 h-6 rounded-full bg-emerald-400/30 text-emerald-200 flex items-center justify-center text-[10px] shrink-0">
                  ✓
                </span>
              </div>

              <div className="pt-1.5 border-t border-white/10 flex items-center justify-between text-[8px] text-purple-200">
                <span>Inicio</span>
                <span>Portafolio</span>
                <span>Pólizas</span>
                <span>NEXT Bank</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Description & CTA */}
        <div className="max-w-xl mx-auto space-y-6 mt-4">
          <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
            Aprende cómo puedes transformar las finanzas de tu empresa o
            patrimonio con crédito estructurado, seguros todo riesgo e
            inversiones fiduciarias, sin complicaciones.
          </p>

          <div className="flex justify-center">
            <button
              onClick={() => onSelectVertical("inversiones")}
              className="px-8 py-3.5 rounded-full bg-[#e0f500] hover:bg-[#d4e900] text-[#1b2132] font-extrabold text-sm sm:text-base flex items-center gap-3 transition-transform active:scale-95 cursor-pointer shadow-lg"
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
