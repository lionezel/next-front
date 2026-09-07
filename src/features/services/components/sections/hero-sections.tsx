"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ArrowLeft } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative min-h-[70vh] flex items-center pt-28 pb-14 overflow-hidden bg-slate-50 border-b border-slate-200">
      <div className="container relative z-10 mx-auto px-6 lg:px-12">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-[#0F1D36] transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Volver al inicio</span>
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl"
        >
          <div className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-bold text-[#0F1D36] uppercase tracking-wider mb-6 shadow-sm">
            <span className="mr-2 inline-block h-2 w-2 rounded-full bg-[#1B3A6B]"></span>
            Servicios Textiles & Confección Especializada
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-[#0F1D36] sm:text-5xl md:text-6xl lg:leading-[1.1] mb-6">
            Soluciones Integrales en <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0F1D36] via-[#1E3A5F] to-[#1B3A6B]">
              Dotación & Vestuario Laboral
            </span>
          </h1>

          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl border-l-2 border-[#1B3A6B] pl-6">
            Fabricamos uniformes de alto rendimiento con bordado computarizado HD, asesoría en tallaje y telas certificadas que garantizan durabilidad, seguridad y excelente presentación.
          </p>
        </motion.div>
      </div>
    </section>
  );
}