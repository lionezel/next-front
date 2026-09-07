"use client";

import { motion } from "framer-motion";
import { Send, Sparkles } from "lucide-react";
import { COMPANY_INFO } from "@/src/data/uniforms-data";

export default function LightCallSection() {
  return (
    <section className="py-24 relative overflow-hidden bg-white">
      <div className="container mx-auto px-6 lg:px-12 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 text-[#0F1D36] text-xs font-bold uppercase tracking-wider">
            <Sparkles size={14} className="text-[#1B3A6B]" />
            <span>Asesoría Empresarial Sin Costo</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0F1D36] tracking-tight">
            ¿Listo para equipar a tu equipo de trabajo?
          </h2>

          <p className="text-base sm:text-lg text-slate-600">
            Un especialista de Distripako está disponible para evaluar las necesidades de tu empresa, presentarte muestras de telas y cotizar con precios directos de fábrica.
          </p>

          <div className="pt-4 flex justify-center">
            <a
              href={`https://wa.me/${COMPANY_INFO.whatsappNumber}?text=Hola%20Distripako,%20deseo%20una%20asesoria%20para%20dotacion%20de%20uniformes`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 rounded-full bg-[#0F1D36] hover:bg-[#1E3A5F] px-8 py-4 text-base font-bold text-white transition-all shadow-xl hover:scale-105"
            >
              <Send size={18} className="text-[#1B3A6B]" />
              <span>Solicitar Asesoría por WhatsApp</span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}