"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  CreditCard,
  Zap,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Clock,
  Building2,
  Bell,
  Smartphone,
  Check,
  Lock,
  ChevronRight,
  Sparkles,
  Wifi,
} from "lucide-react";
import { VerticalKey } from "@/src/types/common";

interface DisbursementScrollJourneyProps {
  onSelectVertical: (vertical: VerticalKey | any) => void;
}

export default function DisbursementScrollJourney({
  onSelectVertical,
}: DisbursementScrollJourneyProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [activePhase, setActivePhase] = useState<number>(0);

  const phases = [
    {
      id: "aprobacion",
      num: "01",
      badge: "Estructuración & Aprobación Multibanca",
      title: "Evaluamos tu empresa y aprobamos tu cupo ideal",
      desc: "Analizamos tu perfil con más de 35 bancos y cooperativas para conseguirte la mayor capacidad de endeudamiento con la tasa de interés más baja del mercado.",
      bullets: [
        "Estudio ágil con balance general y extractos recientes",
        "Cupos estructurados a la medida desde $20M hasta $5.000M+",
        "Asignación de tu tarjeta de cupo corporativo NEXT Platinum",
        "0% cobros por adelantado ni comisiones ocultas",
      ],
      metricLabel: "Cupo Pre-Aprobado",
      metricValue: "$150.000.000 COP",
      metricTag: "Tasa preferencial IBR",
    },
    {
      id: "datafono",
      num: "02",
      badge: "Activación en Datáfono & Contactless",
      title: "Transacción formal y validación instantánea",
      desc: "Sin trámites notariales engorrosos ni filas en sucursales. La tarjeta se valida formalmente en nuestro ecosistema POS para autorizar el desembolso seguro.",
      bullets: [
        "Contacto directo mediante tecnología NFC contactless de alta seguridad",
        "Validación en tiempo real con la red interbancaria nacional",
        "Autorización inmediata y generación de comprobante digital",
        "Operación 100% formal, vigilada y respaldada institucionalmente",
      ],
      metricLabel: "Estado de Transacción",
      metricValue: "APROBADO ✓",
      metricTag: "Aut. POS #849204",
    },
    {
      id: "cuenta",
      num: "03",
      badge: "Acreditación Directa a tu Banco",
      title: "El dinero sube en vivo directo a tu cuenta bancaria",
      desc: "El monto solicitado se transfiere de inmediato a tu cuenta corriente o de ahorros, quedando 100% disponible para pagar nóminas, compras o inversión.",
      bullets: [
        "Acreditación express en tiempo récord a cualquier banco del país",
        "Fondos disponibles inmediatamente sin retenciones ni bloqueos",
        "Notificación push y soporte VIP con tu asesor patrimonial",
        "Reporte mensual de amortización y beneficios tributarios",
      ],
      metricLabel: "Fondos Acreditados",
      metricValue: "$150.000.000 COP",
      metricTag: "Disponibilidad Inmediata",
    },
  ];

  // Track scroll position through the tall track
  useEffect(() => {
    let frameId: number;

    const onScroll = () => {
      frameId = requestAnimationFrame(() => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const totalHeight = containerRef.current.offsetHeight;
        const windowHeight = window.innerHeight;
        const scrollable = totalHeight - windowHeight;

        if (scrollable <= 0) return;

        const scrolled = -rect.top;
        const progress = Math.max(0, Math.min(1, scrolled / scrollable));
        setScrollProgress(progress);

        // Determine phase: 0 (0-0.33), 1 (0.33-0.66), 2 (0.66-1.0)
        if (progress < 0.35) {
          setActivePhase(0);
        } else if (progress < 0.68) {
          setActivePhase(1);
        } else {
          setActivePhase(2);
        }
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frameId);
    };
  }, []);

  const currentPhase = phases[activePhase];

  // Dynamic live money counter for Phase 3
  const initialBalance = 2450000;
  const targetDisbursement = 150000000;
  // Progress inside Phase 3 (from 0.68 to 0.95)
  const phase3Progress = Math.max(0, Math.min(1, (scrollProgress - 0.68) / 0.25));
  const liveBalance = Math.round(initialBalance + targetDisbursement * phase3Progress);

  const formatCOP = (val: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const jumpToPhase = (index: number) => {
    if (!containerRef.current) return;
    const totalHeight = containerRef.current.offsetHeight;
    const windowHeight = window.innerHeight;
    const scrollable = totalHeight - windowHeight;
    const targetY =
      containerRef.current.offsetTop +
      (index / (phases.length - 1)) * scrollable * 0.9;

    window.scrollTo({
      top: targetY,
      behavior: "smooth",
    });
  };

  return (
    <div
      ref={containerRef}
      className="relative my-10 -mx-4 sm:-mx-6"
      style={{ height: "260vh" }}
    >
      {/* Dynamic Keyframes for micro-animations */}
      <style>{`
        @keyframes tapPulse {
          0% { transform: scale(0.85); opacity: 0.9; }
          50% { transform: scale(1.35); opacity: 0.35; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        .anim-tap-pulse {
          animation: tapPulse 1.8s ease-out infinite;
        }
        @keyframes floatCardGentle {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(-1deg); }
        }
        .anim-card-float {
          animation: floatCardGentle 4s ease-in-out infinite;
        }
      `}</style>

      {/* STICKY FULL-VIEWPORT WRAPPER */}
      <div className="sticky top-16 h-[88vh] w-full bg-[#f1f4f8] border-y border-slate-200/90 flex flex-col justify-between py-6 px-6 sm:px-12 overflow-hidden shadow-inner">
        {/* Soft Background Ambient Lighting */}
        <div
          className={`absolute top-0 right-0 w-[550px] h-[550px] rounded-full blur-3xl pointer-events-none transition-all duration-700 opacity-40 ${
            activePhase === 0
              ? "bg-sky-400"
              : activePhase === 1
              ? "bg-emerald-400"
              : "bg-blue-500"
          }`}
        />

        {/* TOP STATUS BAR & JUMP BUTTONS */}
        <div className="w-full max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3 relative z-20 pb-3 border-b border-slate-300/70">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-ping" />
            <span className="text-xs font-black uppercase tracking-wider text-slate-900">
              El Viaje de tu Financiación en NEXT
            </span>
            <span className="text-[11px] text-slate-500 font-semibold hidden md:inline">
              • Baja con el scroll para ver la tarjeta, el datáfono y tu desembolso
            </span>
          </div>

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
                <span>{p.num}.</span>
                <span className="hidden sm:inline ml-1">
                  {p.id === "aprobacion"
                    ? "La Tarjeta"
                    : p.id === "datafono"
                    ? "El Datáfono"
                    : "Tu Cuenta"}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* MAIN STICKY 2-COLUMN STAGE */}
        <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center my-auto relative z-10 py-2">
          
          {/* ================= LEFT COLUMN: The Financial Story Step-by-Step ================= */}
          <div className="lg:col-span-6 space-y-4 text-left transition-all duration-500">
            {/* Phase Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-2xs text-[11px] font-bold text-sky-700">
              <Sparkles className="w-3.5 h-3.5 text-sky-500" />
              <span>{currentPhase.badge}</span>
            </div>

            <div className="text-[11px] font-black uppercase tracking-widest text-slate-400">
              Paso {currentPhase.num} de 03
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              {currentPhase.title}
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
              {currentPhase.desc}
            </p>

            {/* Live Metric Banner */}
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  {currentPhase.metricLabel}
                </div>
                <div className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  {activePhase === 2 ? formatCOP(liveBalance) : currentPhase.metricValue}
                </div>
              </div>
              <div className="text-right">
                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">
                  {currentPhase.metricTag}
                </span>
              </div>
            </div>

            {/* Bullets List */}
            <ul className="space-y-2 pt-1 text-xs sm:text-sm text-slate-700 font-medium">
              {currentPhase.bullets.map((bullet, bIdx) => (
                <li key={bIdx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>

            {/* Action Button */}
            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={() => onSelectVertical("credito")}
                className="h-11 px-6 rounded-full bg-slate-900 hover:bg-sky-600 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md shadow-slate-900/15 transition-transform active:scale-95 cursor-pointer"
              >
                <Zap className="w-4 h-4 text-sky-400 fill-sky-400" />
                <span>Solicitar Este Desembolso</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
                Aprobación express 24h
              </span>
            </div>
          </div>

          {/* ================= RIGHT COLUMN: Interactive Card ➔ Datáfono ➔ Bank Screen Animation ================= */}
          <div className="lg:col-span-6 flex items-center justify-center relative min-h-[380px] sm:min-h-[460px]">
            
            {/* ================= ACT 1: LA TARJETA EN 3D FLOTANDO ================= */}
            {activePhase === 0 && (
              <div className="relative flex flex-col items-center justify-center transition-all duration-700 animate-fadeIn">
                {/* Floating Approved Quota Pill Badge */}
                <div className="mb-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200/90 shadow-lg text-xs font-black text-slate-900">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  <span>Cupo Aprobado: $150.000.000 COP</span>
                </div>

                {/* 3D Credit Card */}
                <div
                  className="w-[290px] sm:w-[350px] h-[180px] sm:h-[220px] rounded-[24px] p-6 bg-gradient-to-br from-white via-slate-100 to-slate-200 text-slate-900 border border-white/80 shadow-2xl flex flex-col justify-between anim-card-float select-none cursor-pointer"
                  style={{
                    transform: "rotateX(26deg) rotateZ(-16deg) rotateY(12deg)",
                    transformStyle: "preserve-3d",
                    filter: "drop-shadow(0 25px 35px rgba(15, 23, 42, 0.35))",
                  }}
                >
                  <div className="flex items-center justify-between">
                    {/* Gold EMV Chip */}
                    <div className="w-11 h-8 rounded-md bg-gradient-to-br from-amber-200 via-amber-300 to-amber-500 border border-amber-400/60 shadow-inner relative overflow-hidden">
                      <div className="w-full h-[1px] bg-amber-700/40 absolute top-2.5" />
                      <div className="h-full w-[1px] bg-amber-700/40 absolute left-3.5" />
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-black tracking-widest text-slate-900">
                        NEXT
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold">
                        platinum ))
                      </span>
                    </div>
                  </div>

                  <div className="my-auto">
                    <div className="text-xs sm:text-sm font-black text-slate-900 tracking-tight">
                      NEXT Platinum Corporate
                    </div>
                    <div className="text-[10px] font-bold text-sky-600 mt-0.5">
                      Línea de Liquidez Preferencial
                    </div>
                  </div>

                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-[9px] uppercase font-bold text-slate-400">
                        Titular
                      </div>
                      <div className="text-xs font-bold text-slate-900">
                        Tu Empresa S.A.S.
                      </div>
                    </div>
                    <div className="flex -space-x-2">
                      <div className="w-6 h-6 rounded-full bg-red-500/90" />
                      <div className="w-6 h-6 rounded-full bg-amber-400/90" />
                    </div>
                  </div>
                </div>

                <div className="mt-5 text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" />
                  <span>Haz scroll hacia abajo para activar el desembolso en datáfono</span>
                </div>
              </div>
            )}

            {/* ================= ACT 2: EL DATÁFONO TÁCTIL Y EL CONTACTLESS TAP ================= */}
            {activePhase === 1 && (
              <div className="relative flex flex-col items-center justify-center transition-all duration-700 animate-fadeIn">
                {/* The Datáfono POS Terminal Frame */}
                <div className="relative w-[280px] sm:w-[320px] rounded-[36px] bg-slate-900 p-4 shadow-2xl border-4 border-slate-800 text-white select-none">
                  {/* Datáfono Screen */}
                  <div className="rounded-[24px] bg-slate-950 p-4 border border-white/10 text-center space-y-3 relative overflow-hidden">
                    {/* Glowing Radar Pulse from Contactless Reader */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full bg-cyan-400/20 anim-tap-pulse pointer-events-none" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-44 h-44 rounded-full bg-emerald-400/10 anim-tap-pulse pointer-events-none" />

                    <div className="flex items-center justify-between text-[10px] text-slate-400 border-b border-white/10 pb-1.5">
                      <div className="flex items-center gap-1">
                        <Wifi className="w-3.5 h-3.5 text-cyan-400" />
                        <span>NEXT Terminal POS</span>
                      </div>
                      <span className="text-emerald-400 font-bold">Conectado</span>
                    </div>

                    <div className="space-y-1 py-1 relative z-10">
                      <div className="text-[10px] uppercase font-bold text-slate-400">
                        Monto a Desembolsar
                      </div>
                      <div className="text-2xl font-black text-white tracking-tight">
                        $150.000.000
                      </div>
                      <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-black">
                        <Check className="w-3 h-3" />
                        <span>TRANSACCIÓN APROBADA</span>
                      </div>
                    </div>

                    <div className="text-[10px] text-slate-400 pt-1 border-t border-white/5">
                      Acreditando fondos en cuenta bancaria...
                    </div>
                  </div>

                  {/* Datáfono Keypad Indicator */}
                  <div className="mt-3 pt-2 grid grid-cols-3 gap-1.5 px-3 opacity-60">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, "*", 0, "#"].map((k) => (
                      <div
                        key={k}
                        className="h-6 rounded-md bg-white/5 flex items-center justify-center text-[10px] font-bold text-slate-400"
                      >
                        {k}
                      </div>
                    ))}
                  </div>

                  {/* Datáfono Card Slot */}
                  <div className="mt-3 w-28 h-1.5 bg-black rounded-full mx-auto" />
                </div>

                {/* THE CARD TAPPING ON THE DATÁFONO (Contactless Tap Effect) */}
                <div
                  className="absolute -top-6 -right-4 sm:-right-8 w-[200px] sm:w-[230px] h-[125px] sm:h-[145px] rounded-[18px] p-3.5 bg-gradient-to-br from-white via-slate-100 to-slate-200 text-slate-900 border border-white/90 shadow-2xl flex flex-col justify-between z-30 transition-transform duration-500"
                  style={{
                    transform: "rotateX(20deg) rotateZ(18deg) rotateY(-10deg) translate3d(0, 10px, 40px)",
                    filter: "drop-shadow(0 20px 25px rgba(2, 132, 199, 0.45))",
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="w-7 h-5 rounded-xs bg-amber-300 border border-amber-400" />
                    <span className="text-[9px] font-black uppercase text-slate-800">
                      NEXT 360°
                    </span>
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-slate-900">
                      NEXT Platinum Corporate
                    </div>
                    <div className="text-[8px] font-semibold text-sky-600">
                      TAP Contactless
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[8px] font-bold text-slate-500">
                    <span>Empresa S.A.S.</span>
                    <div className="flex -space-x-1.5">
                      <div className="w-3.5 h-3.5 rounded-full bg-red-500/90" />
                      <div className="w-3.5 h-3.5 rounded-full bg-amber-400/90" />
                    </div>
                  </div>
                </div>

                <div className="mt-4 text-[11px] font-bold text-emerald-600 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span>¡Validado! Sigue bajando el scroll para ver los fondos en tu cuenta</span>
                </div>
              </div>
            )}

            {/* ================= ACT 3: LA PANTALLA DEL BANCO Y EL SALDO SUBIENDO EN VIVO ================= */}
            {activePhase === 2 && (
              <div className="relative flex flex-col items-center justify-center transition-all duration-700 animate-fadeIn w-full max-w-[340px]">
                {/* Mobile Banking App Frame */}
                <div className="w-full rounded-[38px] bg-slate-900 p-3.5 shadow-2xl border-4 border-slate-800 text-white select-none">
                  {/* Dynamic Island */}
                  <div className="w-20 h-4 bg-black rounded-full mx-auto mb-2 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  </div>

                  {/* App Screen Content */}
                  <div className="rounded-[28px] bg-slate-950 p-4 border border-white/10 space-y-4">
                    {/* Header with bank logo */}
                    <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                      <div>
                        <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                          Cuenta Corriente Empresarial
                        </div>
                        <div className="text-xs font-bold text-white">
                          •••• 8392 • Tu Empresa
                        </div>
                      </div>
                      <span className="text-[9px] font-black text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-500/25">
                        Fondos Activos
                      </span>
                    </div>

                    {/* LIVE ROLLING BALANCE DISPLAY (Numbers climb up with scroll!) */}
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/80 via-slate-900 to-sky-950/80 border border-emerald-400/40 text-center space-y-1 relative overflow-hidden shadow-lg">
                      <div className="text-[10px] uppercase font-bold text-emerald-300 tracking-wider">
                        Saldo Total Disponible
                      </div>
                      
                      {/* The Climbing Number */}
                      <div className="text-2xl sm:text-3xl font-black text-white tracking-tight drop-shadow-sm font-mono">
                        {formatCOP(liveBalance)}
                      </div>

                      <div className="text-[10px] text-emerald-400 font-bold flex items-center justify-center gap-1 pt-1">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span>+$150.000.000 COP ingresados hoy</span>
                      </div>
                    </div>

                    {/* Transaction Push Notification */}
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-bold text-white flex items-center gap-1.5">
                          <Bell className="w-3 h-3 text-amber-400" />
                          Transferencia Acreditada
                        </span>
                        <span className="text-slate-400 text-[9px]">Ahora</span>
                      </div>
                      <p className="text-[10px] text-slate-300">
                        Has recibido <strong className="text-emerald-400 font-bold">$150.000.000 COP</strong> de NEXT Connection Group.
                      </p>
                    </div>

                    {/* Ready to use button */}
                    <button
                      onClick={() => onSelectVertical("credito")}
                      className="w-full py-2.5 rounded-xl bg-white text-slate-950 font-black text-xs hover:bg-sky-50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <Zap className="w-3.5 h-3.5 text-sky-600 fill-sky-600" />
                      <span>Comenzar Mi Solicitud Ahora</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="mt-3 text-[11px] font-bold text-emerald-600 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>¡Desembolso completado con éxito!</span>
                </div>
              </div>
            )}

          </div>

        </div>

        {/* BOTTOM PROGRESS METER */}
        <div className="w-full max-w-6xl mx-auto pt-3 border-t border-slate-300/70 flex items-center justify-between text-xs text-slate-600 relative z-20">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900">Progreso del Desembolso:</span>
            <div className="w-28 sm:w-44 bg-slate-300 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-sky-500 h-full rounded-full transition-all duration-150"
                style={{ width: `${Math.round(scrollProgress * 100)}%` }}
              />
            </div>
            <span className="font-black text-sky-600 text-[11px]">
              {Math.round(scrollProgress * 100)}%
            </span>
          </div>

          <div className="text-[11px] text-slate-500 font-semibold hidden sm:inline">
            Desliza hacia arriba o hacia abajo para interactuar con la animación
          </div>
        </div>
      </div>
    </div>
  );
}
