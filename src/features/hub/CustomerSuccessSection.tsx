"use client";

import React from "react";
import { Star, Quote, CheckCircle2, Building, UserCheck } from "lucide-react";

export default function CustomerSuccessSection() {
  const testimonials = [
    {
      name: "Carlos Mario Restrepo",
      role: "Empresario Sector Textil (Medellín)",
      category: "Crédito Comercial & PyME",
      rating: 5,
      content:
        "Necesitábamos capital de trabajo urgente para una orden de producción grande. Los bancos tradicionales nos pedían semanas de papeles. Con Next Connection Group estructuramos el expediente y obtuvimos $65M COP desembolsados en menos de 24 horas a una tasa excelente.",
      result: "Desembolso en 24h para expansión de negocio",
    },
    {
      name: "Dra. Valentina Morales",
      role: "Médica Especialista & Madre de Familia",
      category: "Póliza de Salud & Vida Integral",
      rating: 5,
      content:
        "Compararon por mí más de 6 opciones de salud para mi núcleo familiar. Conseguimos una póliza de alta complejidad con Sura con mejor cobertura y pagando casi un 25% menos de lo que me cotizaban de forma individual. La atención fue impecable.",
      result: "Ahorro del 25% con cobertura médica VIP",
    },
    {
      name: "Alejandro Gómez Henao",
      role: "Gerente de Operaciones Logísticas",
      category: "Pólizas Colectivas & Responsabilidad Civil",
      rating: 5,
      content:
        "Tuvimos un siniestro en carretera con una carga transportada. Lo que suele ser un dolor de cabeza, el equipo de Next Connection lo resolvió radicando el reclamo y gestionando la liquidación de la indemnización con la aseguradora sin complicaciones.",
      result: "Acompañamiento efectivo y pago total del siniestro",
    },
  ];

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-slate-50/70 border-b border-slate-200/90 relative">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-8 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-bold text-slate-700 shadow-2xs">
            <UserCheck className="w-4 h-4 text-sky-500" />
            <span>Casos de Éxito Reales</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
            Historias de clientes respaldados por Next Connection
          </h2>
          <p className="text-xs sm:text-base text-slate-600 leading-relaxed">
            Más de 5,000 familias y empresas en Colombia confían en nuestro acompañamiento financiero y asegurador para tomar decisiones certeras.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {testimonials.map((item, idx) => (
            <div
              key={idx}
              className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Rating & Category */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-full">
                    {item.category}
                  </span>
                </div>

                {/* Quote */}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic">
                  "{item.content}"
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 space-y-2">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-100">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                  <span>{item.result}</span>
                </div>

                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                    {item.name}
                  </h4>
                  <p className="text-[11px] text-slate-400 font-medium">
                    {item.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
