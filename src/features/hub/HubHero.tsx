"use client";

import React from "react";
import {
  Coins,
  TrendingUp,
  ShieldCheck,
  Dumbbell,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Sparkles,
  ChevronRight,
  Clock,
  Shield,
} from "lucide-react";
import HeroBackgroundAnimation from "@/src/components/common/HeroBackgroundAnimation";

export default function HubHero() {
  const services = [
    {
      key: "credito",
      title: "Crédito & Financiación",
      tagline: "Liquidez y libre inversión",
      rate: "Desde 1.2% M.V.",
      icon: Coins,
      highlights: [
        "Desembolso en 24 horas",
        "Plazos cómodos de 6 a 72 meses",
        "Sin cobros ocultos ni letra pequeña",
      ],
      iconBg: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
      badgeBg: "bg-emerald-50 text-emerald-800 border-emerald-200",
    },
    {
      key: "inversiones",
      title: "Inversiones & Rentabilidad",
      tagline: "Multiplica tu capital de forma segura",
      rate: "Hasta 17.8% E.A.",
      icon: TrendingUp,
      highlights: [
        "Portafolios diversificados de alto retorno",
        "Custodia y respaldo legal verificado",
        "Abono periódico de utilidades",
      ],
      iconBg: "bg-indigo-50 text-indigo-700 border-indigo-200/80",
      badgeBg: "bg-indigo-50 text-indigo-800 border-indigo-200",
    },
    {
      key: "seguros",
      title: "Seguros & Coberturas 360°",
      tagline: "Protección integral para tu familia",
      rate: "Cobertura 24/7",
      icon: ShieldCheck,
      highlights: [
        "Pólizas de salud, vida, autos y hogar",
        "Asistencia inmediata ante siniestros",
        "Tarifas preferenciales por convenio",
      ],
      iconBg: "bg-sky-50 text-sky-700 border-sky-200/80",
      badgeBg: "bg-sky-50 text-sky-800 border-sky-200",
    },
    {
      key: "fit",
      title: "Nutrición & Productos Fit",
      tagline: "Bienestar y nutrición deportiva",
      rate: "100% Certificado",
      icon: Dumbbell,
      highlights: [
        "Proteínas puras, creatinas y vitaminas",
        "20% OFF permanente para miembros",
        "Asesoría nutricional personalizada",
      ],
      iconBg: "bg-amber-50 text-amber-700 border-amber-200/80",
      badgeBg: "bg-amber-50 text-amber-800 border-amber-200",
    },
  ];

  const handleBookService = (serviceKey: string) => {
    window.dispatchEvent(
      new CustomEvent("set-appointment-specialty", {
        detail: { specialty: serviceKey },
      })
    );
  };

  const handleOpenModal = (serviceKey: string) => {
    window.dispatchEvent(
      new CustomEvent("open-vertical-modal", {
        detail: { vertical: serviceKey },
      })
    );
  };

  const scrollToAppointments = () => {
    const el = document.getElementById("agendar-cita");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative overflow-hidden pt-6 pb-10 sm:pt-12 sm:pb-16 bg-gradient-to-b from-slate-50/60 via-white to-slate-50/40 border-b border-slate-200/80">
      <div className="opacity-30">
        <HeroBackgroundAnimation theme="hub" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Simple, Punchy Header — Zero walls of text */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-2xs">
            <Shield className="w-3.5 h-3.5 text-slate-500" />
            <span>Next Connection Group</span>
            <span className="w-1 h-1 rounded-full bg-slate-300" />
            <span className="text-emerald-700 font-bold">Asesoría Directa</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Asesoría Personalizada en Crédito, Inversiones, Seguros y Bienestar
          </h1>

          <p className="text-xs sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
            Conoce nuestras soluciones y agenda tu cita 1 a 1 por <strong>Google Meet</strong> o en nuestras sedes de Bogotá, Medellín y Cali.
          </p>

          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={scrollToAppointments}
              className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-xs transition-all flex items-center gap-2 active:scale-95"
            >
              <Calendar className="w-4 h-4 text-emerald-400" />
              <span>Agendar mi Cita</span>
              <ArrowRight className="w-4 h-4 opacity-70" />
            </button>
          </div>
        </div>

        {/* The 4 Core Service Cards — Direct, Informative, With Instant Appointment Booking */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {services.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.key}
                className="rounded-2xl bg-white border border-slate-200/90 hover:border-slate-300 shadow-2xs hover:shadow-md transition-all p-4 sm:p-5 flex flex-col justify-between"
              >
                <div>
                  {/* Top: Icon + Rate Badge */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shadow-2xs ${item.iconBg}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shadow-2xs ${item.badgeBg}`}>
                      {item.rate}
                    </span>
                  </div>

                  {/* Title & Tagline */}
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900 tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                    {item.tagline}
                  </p>

                  {/* Clear Bullet Points */}
                  <div className="space-y-1.5 pt-3 mt-3 border-t border-slate-100">
                    {item.highlights.map((h, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-xs text-slate-700 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="leading-snug">{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Actions: Agendar Cita (Primary) + Ver Detalles (Secondary) */}
                <div className="pt-4 mt-4 border-t border-slate-100 space-y-2">
                  <button
                    type="button"
                    onClick={() => handleBookService(item.key)}
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs transition-all active:scale-95"
                  >
                    <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Agendar Cita</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenModal(item.key)}
                    className="w-full text-center text-[11px] font-bold text-slate-500 hover:text-slate-900 transition-colors py-1 flex items-center justify-center gap-1"
                  >
                    <span>Ver requisitos y líneas</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
