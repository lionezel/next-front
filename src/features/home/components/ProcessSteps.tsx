"use client";

import { MessageSquareText, Ruler, Scissors, Truck, ArrowRight } from "lucide-react";

export default function ProcessSteps() {
  const steps = [
    {
      number: "01",
      icon: MessageSquareText,
      title: "Asesoría & Cotización",
      desc: "Analizamos las necesidades de tu empresa, tipo de actividad, ambiente de trabajo y te asesoramos en las telas idóneas.",
    },
    {
      number: "02",
      icon: Ruler,
      title: "Muestra & Aprobación",
      desc: "Elaboramos la muestra física o digital con tu logotipo bordado/estampado y curva de tallaje para aprobación final.",
    },
    {
      number: "03",
      icon: Scissors,
      title: "Confección & Bordado",
      desc: "Producimos tus uniformes con costuras triples de seguridad y control de calidad prenda por prenda.",
    },
    {
      number: "04",
      icon: Truck,
      title: "Entrega Nacional",
      desc: "Despachamos el pedido embalado y rotulado por empleado/departamento directamente a tus sedes en cualquier ciudad.",
    },
  ];

  return (
    <section className="py-24 bg-slate-50 border-y border-slate-200/80">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-[#0F1D36] text-xs font-bold uppercase tracking-wider shadow-sm">
            <span>Proceso Simple y Confiable</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F1D36] tracking-tight">
            ¿Cómo Trabajamos con tu Empresa?
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            Hacemos que la dotación de tus colaboradores sea rápida, sin complicaciones y con total tranquilidad.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-7 border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative group"
            >
              {/* Step Number */}
              <div className="flex items-center justify-between mb-6">
                <div className="p-3.5 rounded-2xl bg-[#0F1D36] text-[#1B3A6B] group-hover:scale-110 transition-transform">
                  <step.icon size={24} />
                </div>
                <span className="text-3xl font-black text-slate-200 group-hover:text-[#1B3A6B] transition-colors">
                  {step.number}
                </span>
              </div>

              {/* Step Info */}
              <div className="space-y-2.5">
                <h3 className="text-lg font-bold text-slate-900">
                  {step.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {step.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-1 text-[11px] font-bold text-[#0F1D36] uppercase tracking-wider">
                <span>Paso {step.number}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
