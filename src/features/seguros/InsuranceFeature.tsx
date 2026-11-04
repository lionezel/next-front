"use client";

import React from "react";
import VerticalSwitcher from "@/src/components/layout/VerticalSwitcher";
import InsuranceQuoter from "./InsuranceQuoter";
import InsurancePlans from "./InsurancePlans";
import ClientsCarousel from "@/src/features/hub/ClientsCarousel";
import HubContact from "@/src/features/hub/HubContact";
import HeroBackgroundAnimation from "@/src/components/common/HeroBackgroundAnimation";
import {
  ShieldCheck,
  Heart,
  Clock,
  Sparkles,
  MessageCircle,
  Calendar,
  CheckCircle2,
  Car,
  Home,
  UserCheck,
} from "lucide-react";

export default function InsuranceFeature() {
  return (
    <div className="min-h-screen">
      {/* Hero Header with Dynamic Sky/Cyan Canvas */}
      <section className="relative overflow-hidden pt-10 pb-16 bg-gradient-to-b from-sky-50/80 via-white to-slate-50 border-b border-sky-100/80">
        <HeroBackgroundAnimation theme="seguros" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <VerticalSwitcher currentVertical="seguros" />

          {/* Prominent Next Update Banner with Glassmorphic Style */}
          <div className="max-w-3xl mx-auto my-2 p-5 rounded-3xl bg-white/95 border-2 border-sky-300 shadow-xl shadow-sky-500/10 backdrop-blur-xl space-y-3 text-left">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-sky-600 to-blue-600 text-white shrink-0 shadow-md shadow-sky-500/30">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-gradient-to-r from-sky-100 to-blue-100 text-sky-900 border border-sky-300">
                    Módulo Activo
                  </span>
                  <h4 className="font-black text-sm text-slate-900">
                    Pólizas Integrales y Coberturas 360°
                  </h4>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed mt-1">
                  Explora nuestro <strong>cotizador en tiempo real</strong> o consulta coberturas personalizadas con un asesor experto agendando tu cita.
                </p>
              </div>
            </div>

            <div className="pt-3 flex flex-wrap items-center gap-3 border-t border-slate-100">
              <a
                href="https://wa.me/573001234567?text=Hola,%20necesito%20asesor%C3%ADa%20personalizada%20sobre%20el%20m%C3%B3dulo%20de%20Seguros"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 transition-all hover:scale-105 active:scale-95"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Consultar por WhatsApp</span>
              </a>

              <a
                href="#contacto"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black bg-sky-600 hover:bg-sky-700 text-white shadow-md shadow-sky-600/20 transition-all hover:scale-105 active:scale-95"
              >
                <Calendar className="w-4 h-4" />
                <span>Agendar Asesoría Gratuita</span>
              </a>
            </div>
          </div>

          {/* Active Live Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/95 border border-sky-300 shadow-xs backdrop-blur-md text-xs font-bold text-sky-900 transition-all hover:scale-105">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500" />
            </span>
            <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
            <span>Vertical de Seguros & Pólizas Integrales</span>
            <span className="w-1 h-1 rounded-full bg-sky-300" />
            <span className="text-sky-700 font-extrabold">Cobertura 24/7 Total</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
            Protección Absoluta para{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-blue-600 to-cyan-600">
              Lo que Más Valoras
            </span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
            Pólizas de salud, vida, autos y hogar con respaldo de las mejores aseguradoras del país. Asistencia médica y mecánica 24/7 con gestión 100% digital.
          </p>

          {/* High-Impact Metric Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto pt-4 text-left">
            <div className="p-3.5 rounded-2xl bg-white/90 border border-sky-200/90 shadow-xs backdrop-blur-md flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/15 flex items-center justify-center text-sky-600 shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wide">Emisión Rápida</div>
                <div className="text-sm font-black text-slate-900">Digital en 10 Minutos</div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/90 border border-sky-200/90 shadow-xs backdrop-blur-md flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/15 flex items-center justify-center text-blue-600 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wide">Asistencia Total</div>
                <div className="text-sm font-black text-slate-900">24 Horas / 365 Días</div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/90 border border-sky-200/90 shadow-xs backdrop-blur-md flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/15 flex items-center justify-center text-cyan-600 shrink-0">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wide">Red Médica</div>
                <div className="text-sm font-black text-slate-900">Cobertura a Nivel Nacional</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Allies */}
      <ClientsCarousel
        category="seguros"
        title="Nuestros Aliados en Aseguramiento"
        subtitle="Las compañías aseguradoras más prestigiosas y solventes de Colombia."
      />

      {/* Interactive Quoter */}
      <InsuranceQuoter />

      {/* Plans */}
      <InsurancePlans />

      {/* Contact & Appointment */}
      <HubContact />
    </div>
  );
}
