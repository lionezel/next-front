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
  ChevronRight,
  ShieldCheck,
  Percent,
  Clock,
  Compass,
  ArrowRight,
  User,
  Sparkles,
  CheckCircle2,
  FileText,
  Layers,
  Banknote,
  Award,
} from "lucide-react";
import { VerticalKey } from "@/src/types/common";
import LuloStyleScrollExperience from "./LuloStyleScrollExperience";

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

  const slides = [
    {
      badge: "Planificación & Blindaje Patrimonial",
      title: "Somos expertos en planificación financiera,",
      highlight: "blindaje y protección de tu patrimonio.",
      subfeatures: [
        "Acceso estratégico a capital de trabajo, liquidez y factoring con +35 entidades",
        "Acompañamiento especializado, diagnóstico ágil y 0% pagos anticipados",
      ],
      primaryCta: "Conocer Soluciones",
      secondaryCta: "Agendar Asesoría",
      bgGradient: "from-sky-500 via-sky-600 to-blue-700",
      accentColor: "text-sky-200",
      image: "/assets/avatar-advisor-next.png?v=20261112",
      isDisneyAvatar: true,
      vertical: "credito" as VerticalKey,
    },
    {
      badge: "Seguros 360° Todo Riesgo",
      title: "¿Protección para tu auto, empresa o familia?",
      highlight: "Ahorra hasta un 50% con 35 aseguradoras.",
      subfeatures: [
        "Pólizas de salud, socios, vida, autos y cumplimiento empresarial",
        "Atención médica preferencial y asistencia 24/7 sin fricciones",
      ],
      primaryCta: "Cotizar Póliza",
      secondaryCta: "Hablar con Asesor",
      bgGradient: "from-sky-600 via-blue-600 to-indigo-700",
      accentColor: "text-cyan-200",
      image: "https://images.unsplash.com/photo-1450133064473-71024230f91b?w=600&auto=format&fit=crop&q=80",
      vertical: "seguros" as VerticalKey,
    },
    {
      badge: "Inversiones de Alto Rendimiento",
      title: "Haz crecer tus excedentes con seguridad.",
      highlight: "Rentabilidades anuales según el fondo.",
      subfeatures: [
        "Custodia fiduciaria vigilada y respaldo legal garantizado",
        "Abono periódico de rendimientos y diversificación inteligente",
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
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 pt-4 pb-0 font-sans text-slate-800">
      {/* Keyframe Animations */}
      <style>{`
        @keyframes nextAvatarFloat {
          0%, 100% {
            transform: translateY(0px) rotate(0deg) scale(1);
            filter: drop-shadow(0 16px 28px rgba(2, 132, 199, 0.45));
          }
          33% {
            transform: translateY(-9px) rotate(-1deg) scale(1.018);
            filter: drop-shadow(0 24px 38px rgba(56, 189, 248, 0.55));
          }
          66% {
            transform: translateY(-14px) rotate(1.2deg) scale(1.028);
            filter: drop-shadow(0 30px 45px rgba(2, 132, 199, 0.65));
          }
        }
        @keyframes nextAvatarAura {
          0%, 100% {
            opacity: 0.35;
            transform: scale(0.95);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.15);
          }
        }
        @keyframes nextBadgeBounce {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }
        .anim-avatar {
          animation: nextAvatarFloat 5s ease-in-out infinite;
          will-change: transform, filter;
        }
        .anim-avatar-aura {
          animation: nextAvatarAura 4s ease-in-out infinite;
          will-change: transform, opacity;
        }
        .anim-badge-float {
          animation: nextBadgeBounce 3.5s ease-in-out infinite;
        }
      `}</style>

      {/* 1. TOP HEADER APP-BAR: Minimalista & Elegante */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5 min-w-0">
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

          {/* User Portal Pill */}
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

      {/* 2. BARRA DE BÚSQUEDA RÁPIDA (Limpia y cómoda) */}
      <div className="relative mb-6">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-sky-500 absolute left-4 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar crédito empresarial, factoring, pólizas de seguros o inversiones..."
            className="w-full h-11 pl-11 pr-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:border-sky-300 focus:border-sky-500 focus:ring-3 focus:ring-sky-100 focus:outline-none text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 transition-all"
          />
        </div>
      </div>

      {/* 3. HERO BANNER: Músculo Financiero, Limpio & Sin Ruido Visual */}
      <div className="mb-8">
        <div
          className={`relative rounded-3xl overflow-hidden bg-gradient-to-br ${currentSlide.bgGradient} text-white shadow-xl shadow-sky-900/15 p-6 sm:p-8 transition-all duration-500 border border-sky-400/30`}
        >
          {/* Subtle Ambient Glow */}
          <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-sky-300/20 blur-3xl pointer-events-none" />
          <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-blue-400/15 blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-7 space-y-3.5">
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

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5 pt-2">
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

            {/* Right Side Visual Image: Avatar 3D Asesora */}
            <div className="md:col-span-5 hidden md:flex justify-end items-end relative min-h-[220px]">
              {(currentSlide as any).isDisneyAvatar ? (
                <div className="relative flex flex-col items-center">
                  <div className="absolute inset-0 -top-6 w-64 h-64 rounded-full bg-cyan-300/35 blur-2xl pointer-events-none anim-avatar-aura" />

                  <img
                    src={currentSlide.image}
                    alt="Asesora NEXT 3D"
                    className="w-64 lg:w-72 h-auto object-contain anim-avatar select-none pointer-events-none relative z-10 -mb-6 sm:-mb-8 transition-transform duration-500"
                  />

                  {/* Trust Pill Badge */}
                  <div className="absolute bottom-1 left-0 right-0 z-20 text-[10px] text-white font-bold bg-slate-900/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 shadow-xl flex items-center justify-center gap-1.5 whitespace-nowrap anim-badge-float">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Asesora VIP • Blindaje Patrimonial</span>
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
                    <Award className="w-3 h-3 text-cyan-300" />
                    <span>Acompañamiento 100% digital</span>
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

      {/* 4. FRANJA DE CONFIANZA & MÚSCULO FINANCIERO (Inspirado en Bancóldex y Lulo Bank) */}
      <div className="mb-8 p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center divide-y md:divide-y-0 md:divide-x divide-slate-100">
          <div className="flex flex-col items-center gap-1 p-2">
            <div className="w-9 h-9 rounded-full bg-sky-50 text-sky-600 border border-sky-100 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-sky-500" />
            </div>
            <span className="text-xs font-bold text-slate-900">0% Cobros Anticipados</span>
            <span className="text-[10px] text-slate-400">Estudio y asesoría sin costo previo</span>
          </div>

          <div className="flex flex-col items-center gap-1 p-2 pt-3 md:pt-2">
            <div className="w-9 h-9 rounded-full bg-sky-50 text-sky-600 border border-sky-100 flex items-center justify-center">
              <Compass className="w-4 h-4 text-sky-500" />
            </div>
            <span className="text-xs font-bold text-slate-900">+35 Entidades Aliadas</span>
            <span className="text-[10px] text-slate-400">Bancos, cooperativas y aseguradoras</span>
          </div>

          <div className="flex flex-col items-center gap-1 p-2 pt-3 md:pt-2">
            <div className="w-9 h-9 rounded-full bg-sky-50 text-sky-600 border border-sky-100 flex items-center justify-center">
              <Clock className="w-4 h-4 text-sky-500" />
            </div>
            <span className="text-xs font-bold text-slate-900">Viabilidad en 24h</span>
            <span className="text-[10px] text-slate-400">Diagnóstico financiero express</span>
          </div>

          <div className="flex flex-col items-center gap-1 p-2 pt-3 md:pt-2">
            <div className="w-9 h-9 rounded-full bg-sky-50 text-sky-600 border border-sky-100 flex items-center justify-center">
              <Percent className="w-4 h-4 text-sky-500" />
            </div>
            <span className="text-xs font-bold text-slate-900">Tasas Preferenciales</span>
            <span className="text-[10px] text-slate-400">Convenios y garantías institucionales</span>
          </div>
        </div>
      </div>

      {/* 5. EXPERIENCIA FULL-BLEED SCROLLYTELLING ESTILO LULO BANK (iPhone viajero 50/50 + 4 Tarjetas 3D en cascada + Órbita Ecosistema) */}
      <LuloStyleScrollExperience onSelectVertical={handleServiceClick} />
    </div>
  );
}