"use client";

import React, { useState } from "react";
import {
  ChevronDown,
  HelpCircle,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  ArrowRight,
  PhoneCall,
  Sparkles,
} from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
  tag: string;
}

export default function FaqInteractiveSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FaqItem[] = [
    {
      tag: "Costos y Tarifas",
      question: "¿La asesoría patrimonial o el estudio de crédito tienen algún costo?",
      answer:
        "No. Todas nuestras asesorías financieras, comparativas de seguros y estudios de viabilidad son 100% personalizadas y sin ningún costo para ti. Nuestros honorarios son asumidos directamente por las entidades aseguradoras y financieras aliadas bajo convenios institucionales, garantizando que tú siempre recibas la tarifa directa más baja o preferencial.",
    },
    {
      tag: "Comparación",
      question: "¿Por qué contratar un seguro o crédito con Next Connection Group y no directo en ventanilla?",
      answer:
        "Porque en una sucursal tradicional te ofrecerán únicamente el producto exclusivo de esa entidad. En Next Connection Group comparamos más de 35 compañías en tiempo real, adaptando la póliza o crédito a tu capacidad exacta. Además, tienes a un asesor personal permanente que te defiende y acompaña en caso de reclamaciones o siniestros.",
    },
    {
      tag: "Siniestros y Reclamaciones",
      question: "¿Qué pasa si ocurre un siniestro (accidente, urgencia médica, daño) o necesito cobrar mi póliza?",
      answer:
        "Ese es nuestro mayor valor agregado: no te dejamos solo en los momentos difíciles. Nuestro departamento de operaciones y siniestros se encarga de radicar la documentación, hacer seguimiento ante la aseguradora y velar por el cumplimiento de los tiempos de indemnización y coberturas pactadas.",
    },
    {
      tag: "Tiempos de Respuesta",
      question: "¿Cuánto tarda el proceso de aprobación y desembolso de un crédito o emisión de póliza?",
      answer:
        "Gracias a nuestra integración digital con las entidades, las pólizas de vehículos, salud y vida pueden emitirse en el mismo día hábil. En créditos de libre inversión y libranza, la respuesta de pre-aprobación toma minutos y el desembolso a tu cuenta bancaria se completa en 24 horas hábiles tras la firma digital.",
    },
    {
      tag: "Respaldo y Cobertura",
      question: "¿Qué compañías aseguradoras y entidades financieras respaldan sus servicios?",
      answer:
        "Trabajamos con más de 35 aseguradoras y corporaciones financieras vigiladas a nivel nacional e internacional, entre ellas: Sura, Seguros Bolívar, Allianz, AXA Colpatria, Mapfre, Seguros del Estado, MetLife, Pan-American Life, Chubb, Bancolombia, Banco de Bogotá y cooperativas aliadas.",
    },
    {
      tag: "Modalidades de Atención",
      question: "¿Cómo puedo acceder a la asesoría y dónde están ubicados?",
      answer:
        "Ofrecemos doble modalidad según tu comodidad: 100% digital a nivel nacional a través de videollamadas 1 a 1 por Google Meet, o presencial en nuestras sedes corporativas en Medellín y Bogotá. Puedes agendar tu horario exacto en nuestro centro de reservas en tiempo real.",
    },
  ];

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleBookClick = () => {
    const el = document.getElementById("agenda-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-white border-b border-slate-200/90 relative">
      <div className="max-w-4xl mx-auto px-3.5 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-3 mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700">
            <HelpCircle className="w-4 h-4 text-sky-600" />
            <span>Transparencia Total</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
            Preguntas Frecuentes (FAQ)
          </h2>
          <p className="text-xs sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Resolvemos las dudas más habituales sobre nuestro modelo de acompañamiento, costos, tiempos y coberturas.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3 sm:space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? "border-sky-300 bg-sky-50/20 shadow-sm"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <button
                  type="button"
                  onClick={() => handleToggle(idx)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between text-left gap-4 cursor-pointer"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 bg-sky-100/70 px-2 py-0.5 rounded-md inline-block">
                      {faq.tag}
                    </span>
                    <h3 className="text-xs sm:text-sm md:text-base font-bold text-slate-900">
                      {faq.question}
                    </h3>
                  </div>
                  <div
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen
                        ? "bg-sky-600 text-white rotate-180"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal border-t border-slate-100 mt-1">
                    <p className="pt-3">{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Action Callout */}
        <div className="mt-8 sm:mt-12 p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200/80 text-center space-y-3">
          <p className="text-xs sm:text-sm font-semibold text-slate-700">
            ¿Tienes un requerimiento especial para tu familia o tu empresa?
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleBookClick}
              className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-sm shadow-sky-500/20"
            >
              <Calendar className="w-4 h-4 text-white" />
              <span>Agendar Asesoría 1 a 1 Gratuita</span>
            </button>
            <a
              href="https://wa.me/573001234567?text=Hola,%20deseo%20una%20asesoria%20personalizada%20con%20Next%20Connection%20Group"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 transition-all"
            >
              <PhoneCall className="w-4 h-4 text-emerald-400" />
              <span>Contactar por WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
