"use client";

import React, { useState, useEffect } from "react";
import {
  Coins,
  TrendingUp,
  ShieldCheck,
  Dumbbell,
  ArrowRight,
  CheckCircle2,
  Layers,
  ChevronRight,
} from "lucide-react";
import { VERTICALS_CONFIG } from "@/src/config/verticals";
import { VerticalKey } from "@/src/types/common";
import VerticalInfoModal from "@/src/components/common/VerticalInfoModal";

export default function VerticalsGrid() {
  const [selectedVertical, setSelectedVertical] = useState<VerticalKey | null>(null);

  useEffect(() => {
    const handleOpenModal = (e: any) => {
      if (e.detail?.vertical) {
        setSelectedVertical(e.detail.vertical);
      }
    };

    window.addEventListener("open-vertical-modal", handleOpenModal);

    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const v = params.get("vertical") as VerticalKey;
      if (v && VERTICALS_CONFIG[v]) {
        setSelectedVertical(v);
      }
    }

    return () => {
      window.removeEventListener("open-vertical-modal", handleOpenModal);
    };
  }, []);

  const cards = [
    {
      key: "credito" as VerticalKey,
      config: VERTICALS_CONFIG.credito,
      icon: Coins,
      title: "Crédito & Financiación",
      tagline: "Liquidez y libre inversión",
      rate: "Desde 1.2% M.V.",
      highlights: [
        "Desembolso ágil en 24 horas",
        "Plazos flexibles de 6 a 72 meses",
      ],
      iconBg: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
      badgeBg: "bg-emerald-50 text-emerald-800 border-emerald-200",
    },
    {
      key: "inversiones" as VerticalKey,
      config: VERTICALS_CONFIG.inversiones,
      icon: TrendingUp,
      title: "Inversiones & Rentabilidad",
      tagline: "Multiplica tu capital de forma segura",
      rate: "Hasta 17.8% E.A.",
      highlights: [
        "Portafolios diversificados y custodia",
        "Rendimientos fijos y proyectados",
      ],
      iconBg: "bg-indigo-50 text-indigo-700 border-indigo-200/80",
      badgeBg: "bg-indigo-50 text-indigo-800 border-indigo-200",
    },
    {
      key: "seguros" as VerticalKey,
      config: VERTICALS_CONFIG.seguros,
      icon: ShieldCheck,
      title: "Seguros & Coberturas 360°",
      tagline: "Protección integral para ti y tu familia",
      rate: "Cobertura 24/7",
      highlights: [
        "Salud, vida, vehículos y empresas",
        "Asistencia inmediata en siniestros",
      ],
      iconBg: "bg-sky-50 text-sky-700 border-sky-200/80",
      badgeBg: "bg-sky-50 text-sky-800 border-sky-200",
    },
    {
      key: "fit" as VerticalKey,
      config: VERTICALS_CONFIG.fit,
      icon: Dumbbell,
      title: "Nutrición & Productos Fit",
      tagline: "Bienestar y nutrición deportiva",
      rate: "100% Certificado",
      highlights: [
        "Proteínas aisladas y suplementación",
        "Asesoría nutricional personalizada",
      ],
      iconBg: "bg-amber-50 text-amber-700 border-amber-200/80",
      badgeBg: "bg-amber-50 text-amber-800 border-amber-200",
    },
  ];

  const handleCloseModal = () => {
    setSelectedVertical(null);
    if (typeof window !== "undefined" && window.location.search) {
      window.history.replaceState({}, "", window.location.pathname);
    }
  };

  const handleBookFromModal = (verticalKey: VerticalKey) => {
    handleCloseModal();
    window.location.href = `/citas?specialty=${verticalKey}`;
  };

  return (
    <section id="pilares" className="py-6 sm:py-16 md:py-20 bg-slate-50/50 relative overflow-hidden border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header: Sober & Institutional */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-5 sm:mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white border border-slate-200 text-[11px] font-bold text-slate-700 mb-1.5 shadow-2xs">
              <Layers className="w-3.5 h-3.5 text-slate-500" />
              <span>Portafolio de Soluciones</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Tus Soluciones y Productos
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Conoce en detalle cada área de financiación, inversión, protección y bienestar.
            </p>
          </div>

          <a
            href="/citas"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 hover:text-slate-700"
          >
            <span>Pedir cita con un asesor</span>
            <ChevronRight className="w-4 h-4" />
          </a>
        </div>

        {/* ============================================================== */}
        {/* MOBILE CARDS (sm:hidden) — COMPACT & SOBER LIST */}
        {/* ============================================================== */}
        <div className="sm:hidden space-y-2.5">
          {cards.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.key}
                role="button"
                tabIndex={0}
                onClick={() => setSelectedVertical(item.key)}
                className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs active:scale-[0.98] transition-transform flex items-center justify-between gap-3 text-left"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border shadow-2xs ${item.iconBg}`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <h3 className="font-extrabold text-xs text-slate-900 truncate">
                        {item.title}
                      </h3>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate">
                      {item.tagline}
                    </p>
                    <span className="inline-block mt-1 text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/60">
                      {item.rate}
                    </span>
                  </div>
                </div>

                <div className="w-7 h-7 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 shrink-0">
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>

        {/* ============================================================== */}
        {/* TABLET / DESKTOP GRID (hidden sm:grid) */}
        {/* ============================================================== */}
        <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.key}
                role="button"
                tabIndex={0}
                onClick={() => setSelectedVertical(item.key)}
                className="rounded-2xl bg-white border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all p-5 flex flex-col justify-between cursor-pointer group shadow-2xs"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${item.iconBg}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${item.badgeBg}`}>
                      {item.rate}
                    </span>
                  </div>

                  <h3 className="font-black text-sm text-slate-900 group-hover:text-slate-700 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {item.tagline}
                  </p>

                  <div className="space-y-1 pt-3 mt-3 border-t border-slate-100">
                    {item.highlights.map((h, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-[11px] text-slate-600 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate">{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 mt-3 flex items-center justify-between text-xs font-bold text-slate-900 group-hover:text-slate-700">
                  <span>Ver detalles</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Information Modal */}
      <VerticalInfoModal
        verticalKey={selectedVertical}
        onClose={handleCloseModal}
        onBookAppointment={handleBookFromModal}
      />
    </section>
  );
}
