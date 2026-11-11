"use client";

import React from "react";
import {
  Check,
  X,
  Sparkles,
  ShieldCheck,
  Layers,
  ArrowRight,
  TrendingUp,
  Clock,
  HeartHandshake,
  BadgePercent,
  CheckCircle2,
} from "lucide-react";

export default function ValueComparisonSection() {
  const comparisonRows = [
    {
      aspect: "Opciones de Comparación",
      traditional: "Solo te ofrecen el producto de su propio banco o aseguradora.",
      nextConnection: "Comparamos simultáneamente más de 35 aseguradoras y bancos líderes.",
      badge: "Multimarca",
    },
    {
      aspect: "Costo de la Asesoría",
      traditional: "Suelen cobrar comisiones de intermediación o estudio ocultas.",
      nextConnection: "100% gratuita para ti. Nuestras tarifas son directas o preferenciales.",
      badge: "$0 Costo",
    },
    {
      aspect: "Acompañamiento en Siniestros",
      traditional: "Quedas solo llamando a call centers y esperando meses de respuesta.",
      nextConnection: "Defendemos tus derechos y gestionamos la reclamación punto a punto.",
      badge: "Soporte VIP",
    },
    {
      aspect: "Tiempo y Tramitología",
      traditional: "Filas presenciales, copias autenticadas y semanas de espera.",
      nextConnection: "Radicación 100% digital, firma electrónica y respuesta en 24h.",
      badge: "Agilidad",
    },
    {
      aspect: "Ecosistema Centralizado",
      traditional: "Tus créditos en un lado, seguros en otro y tus compras dispersas.",
      nextConnection: "Un único portal web donde ves tus pólizas, créditos y documentos.",
      badge: "Todo en Uno",
    },
  ];

  const handleOpenAppointment = () => {
    const el = document.getElementById("agenda-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-slate-50/60 border-b border-slate-200/90 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-8 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-bold text-slate-700 shadow-2xs">
            <HeartHandshake className="w-4 h-4 text-sky-500" />
            <span>Transparencia y Valor Agregado</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
            ¿Por qué hacer las cosas con Next Connection Group?
          </h2>
          <p className="text-xs sm:text-base text-slate-600 leading-relaxed">
            Descubre por qué miles de personas y empresas eligen gestionar sus créditos, pólizas e inversiones a través de nuestro ecosistema en lugar de ir directamente a una entidad tradicional.
          </p>
        </div>

        {/* Comparison Table / Cards */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-8 sm:mb-12">
          {/* Header Row */}
          <div className="grid grid-cols-1 md:grid-cols-12 bg-slate-100/80 border-b border-slate-200 text-xs font-black uppercase tracking-wider text-slate-700">
            <div className="hidden md:block md:col-span-4 p-4 text-slate-500">
              Aspecto Clave
            </div>
            <div className="hidden md:block md:col-span-4 p-4 text-slate-500 text-center">
              Ventanilla Tradicional
            </div>
            <div className="hidden md:block md:col-span-4 p-4 bg-sky-50/80 text-sky-900 text-center border-l border-sky-100">
              Con Next Connection Group
            </div>
          </div>

          {/* Body Rows */}
          <div className="divide-y divide-slate-100">
            {comparisonRows.map((row, idx) => (
              <div
                key={idx}
                className="grid grid-cols-1 md:grid-cols-12 items-center hover:bg-slate-50/60 transition-colors p-4 sm:p-5 md:p-0"
              >
                {/* Aspect Label */}
                <div className="md:col-span-4 md:p-5 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-bold text-slate-900">
                      {row.aspect}
                    </span>
                    <span className="md:hidden text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {row.badge}
                    </span>
                  </div>
                </div>

                {/* Traditional Entity */}
                <div className="md:col-span-4 md:p-5 flex items-start gap-2.5 text-xs text-slate-500 mt-2 md:mt-0">
                  <div className="w-5 h-5 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center shrink-0 mt-0.5">
                    <X className="w-3 h-3" />
                  </div>
                  <div>
                    <span className="md:hidden font-bold text-slate-400 block text-[10px] uppercase">
                      Tradicional:
                    </span>
                    <span>{row.traditional}</span>
                  </div>
                </div>

                {/* Next Connection Group */}
                <div className="md:col-span-4 md:p-5 md:border-l md:border-sky-100 bg-sky-50/30 flex items-start gap-2.5 text-xs text-slate-800 font-medium mt-3 md:mt-0 p-3 rounded-xl md:rounded-none">
                  <div className="w-5 h-5 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="md:hidden font-bold text-sky-700 block text-[10px] uppercase">
                      Con Next Connection:
                    </span>
                    <span className="text-sky-950 font-semibold">{row.nextConnection}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3 Pillars of Confidence Inspired by Goque Group */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100 text-sky-600 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              Asesoría 100% Imparcial
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              No estamos casados con una sola marca. Nuestro deber es buscar la opción que más te convenga a ti en cobertura y tasa real.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100 text-sky-600 flex items-center justify-center font-bold">
              <BadgePercent className="w-5 h-5" />
            </div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              Poder de Negociación por Volumen
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Al canalizar miles de pólizas y solicitudes, conseguimos primas especiales y condiciones que un usuario particular no puede obtener solo.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100 text-sky-600 flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              Respuesta en Menos de 24h
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Olvídate de esperar semanas. Radicamos directamente con ejecutivos corporativos para agilizar tus desembolsos y emisiones.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
