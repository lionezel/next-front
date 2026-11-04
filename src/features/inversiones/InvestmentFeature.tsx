"use client";

import React from "react";
import VerticalSwitcher from "@/src/components/layout/VerticalSwitcher";
import InvestmentSimulator from "./InvestmentSimulator";
import InvestmentPortfolios from "./InvestmentPortfolios";
import ClientsCarousel from "@/src/features/hub/ClientsCarousel";
import HubContact from "@/src/features/hub/HubContact";
import HeroBackgroundAnimation from "@/src/components/common/HeroBackgroundAnimation";
import {
  TrendingUp,
  ShieldCheck,
  Clock,
  Award,
  Sparkles,
  MessageCircle,
  Calendar,
  ArrowRight,
  Percent,
  CheckCircle2,
} from "lucide-react";

export default function InvestmentFeature() {
  return (
    <div className="min-h-screen">
      {/* Hero Header with Dynamic Indigo/Violet Canvas */}
      <section className="relative overflow-hidden pt-10 pb-16 bg-gradient-to-b from-indigo-50/80 via-white to-slate-50 border-b border-indigo-100/80">
        <HeroBackgroundAnimation theme="inversiones" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <VerticalSwitcher currentVertical="inversiones" />

          {/* Prominent Next Update Banner with Glassmorphic Style */}
          <div className="max-w-3xl mx-auto my-2 p-5 rounded-3xl bg-white/95 border-2 border-indigo-300 shadow-xl shadow-indigo-500/10 backdrop-blur-xl space-y-3 text-left">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shrink-0 shadow-md shadow-indigo-500/30">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-gradient-to-r from-indigo-100 to-violet-100 text-indigo-900 border border-indigo-300">
                    Módulo Activo
                  </span>
                  <h4 className="font-black text-sm text-slate-900">
                    Portafolios de Alta Rentabilidad y Rendimientos
                  </h4>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed mt-1">
                  Explora nuestro <strong>simulador interactivo de rendimientos</strong> o agenda tu asesoría financiera personalizada directamente en nuestro calendario.
                </p>
              </div>
            </div>

            <div className="pt-3 flex flex-wrap items-center gap-3 border-t border-slate-100">
              <a
                href="https://wa.me/573001234567?text=Hola,%20necesito%20asesor%C3%ADa%20personalizada%20sobre%20el%20m%C3%B3dulo%20de%20Inversiones"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 transition-all hover:scale-105 active:scale-95"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Acceso Anticipado por WhatsApp</span>
              </a>

              <a
                href="#contacto"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 transition-all hover:scale-105 active:scale-95"
              >
                <Calendar className="w-4 h-4" />
                <span>Agendar Cita con Experto</span>
              </a>
            </div>
          </div>

          {/* Active Live Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/95 border border-indigo-300 shadow-xs backdrop-blur-md text-xs font-bold text-indigo-900 transition-all hover:scale-105">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
            </span>
            <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
            <span>Vertical de Inversiones & Rendimientos</span>
            <span className="w-1 h-1 rounded-full bg-indigo-300" />
            <span className="text-indigo-700 font-extrabold">Hasta 17.8% E.A.</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
            Rentabilidad Superior para{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 via-violet-600 to-indigo-500">
              Multiplicar tu Capital
            </span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
            Diversifica tu patrimonio en portafolios diseñados por expertos financieros. Disfruta de rendimientos periódicos, interés compuesto y respaldo institucional.
          </p>

          {/* High-Impact Metric Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto pt-4 text-left">
            <div className="p-3.5 rounded-2xl bg-white/90 border border-indigo-200/90 shadow-xs backdrop-blur-md flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/15 flex items-center justify-center text-indigo-600 shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wide">Rendimiento Anual</div>
                <div className="text-sm font-black text-slate-900">Hasta 17.8% E.A.</div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/90 border border-indigo-200/90 shadow-xs backdrop-blur-md flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-violet-500/15 flex items-center justify-center text-violet-600 shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wide">Liquidez</div>
                <div className="text-sm font-black text-slate-900">Abonos Periódicos</div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/90 border border-indigo-200/90 shadow-xs backdrop-blur-md flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/15 flex items-center justify-center text-indigo-600 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wide">Seguridad</div>
                <div className="text-sm font-black text-slate-900">Custodia Institucional</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Allies */}
      <ClientsCarousel
        category="inversiones"
        title="Nuestros Aliados en Inversiones"
        subtitle="Comisionistas, fondos y plataformas aliadas para rentabilizar tu capital."
      />

      {/* Interactive Simulator */}
      <InvestmentSimulator />

      {/* Portfolios */}
      <InvestmentPortfolios />

      {/* Appointment & Contact */}
      <HubContact />
    </div>
  );
}
