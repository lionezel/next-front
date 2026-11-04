"use client";

import React from "react";
import VerticalSwitcher from "@/src/components/layout/VerticalSwitcher";
import FitCatalog from "./FitCatalog";
import ClientsCarousel from "@/src/features/hub/ClientsCarousel";
import HeroBackgroundAnimation from "@/src/components/common/HeroBackgroundAnimation";
import {
  Dumbbell,
  Award,
  Truck,
  Zap,
  Sparkles,
  MessageCircle,
  Calendar,
  ShieldCheck,
  Flame,
} from "lucide-react";

export default function FitFeature() {
  return (
    <div className="min-h-screen">
      {/* Hero Header with Dynamic Amber/Orange Canvas */}
      <section className="relative overflow-hidden pt-10 pb-16 bg-gradient-to-b from-amber-50/80 via-white to-slate-50 border-b border-amber-100/80">
        <HeroBackgroundAnimation theme="fit" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <VerticalSwitcher currentVertical="fit" />

          {/* Prominent Next Update Banner with Glassmorphic Style */}
          <div className="max-w-3xl mx-auto my-2 p-5 rounded-3xl bg-white/95 border-2 border-amber-300 shadow-xl shadow-amber-500/10 backdrop-blur-xl space-y-3 text-left">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 text-white shrink-0 shadow-md shadow-orange-500/30">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 text-amber-950 border border-amber-300">
                    Línea Disponible
                  </span>
                  <h4 className="font-black text-sm text-slate-900">
                    Nutrición, Bienestar y Suplementación Deportiva
                  </h4>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed mt-1">
                  Explora nuestro <strong>catálogo de productos certificados</strong> o solicita asesoría personalizada y pedidos agendando tu cita directa.
                </p>
              </div>
            </div>

            <div className="pt-3 flex flex-wrap items-center gap-3 border-t border-slate-100">
              <a
                href="https://wa.me/573001234567?text=Hola,%20necesito%20asesor%C3%ADa%20personalizada%20sobre%20los%20Productos%20Fit"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 transition-all hover:scale-105 active:scale-95"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Pedir por WhatsApp</span>
              </a>

              <a
                href="#contacto"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black bg-amber-600 hover:bg-amber-700 text-white shadow-md shadow-amber-600/20 transition-all hover:scale-105 active:scale-95"
              >
                <Calendar className="w-4 h-4" />
                <span>Asesoría Nutricional Gratuita</span>
              </a>
            </div>
          </div>

          {/* Active Live Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/95 border border-amber-300 shadow-xs backdrop-blur-md text-xs font-bold text-amber-900 transition-all hover:scale-105">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
            </span>
            <Dumbbell className="w-3.5 h-3.5 text-amber-600" />
            <span>Vertical de Nutrición, Salud & Productos Fit</span>
            <span className="w-1 h-1 rounded-full bg-amber-300" />
            <span className="text-amber-700 font-extrabold">100% Calidad Certificada</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
            Máximo Rendimiento con{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-orange-600 to-red-500">
              Suplementación Certificada
            </span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
            Proteínas aisladas, creatinas de pureza farmacéutica, pre-entrenos y micronutrientes para elevar tu energía, potenciar tu masa muscular y proteger tu salud integral.
          </p>

          {/* High-Impact Metric Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto pt-4 text-left">
            <div className="p-3.5 rounded-2xl bg-white/90 border border-amber-200/90 shadow-xs backdrop-blur-md flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-600 shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wide">Registro INVIMA</div>
                <div className="text-sm font-black text-slate-900">100% Original & Certificado</div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/90 border border-amber-200/90 shadow-xs backdrop-blur-md flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/15 flex items-center justify-center text-orange-600 shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wide">Envíos Exprés</div>
                <div className="text-sm font-black text-slate-900">Cobertura a Todo Colombia</div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/90 border border-amber-200/90 shadow-xs backdrop-blur-md flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/15 flex items-center justify-center text-red-600 shrink-0">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wide">Asesoría Fit</div>
                <div className="text-sm font-black text-slate-900">Guía Nutricional Incluida</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Allies */}
      <ClientsCarousel
        category="fit"
        title="Nuestras Marcas y Aliados Fit"
        subtitle="Laboratorios líderes en nutrición deportiva y bienestar de alto desempeño."
      />

      {/* Interactive Catalog */}
      <FitCatalog />
    </div>
  );
}
