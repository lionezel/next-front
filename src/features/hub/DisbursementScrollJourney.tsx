"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard,
  Zap,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Building2,
  Smartphone,
  ChevronRight,
  Sparkles,
  Wifi,
  BarChart3,
  Award,
  Layers,
  ArrowUpRight,
  DollarSign,
  Wallet,
} from "lucide-react";
import { VerticalKey } from "@/src/types/common";

interface DisbursementScrollJourneyProps {
  onSelectVertical: (vertical: VerticalKey | any) => void;
}

export default function DisbursementScrollJourney({
  onSelectVertical,
}: DisbursementScrollJourneyProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [isManualOverride, setIsManualOverride] = useState<boolean>(false);

  const steps = [
    {
      id: "tarjeta",
      num: "01",
      navLabel: "Tarjeta en Mano",
      badge: "Estructuración & Aprobación Multibanca",
      title: "Tu tarjeta corporativa NEXT con cupo aprobado en mano",
      desc: "Conectamos tu empresa con más de 35 entidades financieras para otorgarte la máxima capacidad de liquidez sin cobros anticipados ni comisiones ocultas.",
      bullets: [
        "Estudio ágil con estados financieros y extractos recientes",
        "Cupos estructurados a la medida desde $20M hasta $5.000M+",
        "Tarjeta ejecutiva NEXT Titanium con tecnología Contactless",
        "Acompañamiento personalizado 100% digital",
      ],
      ctaText: "Solicitar Cupo Empresarial",
      vertical: "credito" as VerticalKey,
    },
    {
      id: "datafono",
      num: "02",
      navLabel: "Pago en Datáfono",
      badge: "Activación en Datáfono & Contactless",
      title: "Transacción rápida, segura y sin filas bancarias",
      desc: "Acercas la tarjeta a nuestra terminal de verificación POS. En segundos, la red interbancaria nacional valida la operación con cifrado de alta seguridad.",
      bullets: [
        "Lectura instantánea mediante NFC Contactless de alta precisión",
        "Validación en tiempo real con la red de pagos bancarios",
        "Cero trámites notariales ni filas en sucursales físicas",
        "Comprobante digital y autorización inmediata",
      ],
      ctaText: "Conocer Proceso de Validación",
      vertical: "credito" as VerticalKey,
    },
    {
      id: "desembolso",
      num: "03",
      navLabel: "Desembolso a Cuenta",
      badge: "Acreditación Bancaria Inmediata",
      title: "El dinero se acredita en directo a tu cuenta de banco",
      desc: "El monto aprobado se desembolsa directamente a la cuenta corriente o de ahorros de tu empresa para disponer de liquidez inmediata el mismo día.",
      bullets: [
        "Desembolso sin intermediarios ni retenciones ocultas",
        "Disponibilidad de fondos en cualquier banco de Colombia",
        "Notificación push en tiempo real de abono exitoso",
        "Capital listo para pago de nómina, proveedores o inversión",
      ],
      ctaText: "Ver Opciones de Desembolso",
      vertical: "credito" as VerticalKey,
    },
    {
      id: "crecimiento",
      num: "04",
      navLabel: "Empresa Creciendo",
      badge: "Escalabilidad & Expansión Empresarial",
      title: "Tu negocio multiplica su capacidad operativa y escala",
      desc: "Con capital de trabajo asegurado, tu empresa negocia mejores condiciones de compra, atiende proyectos más grandes y alcanza nuevos techos de rentabilidad.",
      bullets: [
        "Compra de inventario y maquinaria a precios de contado",
        "Blindaje del flujo de caja para licitaciones y contratos",
        "Crecimiento financiero sostenido y aumento en ventas",
        "Acceso continuo a nuevas líneas de inversión y crédito",
      ],
      ctaText: "Impulsar Crecimiento de mi Empresa",
      vertical: "inversiones" as VerticalKey,
    },
  ];

  // Scrub scroll through container
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (!containerRef.current) return;
          const rect = containerRef.current.getBoundingClientRect();
          const windowHeight = window.innerHeight;
          const totalScrollable = containerRef.current.offsetHeight - windowHeight;

          if (totalScrollable <= 0) return;

          const scrolled = -rect.top;
          const progress = Math.max(0, Math.min(1, scrolled / totalScrollable));
          setScrollProgress(progress);

          if (!isManualOverride) {
            // Determine active step from scroll (4 segments: 0-0.25, 0.25-0.5, 0.5-0.75, 0.75-1)
            if (progress < 0.25) {
              setActiveStep(0);
            } else if (progress < 0.5) {
              setActiveStep(1);
            } else if (progress < 0.75) {
              setActiveStep(2);
            } else {
              setActiveStep(3);
            }
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isManualOverride]);

  const handleManualTabClick = (idx: number) => {
    setActiveStep(idx);
    setIsManualOverride(true);
    // Reset manual override after 2.5s so scroll takes over smoothly
    setTimeout(() => setIsManualOverride(false), 2500);
  };

  const current = steps[activeStep];

  return (
    <div
      ref={containerRef}
      className="relative mb-12 rounded-3xl bg-slate-950 text-white overflow-hidden border border-slate-800 shadow-2xl shadow-sky-950/40"
    >
      {/* Background Ambient Luxury Light Gradients */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-[450px] h-[450px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-sky-950/20 via-transparent to-transparent pointer-events-none" />

      {/* Grid Pattern Texture Overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative z-10 p-6 sm:p-10 lg:p-12">
        {/* Top Header & Interactive Navigation Tabs */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/15 border border-sky-400/30 text-sky-300 text-[11px] font-bold tracking-wider uppercase mb-2.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
              <span>Ecosistema de Liquidez Empresarial NEXT</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight">
              De la Solicitud al Desembolso:{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-300 to-emerald-400">
                Así Impulsamos tu Empresa
              </span>
            </h2>
          </div>

          {/* Interactive Stepper Navigation Bar */}
          <div className="flex items-center gap-1 sm:gap-2 p-1.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md overflow-x-auto">
            {steps.map((st, idx) => {
              const isActive = activeStep === idx;
              return (
                <button
                  key={st.id}
                  onClick={() => handleManualTabClick(idx)}
                  className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer whitespace-nowrap ${
                    isActive
                      ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/25 scale-[1.02]"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                      isActive ? "bg-white text-sky-900" : "bg-white/10 text-slate-300"
                    }`}
                  >
                    {st.num}
                  </span>
                  <span>{st.navLabel}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic 2-Column Storyboard: Narrative on Left, High-End Banking Animation on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center pt-8 sm:pt-10">
          {/* LEFT COLUMN: Narrative & Structured Details */}
          <div className="lg:col-span-5 space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="space-y-4"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-400/25 text-sky-300 text-xs font-bold">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  <span>Paso {current.num} • {current.badge}</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                  {current.title}
                </h3>

                <p className="text-sm text-slate-300 leading-relaxed font-normal">
                  {current.desc}
                </p>

                {/* Bullet Points with Clean Icons */}
                <div className="space-y-2.5 pt-2">
                  {current.bullets.map((bullet, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + idx * 0.05, duration: 0.3 }}
                      className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300"
                    >
                      <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-500/30">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <span className="leading-snug">{bullet}</span>
                    </motion.div>
                  ))}
                </div>

                {/* Action CTA Button */}
                <div className="pt-4 flex items-center gap-3">
                  <button
                    onClick={() => onSelectVertical(current.vertical)}
                    className="h-11 px-6 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-lg shadow-sky-500/25 transition-transform active:scale-95 cursor-pointer"
                  >
                    <Zap className="w-4 h-4 fill-white" />
                    <span>{current.ctaText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Sin costo de estudio</span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Scroll Indicator / Step Tracker */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
                Haz scroll o selecciona los pasos arriba
              </span>
              <span className="font-mono font-bold text-sky-400">
                {activeStep + 1} / {steps.length}
              </span>
            </div>
          </div>

          {/* RIGHT COLUMN: Ultra-Smooth High-End Banking Vector Animations */}
          <div className="lg:col-span-7 flex justify-center items-center min-h-[460px] sm:min-h-[500px] relative">
            {/* Animated Canvas Stage Container */}
            <div className="relative w-full max-w-[540px] aspect-[4/3.5] rounded-3xl bg-slate-900/90 border border-white/15 backdrop-blur-2xl shadow-2xl p-6 sm:p-8 flex items-center justify-center overflow-hidden">
              {/* Inner Decorative Ambient Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-sky-500/10 via-transparent to-emerald-500/10 pointer-events-none" />

              <AnimatePresence mode="wait">
                {/* ============================================================ */}
                {/* SCENE 01: SILUETA DE PERSONA TOMANDO LA TARJETA NEXT */}
                {/* ============================================================ */}
                {activeStep === 0 && (
                  <motion.div
                    key="scene-card"
                    initial={{ opacity: 0, scale: 0.92, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.92, y: -20 }}
                    transition={{ type: "spring", stiffness: 90, damping: 20 }}
                    className="relative w-full h-full flex flex-col items-center justify-center"
                  >
                    {/* SVG Silhouette of Elegant Executive Hand Holding the Card */}
                    <div className="relative w-full max-w-[380px] h-[280px] flex items-center justify-center">
                      {/* Aura of Luxury Gold/Cyan behind the card */}
                      <div className="absolute w-60 h-40 bg-sky-400/20 rounded-full blur-2xl animate-pulse pointer-events-none" />

                      {/* 3D Angled Corporate NEXT Card */}
                      <motion.div
                        initial={{ rotateX: 15, rotateY: -20, rotateZ: -6, y: -10 }}
                        animate={{
                          rotateX: [15, 12, 15],
                          rotateY: [-20, -14, -20],
                          rotateZ: [-6, -4, -6],
                          y: [-10, -16, -10],
                        }}
                        transition={{
                          repeat: Infinity,
                          duration: 4,
                          ease: "easeInOut",
                        }}
                        style={{ transformStyle: "preserve-3d" }}
                        className="relative z-20 w-72 sm:w-80 h-44 sm:h-48 rounded-2xl p-5 text-white shadow-2xl border border-white/30 backdrop-blur-md overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-sky-950 flex flex-col justify-between"
                      >
                        {/* Metallic Light Sheen Bar */}
                        <div className="absolute -inset-full bg-gradient-to-r from-transparent via-white/15 to-transparent rotate-45 transform -translate-x-full animate-[shimmer_3s_infinite]" />

                        {/* Top Row: NEXT Brand & Contactless Chip */}
                        <div className="flex items-center justify-between relative z-10">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-sky-500 text-white flex items-center justify-center font-black text-xs shadow-md">
                              N
                            </div>
                            <div>
                              <span className="font-black text-sm tracking-widest uppercase">
                                NEXT
                              </span>
                              <span className="block text-[8px] text-sky-300 font-semibold tracking-wider">
                                TITANIUM CORPORATE
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 text-sky-300">
                            <Wifi className="w-4 h-4 rotate-90" />
                          </div>
                        </div>

                        {/* Middle Row: Gold EMV Chip & Holographic Badge */}
                        <div className="flex items-center justify-between relative z-10">
                          {/* Gold Chip */}
                          <div className="w-10 h-7 rounded-md bg-gradient-to-br from-amber-200 via-amber-400 to-yellow-600 border border-amber-300/60 shadow-sm relative overflow-hidden flex items-center justify-center">
                            <div className="w-full h-[1px] bg-amber-800/40 absolute" />
                            <div className="h-full w-[1px] bg-amber-800/40 absolute" />
                          </div>

                          <div className="text-right">
                            <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-semibold">
                              Cupo Aprobado
                            </span>
                            <span className="text-sm font-black text-emerald-300 font-mono">
                              $150.000.000 COP
                            </span>
                          </div>
                        </div>

                        {/* Bottom Row: Card Holder & Security */}
                        <div className="flex items-end justify-between relative z-10 pt-1 border-t border-white/10">
                          <div>
                            <span className="text-[8px] uppercase tracking-widest text-slate-400 block">
                              Titular Empresarial
                            </span>
                            <span className="text-xs font-bold tracking-wider text-slate-200 font-mono">
                              EMPRESA COLOMBIANA S.A.S.
                            </span>
                          </div>
                          <span className="text-xs font-mono font-bold text-sky-400">
                            •••• 8829
                          </span>
                        </div>
                      </motion.div>

                      {/* Vector Silhouette: Executive Hand Grasping/Holding the Card */}
                      <svg
                        className="absolute bottom-0 right-2 z-30 w-36 sm:w-44 h-auto pointer-events-none drop-shadow-[0_15px_15px_rgba(0,0,0,0.6)]"
                        viewBox="0 0 160 140"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        {/* Palm and Forearm Silhouette with Subtle Rim Light */}
                        <path
                          d="M130 140 C125 110 115 90 95 85 C85 82 75 80 65 80 C50 80 35 90 20 105 L20 140 Z"
                          fill="url(#handGradient)"
                        />
                        {/* Thumb gripping the card edge */}
                        <path
                          d="M50 78 C52 68 58 62 68 62 C74 62 78 66 76 72 C74 78 68 82 56 84 Z"
                          fill="url(#fingerGradient)"
                          stroke="#38bdf8"
                          strokeWidth="1"
                          strokeOpacity="0.4"
                        />
                        {/* Fingers curled gracefully underneath */}
                        <path
                          d="M85 86 C92 84 98 87 100 93 C101 98 97 104 88 106 Z"
                          fill="url(#fingerGradient)"
                        />
                        <path
                          d="M95 96 C102 95 108 98 109 104 C110 109 105 114 96 115 Z"
                          fill="url(#fingerGradient)"
                        />
                        <defs>
                          <linearGradient id="handGradient" x1="50" y1="80" x2="130" y2="140" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#1e293b" />
                            <stop offset="1" stopColor="#0f172a" />
                          </linearGradient>
                          <linearGradient id="fingerGradient" x1="50" y1="60" x2="80" y2="90" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#334155" />
                            <stop offset="1" stopColor="#1e293b" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>

                    {/* Floating Status Pill */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="mt-4 px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-bold flex items-center gap-2 shadow-lg backdrop-blur-md"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Tarjeta Activa • Cupo Disponible para Utilización</span>
                    </motion.div>
                  </motion.div>
                )}

                {/* ============================================================ */}
                {/* SCENE 02: PAGO / VALIDACIÓN EN DATÁFONO POS CONTACTLESS */}
                {/* ============================================================ */}
                {activeStep === 1 && (
                  <motion.div
                    key="scene-datafono"
                    initial={{ opacity: 0, scale: 0.92, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.92, y: -20 }}
                    transition={{ type: "spring", stiffness: 90, damping: 20 }}
                    className="relative w-full h-full flex flex-col items-center justify-center"
                  >
                    <div className="relative w-full max-w-[360px] h-[290px] flex items-center justify-center">
                      {/* Modern Smart POS Datáfono Body */}
                      <div className="relative z-10 w-48 sm:w-52 h-64 rounded-3xl bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950 border-2 border-slate-700/80 shadow-2xl p-4 flex flex-col justify-between overflow-hidden">
                        {/* Status Lights on Datáfono Bezel */}
                        <div className="flex items-center justify-between pb-2 border-b border-white/5">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                            <span className="w-2 h-2 rounded-full bg-emerald-400" />
                            <span className="text-[9px] font-bold text-slate-400 font-mono">
                              POS ONLINE
                            </span>
                          </div>
                          <span className="text-[8px] font-bold uppercase tracking-wider text-sky-400">
                            REDEBAN / VISA
                          </span>
                        </div>

                        {/* Interactive Screen of Datáfono */}
                        <div className="relative my-auto w-full h-36 rounded-2xl bg-slate-950 border border-white/10 p-3 flex flex-col items-center justify-center text-center overflow-hidden">
                          {/* Radial Glow */}
                          <div className="absolute inset-0 bg-emerald-500/10 rounded-full blur-xl animate-pulse" />

                          {/* Approved Check Animation */}
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: [0, 1.2, 1] }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 mb-2"
                          >
                            <CheckCircle2 className="w-6 h-6" />
                          </motion.div>

                          <span className="text-xs font-black text-emerald-300 tracking-wider uppercase">
                            TRANSACCIÓN APROBADA
                          </span>
                          <span className="text-base font-black text-white font-mono mt-0.5">
                            $150.000.000 COP
                          </span>
                          <span className="text-[8px] text-slate-400 font-mono mt-0.5">
                            AUT: #892104 • RED INTERBANCARIA
                          </span>
                        </div>

                        {/* NFC Contactless Wave Area */}
                        <div className="pt-2 flex items-center justify-center gap-2 text-slate-500">
                          <Wifi className="w-4 h-4 text-cyan-400 rotate-90" />
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                            LECTOR NFC CONTACTLESS
                          </span>
                        </div>
                      </div>

                      {/* Card tapping on top of the Datáfono with contactless waves */}
                      <motion.div
                        initial={{ x: 60, y: -70, rotate: -25, opacity: 0 }}
                        animate={{ x: 25, y: -45, rotate: -15, opacity: 1 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="absolute z-20 top-2 right-2 sm:right-6 w-48 sm:w-56 h-32 rounded-xl bg-gradient-to-br from-sky-600 via-blue-700 to-slate-900 border border-cyan-300/50 shadow-2xl p-3 text-white flex flex-col justify-between"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-black text-[11px] tracking-wider text-cyan-200">
                            NEXT TITANIUM
                          </span>
                          <Wifi className="w-3.5 h-3.5 text-cyan-300 rotate-90 animate-pulse" />
                        </div>
                        <div className="text-[10px] font-mono text-cyan-100">
                          •••• 8829
                        </div>
                      </motion.div>

                      {/* Animated Radio Waves pulsing between Card and Datáfono */}
                      <div className="absolute top-10 right-20 z-15 pointer-events-none">
                        <span className="absolute w-12 h-12 rounded-full border-2 border-cyan-400/60 animate-ping" />
                        <span className="absolute -inset-2 w-16 h-16 rounded-full border border-emerald-400/40 animate-ping delay-150" />
                      </div>
                    </div>

                    {/* Status Feedback Badge */}
                    <div className="mt-4 px-4 py-1.5 rounded-full bg-sky-500/15 border border-sky-400/30 text-sky-300 text-xs font-bold flex items-center gap-2 shadow-lg backdrop-blur-md">
                      <Zap className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Validación Contactless Completada • Desembolso Autorizado</span>
                    </div>
                  </motion.div>
                )}

                {/* ============================================================ */}
                {/* SCENE 03: DESEMBOLSO Y ACREDITACIÓN A CUENTA BANCARIA */}
                {/* ============================================================ */}
                {activeStep === 2 && (
                  <motion.div
                    key="scene-desembolso"
                    initial={{ opacity: 0, scale: 0.92, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.92, y: -20 }}
                    transition={{ type: "spring", stiffness: 90, damping: 20 }}
                    className="relative w-full h-full flex flex-col items-center justify-center"
                  >
                    {/* Modern Mobile Banking Smartphone Mockup */}
                    <div className="relative w-64 sm:w-72 h-[310px] rounded-[32px] bg-slate-950 border-4 border-slate-700/80 shadow-2xl p-4 flex flex-col justify-between overflow-hidden">
                      {/* Dynamic Island Notch */}
                      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-4 bg-slate-900 rounded-full border border-white/10 z-20" />

                      {/* Banking App Header */}
                      <div className="pt-4 flex items-center justify-between relative z-10">
                        <div>
                          <span className="text-[9px] uppercase font-bold text-slate-400">
                            Banca Empresarial
                          </span>
                          <span className="text-xs font-black text-white block">
                            Cuenta Corriente
                          </span>
                        </div>
                        <div className="w-6 h-6 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center text-[10px] font-bold">
                          ✓
                        </div>
                      </div>

                      {/* Rolling Balance Card */}
                      <div className="my-auto p-4 rounded-2xl bg-gradient-to-br from-emerald-950/40 to-slate-900 border border-emerald-500/30 text-center relative overflow-hidden">
                        <div className="absolute -top-6 -right-6 w-20 h-20 bg-emerald-500/20 rounded-full blur-xl pointer-events-none" />

                        <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider block">
                          Saldo Disponible Acreditado
                        </span>

                        {/* Animated Counter */}
                        <motion.h4
                          initial={{ scale: 0.8 }}
                          animate={{ scale: 1 }}
                          className="text-xl sm:text-2xl font-black text-white font-mono mt-1"
                        >
                          $152.450.000 COP
                        </motion.h4>

                        <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                          <TrendingUp className="w-3 h-3" />
                          <span>+$150.000.000 COP Desembolsados</span>
                        </div>
                      </div>

                      {/* Push Notification Banner */}
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="p-2.5 rounded-xl bg-white/10 border border-white/15 backdrop-blur-md text-[10px] text-slate-200 flex items-center gap-2.5"
                      >
                        <div className="w-7 h-7 rounded-lg bg-emerald-500 text-white flex items-center justify-center shrink-0">
                          <Wallet className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <span className="font-bold text-white block">
                            Depósito Recibido
                          </span>
                          <span className="text-slate-400 block truncate">
                            Transferencia inmediata de NEXT Connection
                          </span>
                        </div>
                      </motion.div>
                    </div>

                    {/* Status Pill */}
                    <div className="mt-4 px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-bold flex items-center gap-2 shadow-lg backdrop-blur-md">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Fondos 100% Disponibles para Tu Negocio</span>
                    </div>
                  </motion.div>
                )}

                {/* ============================================================ */}
                {/* SCENE 04: LA EMPRESA CRECIENDO (EXPANSIÓN CORPORATIVA) */}
                {/* ============================================================ */}
                {activeStep === 3 && (
                  <motion.div
                    key="scene-crecimiento"
                    initial={{ opacity: 0, scale: 0.92, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.92, y: -20 }}
                    transition={{ type: "spring", stiffness: 90, damping: 20 }}
                    className="relative w-full h-full flex flex-col items-center justify-center"
                  >
                    <div className="relative w-full max-w-[420px] h-[290px] flex items-center justify-center">
                      {/* Ambient Golden/Cyan Growth Rays */}
                      <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/15 via-sky-500/10 to-transparent rounded-full blur-2xl pointer-events-none" />

                      {/* Vector Skyline: Modern Corporate Headquarters / Glass Towers */}
                      <svg
                        className="w-full h-48 drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
                        viewBox="0 0 360 180"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        {/* Background Tower Left */}
                        <rect x="30" y="70" width="45" height="110" rx="4" fill="#1e293b" />
                        <rect x="38" y="80" width="8" height="12" rx="1" fill="#38bdf8" fillOpacity="0.6" />
                        <rect x="54" y="80" width="8" height="12" rx="1" fill="#38bdf8" fillOpacity="0.4" />
                        <rect x="38" y="105" width="8" height="12" rx="1" fill="#38bdf8" fillOpacity="0.8" />
                        <rect x="54" y="105" width="8" height="12" rx="1" fill="#34d399" fillOpacity="0.7" />

                        {/* Main Center Modern High-Rise Corporate Tower */}
                        <rect x="90" y="30" width="70" height="150" rx="6" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" strokeOpacity="0.4" />
                        {/* Glass Window Grid */}
                        <rect x="100" y="45" width="12" height="16" rx="2" fill="#38bdf8" fillOpacity="0.8" />
                        <rect x="119" y="45" width="12" height="16" rx="2" fill="#34d399" fillOpacity="0.8" />
                        <rect x="138" y="45" width="12" height="16" rx="2" fill="#38bdf8" fillOpacity="0.8" />

                        <rect x="100" y="70" width="12" height="16" rx="2" fill="#38bdf8" fillOpacity="0.6" />
                        <rect x="119" y="70" width="12" height="16" rx="2" fill="#38bdf8" fillOpacity="0.9" />
                        <rect x="138" y="70" width="12" height="16" rx="2" fill="#34d399" fillOpacity="0.7" />

                        <rect x="100" y="95" width="12" height="16" rx="2" fill="#34d399" fillOpacity="0.9" />
                        <rect x="119" y="95" width="12" height="16" rx="2" fill="#38bdf8" fillOpacity="0.7" />
                        <rect x="138" y="95" width="12" height="16" rx="2" fill="#38bdf8" fillOpacity="0.8" />

                        {/* Tower Spire Beacon */}
                        <line x1="125" y1="30" x2="125" y2="12" stroke="#38bdf8" strokeWidth="2" />
                        <circle cx="125" cy="10" r="3" fill="#34d399" />

                        {/* Mid Tower Right */}
                        <rect x="175" y="55" width="60" height="125" rx="5" fill="#1e293b" />
                        <rect x="188" y="70" width="10" height="14" rx="1" fill="#34d399" fillOpacity="0.7" />
                        <rect x="210" y="70" width="10" height="14" rx="1" fill="#38bdf8" fillOpacity="0.5" />
                        <rect x="188" y="95" width="10" height="14" rx="1" fill="#38bdf8" fillOpacity="0.8" />
                        <rect x="210" y="95" width="10" height="14" rx="1" fill="#34d399" fillOpacity="0.9" />

                        {/* Far Right Tower */}
                        <rect x="250" y="85" width="50" height="95" rx="4" fill="#0f172a" />
                        <rect x="262" y="100" width="8" height="12" rx="1" fill="#38bdf8" fillOpacity="0.6" />
                        <rect x="278" y="100" width="8" height="12" rx="1" fill="#38bdf8" fillOpacity="0.8" />

                        {/* Ascending Financial Growth Curve Line Shooting Upwards */}
                        <path
                          d="M20 150 Q90 140 160 90 T320 25"
                          fill="none"
                          stroke="url(#growthGradient)"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                        />
                        {/* Pulsing Vertex Apex */}
                        <circle cx="320" cy="25" r="5" fill="#10b981" />
                        <circle cx="320" cy="25" r="9" stroke="#34d399" strokeWidth="1.5" opacity="0.6" />

                        <defs>
                          <linearGradient id="growthGradient" x1="20" y1="150" x2="320" y2="25" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#0284c7" />
                            <stop offset="0.5" stopColor="#38bdf8" />
                            <stop offset="1" stopColor="#34d399" />
                          </linearGradient>
                        </defs>
                      </svg>

                      {/* Floating Metric Pill 1: Crecimiento */}
                      <motion.div
                        initial={{ opacity: 0, y: 15, x: 20 }}
                        animate={{ opacity: 1, y: 0, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="absolute top-2 right-2 sm:right-6 px-3.5 py-2 rounded-xl bg-slate-900/90 border border-emerald-400/40 text-white backdrop-blur-md shadow-xl flex items-center gap-2"
                      >
                        <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black">
                          <ArrowUpRight className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-[9px] uppercase font-bold text-slate-400 block">
                            Rendimiento Anual
                          </span>
                          <span className="text-xs font-black text-emerald-300">
                            +340% Expansión
                          </span>
                        </div>
                      </motion.div>

                      {/* Floating Metric Pill 2: Capacidad */}
                      <motion.div
                        initial={{ opacity: 0, y: 15, x: -20 }}
                        animate={{ opacity: 1, y: 0, x: 0 }}
                        transition={{ delay: 0.35 }}
                        className="absolute bottom-4 left-2 sm:left-6 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-sky-400/40 text-white backdrop-blur-md shadow-xl flex items-center gap-2"
                      >
                        <Building2 className="w-4 h-4 text-sky-400" />
                        <span className="text-[11px] font-bold text-sky-200">
                          Músculo Financiero Activo
                        </span>
                      </motion.div>
                    </div>

                    {/* Status Pill */}
                    <div className="mt-4 px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-bold flex items-center gap-2 shadow-lg backdrop-blur-md">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                      <span>Empresa Blindada & Lista para Nuevos Mercados</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
