"use client";

import React from "react";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { Check, Briefcase, UserCheck, Car, Coins } from "lucide-react";

export default function CreditTypes() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 90,
        damping: 14,
      },
    },
  };

  const types = [
    {
      icon: UserCheck,
      title: "Crédito Personal & Nómina",
      badge: "Tasa desde 1.25% M.V.",
      desc: "Diseñado para cubrir imprevistos, viajes, remodelaciones o consolidación de pasivos con débito automático o cuotas fijas.",
      features: [
        "Monto de $1M hasta $50M COP",
        "Plazos desde 12 hasta 60 meses",
        "Aprobación en menos de 24 horas",
        "Sin cobro por estudio de crédito",
      ],
    },
    {
      icon: Briefcase,
      title: "Crédito Comercial & Negocios",
      badge: "Tasa desde 1.45% M.V.",
      desc: "Capital de trabajo para PYMEs y emprendedores que necesitan liquidez para inventario, maquinaria o expansión.",
      features: [
        "Monto de $10M hasta $100M COP",
        "Períodos de gracia negociables",
        "Atención con ejecutivo corporativo",
        "Flexibilidad en garantías",
      ],
    },
    {
      icon: Coins,
      title: "Libre Inversión",
      badge: "Tasa desde 1.35% M.V.",
      desc: "Financiación sin justificación de destino. Úsalo como quieras con los desembolsos más veloces del mercado.",
      features: [
        "Monto de $3M hasta $80M COP",
        "Plazos cómodos hasta 72 meses",
        "Amortización anticipada sin penalidad",
        "Proceso 100% digital",
      ],
    },
    {
      icon: Car,
      title: "Crédito de Vehículo",
      badge: "Tasa desde 1.15% M.V.",
      desc: "Financia hasta el 90% del valor comercial de vehículos nuevos o usados de todas las marcas autorizadas.",
      features: [
        "Financiación hasta 84 meses",
        "Póliza todo riesgo preferencial",
        "Pre-aprobación con solo tu cédula",
        "Tasas preferenciales para eléctricos e híbridos",
      ],
    },
  ];

  return (
    <section id="tipos" className="py-16 bg-slate-50/80 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <h2 className="text-3xl font-extrabold text-slate-900">
            Líneas de Financiación a tu Medida
          </h2>
          <p className="text-sm text-slate-600">
            Encuentra la alternativa financiera que mejor se adapta a tu perfil de ingresos y necesidades.
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {types.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                variants={cardVariants}
                whileHover={{ y: -6, scale: 1.02 }}
                className="rounded-3xl bg-white border border-slate-200/90 p-6 flex flex-col justify-between hover:border-emerald-300 transition-all shadow-xs hover:shadow-xl group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">{item.desc}</p>

                  <ul className="space-y-2 mb-6">
                    {item.features.map((f, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2 text-xs text-slate-700">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href="#simulador"
                  className="w-full py-2.5 px-3 rounded-xl text-xs font-bold text-center text-emerald-800 bg-emerald-50 hover:bg-emerald-600 hover:text-white border border-emerald-200 transition-all block shadow-xs"
                >
                  Simular esta Línea
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
