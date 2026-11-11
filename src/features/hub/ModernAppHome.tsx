"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/src/context/AuthContext";
import {
  MapPin,
  Bell,
  Search,
  Zap,
  Calendar,
  Building2,
  Car,
  HeartPulse,
  TrendingUp,
  Home,
  FileCheck,
  ShieldCheck,
  MoreHorizontal,
  ChevronRight,
  Star,
  CheckCircle2,
  Clock,
  Shield,
  Percent,
  Compass,
  ArrowRight,
  User,
  Sparkles,
  Coins,
  DollarSign,
  CreditCard,
  BarChart3,
  Umbrella,
  Activity,
  PieChart,
  Landmark,
} from "lucide-react";
import { VerticalKey } from "@/src/types/common";
import {
  Finance3DVault,
  Insurance3DShield,
  Investment3DGrowth,
  Health3DHeart,
  Car3DAuto,
  Contract3DSeal,
  Lightning3DExpress,
} from "@/src/components/common/Icons3D";

interface ModernAppHomeProps {
  onSelectVertical?: (vertical: VerticalKey | any) => void;
  onBookAppointment?: (specialty?: string) => void;
}

export default function ModernAppHome({
  onSelectVertical,
  onBookAppointment,
}: ModernAppHomeProps) {
  const { user } = useAuth();
  const [activeSlide, setActiveSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"bookings" | "portal">("bookings");

  const slides = [
    {
      badge: "Crédito Empresarial & Personal",
      title: "¿Necesitas liquidez inmediata?",
      highlight: "Te aprobamos y desembolsamos en 24h.",
      subfeatures: [
        "Estudio ágil con más de 35 bancos y cooperativas",
        "0% cobros ocultos • Asesoría 100% gratuita",
      ],
      primaryCta: "Solicitar Crédito",
      secondaryCta: "Agendar Asesoría",
      bgGradient: "from-sky-500 via-sky-600 to-blue-700",
      accentColor: "text-sky-200",
      image: "/assets/avatar-advisor-3d-transparent.png",
      isDisneyAvatar: true,
      vertical: "credito" as VerticalKey,
    },
    {
      badge: "Seguros 360° Todo Riesgo",
      title: "¿Protección para tu auto o familia?",
      highlight: "Cotiza con 35 aseguradoras aliadas.",
      subfeatures: [
        "Ahorra hasta un 35% en tu póliza todo riesgo",
        "Atención médica prioritaria y asistencia 24/7",
      ],
      primaryCta: "Cotizar Seguro",
      secondaryCta: "Hablar con Asesor",
      bgGradient: "from-sky-600 via-blue-600 to-indigo-700",
      accentColor: "text-cyan-200",
      image: "https://images.unsplash.com/photo-1450133064473-71024230f91b?w=600&auto=format&fit=crop&q=80",
      vertical: "seguros" as VerticalKey,
    },
    {
      badge: "Inversiones de Alto Rendimiento",
      title: "Haz crecer tu patrimonio seguro.",
      highlight: "Rentabilidad fija hasta 17.8% E.A.",
      subfeatures: [
        "Custodia y respaldo legal vigilado",
        "Abono periódico de utilidades a tu cuenta",
      ],
      primaryCta: "Simular Inversión",
      secondaryCta: "Agendar Cita VIP",
      bgGradient: "from-blue-600 via-sky-600 to-cyan-700",
      accentColor: "text-sky-200",
      image: "https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?w=600&auto=format&fit=crop&q=80",
      vertical: "inversiones" as VerticalKey,
    },
  ];

  const currentSlide = slides[activeSlide];

  // 8 Grid Services (4x2 exact layout from reference) in NEXT Light Blue theme
  const servicesGrid = [
    {
      id: "cred_empresa",
      label: "Crédito Empresa",
      subtitle: "Capital de trabajo",
      icon: Building2,
      badge: "24h",
      vertical: "credito" as VerticalKey,
    },
    {
      id: "seg_autos",
      label: "Póliza Autos",
      subtitle: "Todo riesgo",
      icon: Car,
      badge: "-35%",
      vertical: "seguros" as VerticalKey,
    },
    {
      id: "seg_salud",
      label: "Salud & Vida",
      subtitle: "Individual y colectivo",
      icon: HeartPulse,
      badge: "VIP",
      vertical: "seguros" as VerticalKey,
    },
    {
      id: "inversiones",
      label: "Inversiones",
      subtitle: "Hasta 17.8% E.A.",
      icon: TrendingUp,
      badge: "Rentable",
      vertical: "inversiones" as VerticalKey,
    },
    {
      id: "cred_libre",
      label: "Libre Inversión",
      subtitle: "Persona natural",
      icon: Home,
      vertical: "credito" as VerticalKey,
    },
    {
      id: "pol_cumplimiento",
      label: "Cumplimiento",
      subtitle: "Licitaciones y contratos",
      icon: FileCheck,
      vertical: "seguros" as VerticalKey,
    },
    {
      id: "viabilidad_express",
      label: "Viabilidad Ágil",
      subtitle: "Diagnóstico sin costo",
      icon: Zap,
      vertical: "credito" as VerticalKey,
    },
    {
      id: "todos_servicios",
      label: "Más Soluciones",
      subtitle: "Portafolio 360°",
      icon: MoreHorizontal,
      vertical: "credito" as VerticalKey,
    },
  ];

  const handleServiceClick = (vertical: any) => {
    if (onSelectVertical) {
      onSelectVertical(vertical);
    } else {
      window.dispatchEvent(
        new CustomEvent("open-vertical-modal", { detail: { vertical } })
      );
    }
  };

  const handleBookingClick = (specialty?: string) => {
    if (onBookAppointment) {
      onBookAppointment(specialty);
    } else {
      const el = document.getElementById("agenda-section");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 pt-4 pb-12 font-sans text-slate-800">
      {/* Dynamic Keyframe Animations for Floating Finance & Insurance Elements */}
      <style>{`
        @keyframes nextFloat1 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(4deg); }
        }
        @keyframes nextFloat2 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(14px) rotate(-5deg); }
        }
        @keyframes nextFloat3 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          50% { transform: translate(-8px, -10px) scale(1.05); }
        }
        @keyframes nextGlowPulse {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.38; transform: scale(1.15); }
        }
        .anim-float-1 { animation: nextFloat1 6s ease-in-out infinite; }
        .anim-float-2 { animation: nextFloat2 7s ease-in-out infinite; }
        .anim-float-3 { animation: nextFloat3 8s ease-in-out infinite; }
        .anim-pulse-glow { animation: nextGlowPulse 5s ease-in-out infinite; }
        @keyframes nextAvatarFloat {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-7px) scale(1.02); }
        }
        .anim-avatar { animation: nextAvatarFloat 4s ease-in-out infinite; }
      `}</style>

      {/* 1. TOP HEADER APP-BAR: Location + Status + Notification + Profile */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-9 h-9 rounded-full bg-sky-50 text-sky-600 border border-sky-200 flex items-center justify-center shrink-0 shadow-2xs">
            <MapPin className="w-4 h-4 text-sky-500" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1 text-xs font-bold text-slate-900 tracking-tight">
              <span className="truncate">Medellín, Colombia</span>
              <span className="text-[10px] text-sky-500">▾</span>
            </div>
            <p className="text-[11px] text-slate-500 truncate">
              NEXT Connection Group • Ecosistema Financiero 360°
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Notification Bell */}
          <Link
            href="/portal"
            className="w-9 h-9 rounded-full bg-white border border-slate-200 hover:border-sky-300 flex items-center justify-center text-slate-600 hover:text-sky-600 transition-colors relative shadow-2xs"
            title="Notificaciones"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-sky-500 ring-2 ring-white" />
          </Link>

          {/* User Portal Pill with Avatar if logged in */}
          {user ? (
            <Link
              href="/portal"
              className="h-9 px-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-xs"
            >
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || "Usuario"}
                  className="w-5 h-5 rounded-full object-cover ring-1 ring-sky-400"
                />
              ) : (
                <div className="w-5 h-5 rounded-full bg-sky-500 text-white flex items-center justify-center text-[10px] font-bold">
                  {user.displayName
                    ? user.displayName.charAt(0).toUpperCase()
                    : user.email?.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="hidden sm:inline max-w-[90px] truncate">
                {user.displayName?.split(" ")[0] || "Mi Portal"}
              </span>
            </Link>
          ) : (
            <Link
              href="/portal/login"
              className="h-9 px-3.5 rounded-full bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-sky-500/20 active:scale-95"
            >
              <User className="w-3.5 h-3.5 text-white" />
              <span className="hidden sm:inline">Mi Portal</span>
            </Link>
          )}
        </div>
      </div>

      {/* 2. PILL SEARCH BAR (Search for credit, insurance, or investment) */}
      <div className="relative mb-6">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-sky-500 absolute left-4 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar crédito empresarial, seguros de autos, inversiones..."
            className="w-full h-12 pl-11 pr-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:border-sky-300 focus:border-sky-500 focus:ring-3 focus:ring-sky-100 focus:outline-none text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 transition-all"
          />
        </div>
      </div>

      {/* 3. HERO BANNER CARD (Luminous NEXT Light Blue Gradient with Animated Floating Finance & Insurance Icons) */}
      <div className="mb-8">
        <div
          className={`relative rounded-3xl overflow-hidden bg-gradient-to-br ${currentSlide.bgGradient} text-white shadow-xl shadow-sky-900/15 p-6 sm:p-8 transition-all duration-500 border border-sky-400/30`}
        >
          {/* Animated Background Glowing Orbs */}
          <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-sky-300/25 blur-3xl anim-pulse-glow pointer-events-none" />
          <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-blue-400/20 blur-3xl anim-pulse-glow pointer-events-none" />

          {/* ================= ANIMATED FLOATING FINANCE, INSURANCE & INVESTMENT BADGES ================= */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
            {/* 1. Floating Coins / Dinero (Top Center) */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 anim-float-1 opacity-80 hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 shadow-lg text-sky-100 text-[11px] font-bold">
              <Coins className="w-3.5 h-3.5 text-yellow-300" />
              <span>Desembolso 24h</span>
            </div>

            {/* 2. Floating Growth Graph (Top Right Behind Image) */}
            <div className="absolute top-6 right-8 anim-float-2 opacity-75 hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg text-white text-[11px] font-semibold">
              <TrendingUp className="w-4 h-4 text-emerald-300" />
              <span>+17.8% E.A.</span>
            </div>

            {/* 3. Floating Shield / Seguro 360 (Bottom Left) */}
            <div className="absolute bottom-5 left-8 anim-float-3 opacity-80 hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg text-white text-[11px] font-semibold">
              <ShieldCheck className="w-4 h-4 text-cyan-300" />
              <span>Póliza Todo Riesgo</span>
            </div>

            {/* 4. Floating Credit Card Icon (Center Left background watermark) */}
            <div className="absolute top-1/3 left-4 anim-float-2 opacity-20 text-white hidden xl:block">
              <CreditCard className="w-16 h-16" />
            </div>

            {/* 5. Floating Umbrella / Vida & Salud (Bottom Center background watermark) */}
            <div className="absolute bottom-3 right-1/3 anim-float-1 opacity-25 text-white hidden lg:block">
              <Umbrella className="w-12 h-12" />
            </div>

            {/* 6. Floating BarChart / Inversiones (Right background watermark) */}
            <div className="absolute top-1/2 right-4 anim-float-3 opacity-20 text-white hidden md:block">
              <BarChart3 className="w-16 h-16" />
            </div>

            {/* 7. Floating Dollar / Disney Avatar Badge on Mobile */}
            {(currentSlide as any).isDisneyAvatar ? (
              <div className="absolute top-3.5 right-4 md:hidden anim-avatar z-20 flex items-center gap-1.5 p-1 pr-2.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 shadow-md">
                <img
                  src={currentSlide.image}
                  alt="Asesor 3D"
                  className="w-8 h-8 rounded-full object-cover object-top ring-1 ring-white/60"
                />
                <span className="text-[10px] font-bold text-white">Asesor VIP 24h</span>
              </div>
            ) : (
              <div className="absolute top-3 right-4 sm:hidden anim-float-1 opacity-80 flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-[10px] font-bold text-white">
                <DollarSign className="w-3 h-3 text-yellow-300" />
                <span>0% Cobros Ocultos</span>
              </div>
            )}
          </div>

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-7 space-y-3">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-wider uppercase px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/25 shadow-xs">
                <Sparkles className="w-3 h-3 text-cyan-200" />
                {currentSlide.badge}
              </span>

              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white leading-tight drop-shadow-xs">
                {currentSlide.title}{" "}
                <span className={currentSlide.accentColor}>
                  {currentSlide.highlight}
                </span>
              </h1>

              <div className="space-y-1.5 pt-1">
                {currentSlide.subfeatures.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-sky-50 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-200 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              {/* Dual Action Buttons (Reference style: White solid + Frosted Outline) */}
              <div className="flex flex-wrap items-center gap-2.5 pt-3">
                <button
                  onClick={() => handleServiceClick(currentSlide.vertical)}
                  className="h-10 px-5 rounded-full bg-white hover:bg-sky-50 text-sky-950 text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-md shadow-sky-950/20 transition-transform active:scale-95 cursor-pointer"
                >
                  <Zap className="w-4 h-4 text-sky-600 fill-sky-500" />
                  <span>{currentSlide.primaryCta}</span>
                </button>

                <button
                  onClick={() => handleBookingClick(currentSlide.vertical)}
                  className="h-10 px-4 rounded-full bg-white/15 hover:bg-white/25 border border-white/30 backdrop-blur-md text-white text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Calendar className="w-4 h-4 text-sky-200" />
                  <span>{currentSlide.secondaryCta}</span>
                </button>
              </div>
            </div>

            {/* Right Side Visual Image: 3D Disney Avatar or Photo Card */}
            <div className="md:col-span-5 hidden md:flex justify-end items-end relative min-h-[220px]">
              {(currentSlide as any).isDisneyAvatar ? (
                <div className="relative flex flex-col items-center">
                  {/* Subtle Glowing Aura */}
                  <div className="absolute inset-0 -top-6 w-64 h-64 rounded-full bg-cyan-300/35 blur-2xl pointer-events-none" />

                  {/* 3D Disney/Pixar Advisor Avatar with Floating Motion */}
                  <img
                    src={currentSlide.image}
                    alt="Asesor Financiero NEXT 3D"
                    className="w-64 lg:w-72 h-auto object-contain anim-avatar drop-shadow-[0_20px_35px_rgba(2,132,199,0.5)] select-none pointer-events-none relative z-10 -mb-6 sm:-mb-8"
                  />

                  {/* Trust Pill Badge */}
                  <div className="absolute bottom-1 left-0 right-0 z-20 text-[10px] text-white font-bold bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 shadow-lg flex items-center justify-center gap-1.5 whitespace-nowrap">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Asesor VIP • Aprobación 24h</span>
                  </div>
                </div>
              ) : (
                <div className="relative w-64 h-48 rounded-2xl overflow-hidden border-2 border-white/30 shadow-2xl shadow-sky-950/30">
                  <img
                    src={currentSlide.image}
                    alt={currentSlide.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-sky-950/60 via-transparent to-transparent" />
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 text-[10px] text-white font-semibold bg-sky-950/50 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/20 flex items-center gap-1.5">
                    <Activity className="w-3 h-3 text-cyan-300" />
                    <span>Asesoría y trámite 100% digital</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Dots Pagination */}
          <div className="flex items-center justify-center gap-1.5 pt-5 relative z-10">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveSlide(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  activeSlide === idx
                    ? "w-6 bg-white"
                    : "w-1.5 bg-white/30 hover:bg-white/60"
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 4. SERVICIOS PRINCIPALES (BENTO BOX LAYOUT WITH 3D VISUALS - MATCHING USER REFERENCE) */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              Servicios Principales
            </h2>
            <p className="text-xs text-slate-500">
              Soluciones integrales de crédito, protección patrimonial e inversiones
            </p>
          </div>
          <button
            onClick={() => handleServiceClick("credito")}
            className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-0.5 transition-colors cursor-pointer"
          >
            <span>Ver todo</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* ================= BENTO GRID TOP ROW ================= */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 mb-3 sm:mb-4">
          {/* Card 1: Left Large Hero Bento (Crédito Empresarial con 3D Glossy Element) */}
          <button
            type="button"
            onClick={() => handleServiceClick("credito")}
            className="md:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 hover:border-sky-300 hover:shadow-xl hover:shadow-sky-500/5 transition-all text-left flex flex-col justify-between relative overflow-hidden group cursor-pointer min-h-[220px] sm:min-h-[260px]"
          >
            <div className="space-y-1.5 z-10 max-w-[75%]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-100">
                Aprobación en 24h
              </span>
              <h3 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight group-hover:text-sky-600 transition-colors">
                Crédito Empresarial
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 font-medium leading-relaxed">
                Liquidez inmediata, capital de trabajo y factoring con más de 35 bancos.
              </p>
            </div>

            {/* 3D Financial Vault / Caja Fuerte Bancaria */}
            <div className="self-end mt-2 z-10 transition-transform duration-500 group-hover:scale-105 group-hover:rotate-3">
              <Finance3DVault />
            </div>

            {/* Ambient Backlight */}
            <div className="absolute right-0 bottom-0 w-48 h-48 rounded-full bg-sky-100/40 blur-3xl pointer-events-none" />
          </button>

          {/* Right Column: 2 Stacked Horizontal Bento Cards */}
          <div className="md:col-span-5 flex flex-col gap-3 sm:gap-4">
            {/* Card 2: Seguros Todo Riesgo (with 3D Protection Shield) */}
            <button
              type="button"
              onClick={() => handleServiceClick("seguros")}
              className="flex-1 bg-white rounded-3xl p-5 border border-slate-200/80 hover:border-sky-300 hover:shadow-lg transition-all text-left flex items-center justify-between gap-3 relative overflow-hidden group cursor-pointer"
            >
              <div className="space-y-1 z-10 max-w-[62%]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-100">
                  Ahorra hasta 35%
                </span>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                  Seguros Todo Riesgo
                </h3>
                <p className="text-[11px] text-slate-400 font-medium">
                  Autos, salud, vida y empresas
                </p>
              </div>

              {/* 3D Shield Protection Visual */}
              <div className="shrink-0 transition-transform duration-500 group-hover:scale-110">
                <Insurance3DShield />
              </div>
            </button>

            {/* Card 3: Inversiones (with 3D Growth Chart & Yield Arrow) */}
            <button
              type="button"
              onClick={() => handleServiceClick("inversiones")}
              className="flex-1 bg-white rounded-3xl p-5 border border-slate-200/80 hover:border-sky-300 hover:shadow-lg transition-all text-left flex items-center justify-between gap-3 relative overflow-hidden group cursor-pointer"
            >
              <div className="space-y-1 z-10 max-w-[62%]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                  Hasta 17.8% E.A.
                </span>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                  Inversiones
                </h3>
                <p className="text-[11px] text-slate-400 font-medium">
                  Rendimiento fiduciario seguro
                </p>
              </div>

              {/* 3D Growth Chart Visual */}
              <div className="shrink-0 transition-transform duration-500 group-hover:scale-110">
                <Investment3DGrowth />
              </div>
            </button>
          </div>
        </div>

        {/* ================= BENTO GRID BOTTOM ROW: 4 SQUIRCLE CATEGORIES ================= */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {/* Item 1: Salud & Vida (3D Heart with Pulse) */}
          <button
            type="button"
            onClick={() => handleServiceClick("salud_vida")}
            className="flex flex-col items-center gap-2 group cursor-pointer"
          >
            <div className="w-full aspect-4/3 rounded-3xl bg-white border border-slate-200/80 group-hover:border-sky-300 group-hover:shadow-md transition-all flex items-center justify-center p-3 relative overflow-hidden">
              <div className="transition-transform duration-500 group-hover:scale-115">
                <Health3DHeart />
              </div>
            </div>
            <span className="text-xs font-bold text-slate-800 group-hover:text-sky-600 transition-colors tracking-tight text-center">
              Salud & Vida
            </span>
          </button>

          {/* Item 2: Póliza Autos (3D Car in NEXT Cyan) */}
          <button
            type="button"
            onClick={() => handleServiceClick("poliza_autos")}
            className="flex flex-col items-center gap-2 group cursor-pointer"
          >
            <div className="w-full aspect-4/3 rounded-3xl bg-white border border-slate-200/80 group-hover:border-sky-300 group-hover:shadow-md transition-all flex items-center justify-center p-3 relative overflow-hidden">
              <div className="transition-transform duration-500 group-hover:scale-115">
                <Car3DAuto />
              </div>
            </div>
            <span className="text-xs font-bold text-slate-800 group-hover:text-sky-600 transition-colors tracking-tight text-center">
              Póliza Autos
            </span>
          </button>

          {/* Item 3: Cumplimiento (3D Legal Contract & Gold Fiduciario Seal) */}
          <button
            type="button"
            onClick={() => handleServiceClick("cumplimiento")}
            className="flex flex-col items-center gap-2 group cursor-pointer"
          >
            <div className="w-full aspect-4/3 rounded-3xl bg-white border border-slate-200/80 group-hover:border-sky-300 group-hover:shadow-md transition-all flex items-center justify-center p-3 relative overflow-hidden">
              <div className="transition-transform duration-500 group-hover:scale-115">
                <Contract3DSeal />
              </div>
            </div>
            <span className="text-xs font-bold text-slate-800 group-hover:text-sky-600 transition-colors tracking-tight text-center">
              Cumplimiento
            </span>
          </button>

          {/* Item 4: Viabilidad Ágil (3D Lightning of Express Approval) */}
          <button
            type="button"
            onClick={() => handleServiceClick("viabilidad_24h")}
            className="flex flex-col items-center gap-2 group cursor-pointer"
          >
            <div className="w-full aspect-4/3 rounded-3xl bg-white border border-slate-200/80 group-hover:border-sky-300 group-hover:shadow-md transition-all flex items-center justify-center p-3 relative overflow-hidden">
              <div className="transition-transform duration-500 group-hover:scale-115">
                <Lightning3DExpress />
              </div>
            </div>
            <span className="text-xs font-bold text-slate-800 group-hover:text-sky-600 transition-colors tracking-tight text-center">
              Viabilidad 24h
            </span>
          </button>
        </div>
      </div>

      {/* 6. TRUST & GUARANTEE STRIP (4 verified pill badges in NEXT Light Blue) */}
      <div className="mb-6 p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
          <div className="flex flex-col items-center gap-1 p-2">
            <div className="w-9 h-9 rounded-full bg-sky-50 text-sky-600 border border-sky-100 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-sky-500" />
            </div>
            <span className="text-xs font-bold text-slate-900">0% Costo Asesoría</span>
            <span className="text-[10px] text-slate-400">Sin pagos anticipados</span>
          </div>

          <div className="flex flex-col items-center gap-1 p-2">
            <div className="w-9 h-9 rounded-full bg-sky-50 text-sky-600 border border-sky-100 flex items-center justify-center">
              <Percent className="w-4 h-4 text-sky-500" />
            </div>
            <span className="text-xs font-bold text-slate-900">Tasas Transparentes</span>
            <span className="text-[10px] text-slate-400">Convenios preferenciales</span>
          </div>

          <div className="flex flex-col items-center gap-1 p-2">
            <div className="w-9 h-9 rounded-full bg-sky-50 text-sky-600 border border-sky-100 flex items-center justify-center">
              <Clock className="w-4 h-4 text-sky-500" />
            </div>
            <span className="text-xs font-bold text-slate-900">Respuesta en 24h</span>
            <span className="text-[10px] text-slate-400">Estudio y viabilidad ágil</span>
          </div>

          <div className="flex flex-col items-center gap-1 p-2">
            <div className="w-9 h-9 rounded-full bg-sky-50 text-sky-600 border border-sky-100 flex items-center justify-center">
              <Compass className="w-4 h-4 text-sky-500" />
            </div>
            <span className="text-xs font-bold text-slate-900">+35 Aliados Oficiales</span>
            <span className="text-[10px] text-slate-400">Bancos y aseguradoras</span>
          </div>
        </div>
      </div>
    </div>
  );
}
