"use client";

import {
  ShieldCheck,
  Truck,
  Award,
  Users2,
  Check,
  CheckCircle2,
  Building2,
  Clock,
  Sparkles,
} from "lucide-react";
import { COMPANY_INFO } from "@/src/data/uniforms-data";

export default function WhyChooseDistripako() {
  const stats = [
    { value: COMPANY_INFO.experienceYears, label: "Años de Experiencia", sub: "Trayectoria en el sector textil" },
    { value: COMPANY_INFO.deliveredUniforms, label: "Prendas Confeccionadas", sub: "Entregas a nivel nacional" },
    { value: COMPANY_INFO.satisfiedClients, label: "Empresas Clientes", sub: "Industria, salud y alimentos" },
    { value: "100%", label: "Garantía Textil", sub: "Reemplazo ante fallas de confección" },
  ];

  const reasons = [
    {
      title: "Muestras Físicas para Aprobación",
      desc: "Enviamos muestras de telas y prendas físicas a tu departamento de compras para que verifiquen calidad y tallaje antes de fabricar.",
    },
    {
      title: "Puntualidad en Fechas de Entrega",
      desc: "Entendemos la importancia de cumplir con los ciclos legales y programados de dotación de tu empresa.",
    },
    {
      title: "Embalaje Rotulado y Organizado",
      desc: "Entregamos cada dotación individualmente marcada con el nombre y cargo de cada empleado para facilitar la distribución interna.",
    },
    {
      title: "Asesoría en Normatividad Laboral y EPP",
      desc: "Te guiamos para elegir las telas adecuadas según los riesgos de seguridad y normatividad vigente.",
    },
  ];

  return (
    <section id="nosotros" className="py-24 bg-white scroll-mt-20 border-b border-slate-100">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Top Stats Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-slate-50 border border-slate-200 text-center space-y-1 hover:border-[#1B3A6B] transition-colors"
            >
              <p className="text-3xl sm:text-4xl font-black text-slate-900">
                {stat.value}
              </p>
              <p className="text-sm font-bold text-slate-800">
                {stat.label}
              </p>
              <p className="text-[11px] text-slate-500">
                {stat.sub}
              </p>
            </div>
          ))}
        </div>

        {/* Value Proposition Main Banner */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-slate-800 text-xs font-bold uppercase tracking-wider">
              <Award size={14} className="text-[#1B3A6B]" />
              <span>Diferenciadores Distripako</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Tu Aliado Estratégico en Dotación y Vestuario Laboral
            </h2>

            <p className="text-slate-600 text-base leading-relaxed">
              No solo vendemos prendas: asesoramos a las empresas colombianas para que su equipo de trabajo cuente con uniformes resistentes, confortables y con una imagen que resalta el valor de su marca.
            </p>

            <div className="space-y-4 pt-2">
              {reasons.map((reason, idx) => (
                <div key={idx} className="flex gap-4 items-start">
                  <div className="p-1 rounded-full bg-amber-50 text-[#1B3A6B] border border-amber-200 mt-1 shrink-0">
                    <Check size={14} strokeWidth={3} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      {reason.title}
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed mt-0.5">
                      {reason.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Callout Box (Clean White) */}
          <div className="lg:col-span-6">
            <div className="rounded-3xl bg-slate-50 text-slate-900 border-2 border-slate-200 p-8 sm:p-10 shadow-lg relative overflow-hidden space-y-6">
              <div className="space-y-2">
                <span className="text-xs uppercase font-extrabold tracking-widest text-[#1B3A6B]">
                  Atención Corporativa & Licitaciones
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  ¿Tienes un pedido para más de 100 colaboradores?
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Ofrecemos visitas técnicas de tallaje en sitio, tarifas de confección mayorista y muestras físicas sin costo para comités de compras.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-[#1B3A6B]" />
                  <span>Facturación electrónica con RUT y parafiscales al día</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-[#1B3A6B]" />
                  <span>Crédito corporativo disponible para clientes recurrentes</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-[#1B3A6B]" />
                  <span>Muestrario físico de telas (Lafayette, Dril, Popelinas)</span>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href={`https://wa.me/${COMPANY_INFO.whatsappNumber}?text=Hola%20Distripako,%20requiero%20asesoria%20corporativa%20para%20dotacion%20empresarial`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#1B3A6B] hover:bg-[#2557A7] text-white font-bold text-sm transition-all shadow-md"
                >
                  <span>Agendar Asesoría con un Especialista</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
