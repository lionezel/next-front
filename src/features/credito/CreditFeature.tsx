"use client";

import React from "react";
import VerticalSwitcher from "@/src/components/layout/VerticalSwitcher";
import CreditSimulator from "./CreditSimulator";
import CreditTypes from "./CreditTypes";
import ClientsCarousel from "@/src/features/hub/ClientsCarousel";
import HubContact from "@/src/features/hub/HubContact";
import VoiceAssistant from "@/src/components/common/VoiceAssistant";
import HeroBackgroundAnimation from "@/src/components/common/HeroBackgroundAnimation";
import { Coins, Clock, ShieldCheck, Zap, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";

export default function CreditFeature() {
  return (
    <div className="min-h-screen">
      {/* Hero Header with Dynamic Emerald Canvas */}
      <section className="relative overflow-hidden pt-10 pb-16 bg-gradient-to-b from-emerald-50/80 via-white to-slate-50 border-b border-emerald-100/80">
        <HeroBackgroundAnimation theme="credito" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <VerticalSwitcher currentVertical="credito" />

          {/* Active Live Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/95 border border-emerald-300 shadow-xs backdrop-blur-md text-xs font-bold text-emerald-900 transition-all hover:scale-105">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <Coins className="w-3.5 h-3.5 text-emerald-600" />
            <span>Vertical de Crédito & Financiación Digital</span>
            <span className="w-1 h-1 rounded-full bg-emerald-300" />
            <span className="text-emerald-700 font-extrabold">Desembolso en 24h</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
            Liquidez Inmediata con{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500">
              Aprobación 100% Digital
            </span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
            Financia tus metas personales o empresariales con desembolso en 24 horas, tasas preferenciales desde <strong>1.2% M.V.</strong> y plazos flexibles hasta 72 meses.
          </p>

          {/* Eye-catching CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <a
              href="#simulador"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold text-sm hover:from-emerald-500 hover:to-teal-500 transition-all shadow-lg shadow-emerald-500/25 hover:scale-105 active:scale-95"
            >
              <Coins className="w-4 h-4" />
              <span>Simular mi Cuota Ahora</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </a>

            <a
              href="/credito/bancos"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 text-emerald-400 font-bold text-xs sm:text-sm hover:bg-slate-800 transition-all shadow-md border border-emerald-500/40 hover:scale-105 active:scale-95 group"
            >
              <Zap className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform animate-pulse" />
              <span>Gestor Bancario & Auto-Llenado con IA</span>
              <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            </a>
          </div>

          {/* High-Impact Metric Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto pt-4 text-left">
            <div className="p-3.5 rounded-2xl bg-white/90 border border-emerald-200/90 shadow-xs backdrop-blur-md flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-600 shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wide">Tiempo Récord</div>
                <div className="text-sm font-black text-slate-900">Desembolso en 24h</div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/90 border border-emerald-200/90 shadow-xs backdrop-blur-md flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500/15 flex items-center justify-center text-teal-600 shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wide">Estudio Gratuito</div>
                <div className="text-sm font-black text-slate-900">100% en Línea Sin Filas</div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/90 border border-emerald-200/90 shadow-xs backdrop-blur-md flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-600 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wide">Transparencia</div>
                <div className="text-sm font-black text-slate-900">Cero Letras Pequeñas</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Allies */}
      <ClientsCarousel
        category="credito"
        title="Nuestros Bancos y Aliados Financieros"
        subtitle="Entidades vigiladas y aliados estratégicos para la aprobación de tu crédito."
      />

      {/* Interactive Simulator */}
      <CreditSimulator />

      {/* Types of credit */}
      <CreditTypes />

      {/* Appointment & Direct Advisory Section */}
      <HubContact />

      {/* AI Voice Assistant — Nova */}
      <VoiceAssistant />
    </div>
  );
}
