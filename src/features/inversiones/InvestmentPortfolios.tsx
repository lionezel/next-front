"use client";

import React from "react";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { Check } from "lucide-react";

export default function InvestmentPortfolios() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
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

  const portfolios = [
    {
      name: "Portafolio Renta Segura",
      risk: "Bajo Riesgo / Conservador",
      yieldEA: "11.5% E.A.",
      minAmount: "$500,000 COP",
      term: "Desde 3 meses",
      liquidity: "Mensual",
      badge: "Ideal para Principiantes",
      badgeClass: "bg-blue-50 text-blue-800 border-blue-200",
      description:
        "Orientado a la preservación absoluta del capital mediante títulos de renta fija institucional, depósitos garantizados y deuda calificada AAA.",
      benefits: [
        "Retorno predecible y garantizado",
        "Liquidación de rendimientos mes a mes",
        "Sin comisiones de administración sorpresa",
        "Reversión rápida de liquidez",
      ],
    },
    {
      name: "Portafolio Crecimiento Estratégico",
      risk: "Riesgo Moderado / Balanceado",
      yieldEA: "14.5% E.A.",
      minAmount: "$3,000,000 COP",
      term: "Desde 6 meses",
      liquidity: "Trimestral",
      badge: "Más Popular",
      badgeClass: "bg-indigo-50 text-indigo-800 border-indigo-200",
      description:
        "La combinación óptima de seguridad y rentabilidad superior a la inflación. Invierte en fondos inmobiliarios, crédito corporativo y bonos estructurados.",
      benefits: [
        "Mayor rentabilidad que CDTs tradicionales",
        "Diversificación en múltiples sectores económicos",
        "Reinversión automática con interés compuesto",
        "Acompañamiento trimestral personalizado",
      ],
    },
    {
      name: "Portafolio Alta Rentabilidad",
      risk: "Riesgo Dinámico / Alto",
      yieldEA: "17.8% E.A.",
      minAmount: "$10,000,000 COP",
      term: "Desde 12 meses",
      liquidity: "Al Vencimiento",
      badge: "Máximo Retorno",
      badgeClass: "bg-violet-50 text-violet-800 border-violet-200",
      description:
        "Diseñado para inversionistas decididos a maximizar el crecimiento de su patrimonio a mediano y largo plazo a través de activos de alto rendimiento.",
      benefits: [
        "Rendimiento líder en el mercado financiero",
        "Asesor patrimonial privado asignado",
        "Informes y análisis de portafolio mensual",
        "Prioridad en nuevas emisiones de fondos",
      ],
    },
  ];

  return (
    <section id="portafolios" className="py-16 bg-slate-50/80 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <h2 className="text-3xl font-extrabold text-slate-900">
            Portafolios de Inversión Estructurados
          </h2>
          <p className="text-sm text-slate-600">
            Estrategias diseñadas por comités financieros de alto nivel para brindarte rentabilidad y transparencia en todo momento.
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {portfolios.map((item, idx) => (
            <motion.div
              key={idx}
              variants={cardVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              className="rounded-3xl bg-white border border-slate-200/90 p-8 flex flex-col justify-between hover:border-indigo-300 transition-all shadow-xs hover:shadow-xl group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-[11px] font-bold px-3 py-1 rounded-full border ${item.badgeClass}`}>
                    {item.badge}
                  </span>
                  <span className="text-xs text-slate-500">{item.risk}</span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-2">{item.name}</h3>

                <div className="my-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center group-hover:bg-indigo-50/50 group-hover:border-indigo-200 transition-colors">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">
                    Rendimiento Estimado
                  </span>
                  <span className="text-3xl font-black text-indigo-700">
                    {item.yieldEA}
                  </span>
                  <span className="text-xs text-slate-500 block mt-1">
                    Monto mínimo: <strong className="text-slate-800">{item.minAmount}</strong>
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mb-6">
                  {item.description}
                </p>

                <ul className="space-y-2.5 mb-8">
                  {item.benefits.map((b, bIdx) => (
                    <li key={bIdx} className="flex items-start gap-2 text-xs text-slate-700">
                      <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                href="#simulador"
                className="w-full py-3 px-4 rounded-xl text-xs font-bold text-center text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-md shadow-indigo-600/20 transition-all block"
              >
                Invertir en este Portafolio
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
