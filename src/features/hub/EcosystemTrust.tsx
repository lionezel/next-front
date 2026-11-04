"use client";

import React from "react";
import {
  ShieldCheck,
  Zap,
  Users,
  Award,
  Layers,
  CheckCircle2,
} from "lucide-react";

export default function EcosystemTrust() {
  const stats = [
    { value: "+15,000", label: "Usuarios y Clientes Satisfechos", icon: Users },
    { value: "$42,000M+", label: "Capital Financiado e Invertido", icon: Award },
    { value: "99.4%", label: "Tasa de Satisfacción y Soporte", icon: ShieldCheck },
    { value: "24h", label: "Tiempo Máximo de Respuesta Digital", icon: Zap },
  ];

  const pillars = [
    {
      title: "Interconexión Total",
      desc: "Gestiona tu crédito, tus inversiones, tus seguros familiares y tus compras fit bajo una única identidad digital segura.",
    },
    {
      title: "Respaldo y Transparencia",
      desc: "Contratos claros, sin letras pequeñas ni cobros ocultos. Toda la información de tasas y rendimientos está a la vista.",
    },
    {
      title: "Seguridad Institucional",
      desc: "Arquitectura de alta velocidad con encriptación TLS 1.3, bases de datos auditadas y panel de control centralizado.",
    },
  ];

  return (
    <section className="py-10 sm:py-16 md:py-20 bg-slate-50/70 border-b border-slate-200/90 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        {/* Stats Grid: Symmetrical Institutional KPIs, Compact on Mobile */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-6 mb-8 sm:mb-14">
          {stats.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-3.5 sm:p-5 rounded-2xl bg-white border border-slate-200/90 text-center space-y-1 sm:space-y-1.5 shadow-2xs hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group"
              >
                <div className="w-9 h-9 sm:w-11 sm:h-11 mx-auto rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-800 mb-1.5 sm:mb-2 shadow-2xs group-hover:scale-105 transition-all">
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="text-lg sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
                  {item.value}
                </div>
                <div className="text-[10px] sm:text-xs text-slate-500 font-medium leading-tight">
                  {item.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* Why Grupo Next */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 lg:gap-12 items-center">
          <div className="lg:col-span-5 space-y-2.5 sm:space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 text-[11px] sm:text-xs font-semibold text-slate-700 shadow-2xs">
              <Layers className="w-3.5 h-3.5 text-slate-500" />
              <span>Plataforma Todo en Uno</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              ¿Por qué elegir el Ecosistema Next Connection Group?
            </h2>
            <p className="text-xs sm:text-base text-slate-600 leading-relaxed font-normal">
              Tradicionalmente debías acudir a un banco para crédito, a una fiduciaria para invertir, a una aseguradora para tus pólizas y a diversas tiendas para tu bienestar. En <strong>Next Connection Group</strong> unificamos todas tus necesidades en un solo lugar con soporte continuo y procesos 100% digitales.
            </p>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
            {pillars.map((p, idx) => (
              <div
                key={idx}
                className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 space-y-2 shadow-2xs hover:border-slate-300 hover:shadow-md transition-all"
              >
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900">{p.title}</h3>
                <p className="text-[11px] sm:text-xs text-slate-500 leading-relaxed font-normal">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
