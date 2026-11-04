"use client";

import React from "react";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { Heart, Users, Car, Home, Check } from "lucide-react";

export default function InsurancePlans() {
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

  const plans = [
    {
      icon: Heart,
      title: "Salud Integral & Familiar",
      price: "$65,000 COP",
      desc: "Acceso inmediato a la red médica de especialistas, clínicas de primer nivel, laboratorios y urgencias sin listas de espera.",
      coverages: [
        "Consultas médicas con especialistas directos",
        "Hospitalización y cirugía en habitación individual",
        "Exámenes diagnósticos de alta tecnología",
        "Atención médica domiciliaria 24/7",
      ],
    },
    {
      icon: Users,
      title: "Póliza de Vida Segura",
      price: "$42,000 COP",
      desc: "El amparo más completo para garantizar la estabilidad económica y el futuro de tus hijos y cónyuge ante cualquier suceso.",
      coverages: [
        "Indemnización inmediata por fallecimiento",
        "Doble indemnización por muerte accidental",
        "Amparo por incapacidad total y permanente",
        "Anticipo del 50% por enfermedades graves",
      ],
    },
    {
      icon: Car,
      title: "Seguro Todo Riesgo Auto",
      price: "$89,000 COP",
      desc: "Protege tu vehículo particular o corporativo frente a pérdidas parciales, hurto, daños a terceros y eventos de la naturaleza.",
      coverages: [
        "Responsabilidad civil hasta por $4,000M COP",
        "Pérdida parcial y total por daños o hurto",
        "Grúa, asistencia mecánica y cerrajería 24/7",
        "Conductor elegido ilimitado",
      ],
    },
    {
      icon: Home,
      title: "Protección Total Hogar",
      price: "$38,000 COP",
      desc: "Cobertura para tu vivienda y contenidos frente a eventos imprevistos, con asistencia de emergencias técnicas continuas.",
      coverages: [
        "Terremoto, incendio, explosión y tormenta",
        "Hurto con violencia de enseres y tecnología",
        "Daños a terceros y responsabilidad civil familiar",
        "Plomería, electricidad y vidriería de urgencia",
      ],
    },
  ];

  return (
    <section id="planes" className="py-16 bg-slate-50/80 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <h2 className="text-3xl font-extrabold text-slate-900">
            Pólizas Diseñadas para tu Tranquilidad
          </h2>
          <p className="text-sm text-slate-600">
            Respaldo de las compañías aseguradoras más prestigiosas del país con soporte directo y sin trabas burocráticas.
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {plans.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                variants={cardVariants}
                whileHover={{ y: -6, scale: 1.02 }}
                className="rounded-3xl bg-white border border-slate-200/90 p-6 flex flex-col justify-between hover:border-sky-300 transition-all shadow-xs hover:shadow-xl group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600 group-hover:bg-sky-600 group-hover:text-white transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-sky-800">
                      Desde {item.price} /mes
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">{item.desc}</p>

                  <ul className="space-y-2 mb-6">
                    {item.coverages.map((c, cIdx) => (
                      <li key={cIdx} className="flex items-start gap-2 text-xs text-slate-700">
                        <Check className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href="#cotizador"
                  className="w-full py-2.5 px-3 rounded-xl text-xs font-bold text-center text-sky-800 bg-sky-50 hover:bg-sky-600 hover:text-white border border-sky-200 transition-all block shadow-xs"
                >
                  Personalizar Póliza
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
