"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Calculator,
  Truck,
  Layers,
  Award,
  CheckCircle2,
} from "lucide-react";
import { COMPANY_INFO } from "@/src/data/uniforms-data";

export default function Hero() {
  const quickBadges = [
    { icon: ShieldCheck, text: "Telas de Alta Durabilidad" },
    { icon: Sparkles, text: "Bordado Computarizado HD" },
    { icon: Truck, text: "Despachos a Toda Colombia" },
    { icon: Award, text: "Precios Mayoristas de Fábrica" },
  ];

  return (
    <section className="relative min-h-[90vh] pt-28 lg:pt-36 pb-16 overflow-hidden bg-white text-slate-900 flex items-center border-b border-slate-100">
      {/* Background Subtle Grid Texture */}
      <div className="absolute inset-0 bg-[radial-gradient(#CBD5E1_1px,transparent_1px)] [background-size:28px_28px] opacity-40 pointer-events-none" />
      
      {/* Ambient Lighting Orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#1B3A6B]/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-amber-100/40 rounded-full blur-[160px] pointer-events-none" />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headline & Value Proposition */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="lg:col-span-7 space-y-7 text-center lg:text-left"
          >
            {/* Trust Pill */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 shadow-sm mx-auto lg:mx-0">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1B3A6B] opacity-80" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1B3A6B]" />
              </span>
              <span>Dotaciones Empresariales & Confección Textil</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.12] text-slate-900">
              Uniformes que Proyectan{" "}
              <span className="bg-gradient-to-r from-[#142D55] via-[#1B3A6B] to-[#142D55] bg-clip-text text-transparent">
                Seguridad, Identidad y Calidad
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Dotación integral para el sector industrial, administrativo, salud y alimentos. Confección en telas certificadas de alta durabilidad (Lafayette, Dril pesado, Antifluido) con bordado computarizado de precisión.
            </p>

            {/* CTA Group */}
            <div className="flex flex-col sm:flex-row gap-3.5 justify-center lg:justify-start pt-2">
              <a
                href="#cotizador"
                className="group inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl bg-[#1B3A6B] hover:bg-[#2557A7] text-white font-extrabold text-sm sm:text-base shadow-lg shadow-[#1B3A6B]/25 hover:shadow-xl transition-all hover:-translate-y-0.5 active:translate-y-0"
              >
                <Calculator size={18} />
                <span>Cotizar Pedido en Línea</span>
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </a>

              <a
                href="#simulador-3d"
                className="inline-flex items-center justify-center gap-2 px-5 py-4 rounded-xl bg-gradient-to-r from-slate-900 via-[#1B3A6B] to-slate-900 hover:from-slate-800 hover:to-[#2557A7] text-white font-extrabold text-sm sm:text-base shadow-md transition-all hover:-translate-y-0.5 border border-slate-700/80"
              >
                <Sparkles size={17} className="text-amber-400 animate-pulse" />
                <span>Simulador 3D</span>
              </a>

              <a
                href="#catalogo"
                className="inline-flex items-center justify-center gap-2 px-5 py-4 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 font-bold text-sm sm:text-base transition-all hover:-translate-y-0.5 shadow-xs"
              >
                <Layers size={17} className="text-[#1B3A6B]" />
                <span>Ver Catálogo</span>
              </a>
            </div>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
              {quickBadges.map((badge, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-semibold shadow-sm"
                >
                  <badge.icon size={15} className="text-[#1B3A6B] shrink-0" />
                  <span className="leading-tight text-left">{badge.text}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Column: Hero Visual Showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative mx-auto max-w-[500px] lg:max-w-none">
              {/* Main Card Frame */}
              <div className="relative rounded-3xl overflow-hidden border-2 border-slate-200 shadow-2xl shadow-slate-300/50 bg-white group">
                <div className="relative aspect-[4/3] w-full">
                  <Image
                    src="/images/hero/hero-banner.jpg"
                    alt="Dotación de uniformes industriales Distripako"
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>

                {/* Overlay Card Details */}
                <div className="absolute bottom-0 inset-x-0 p-5 bg-white/95 backdrop-blur-md border-t border-slate-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[11px] uppercase tracking-wider text-[#1B3A6B] font-bold">
                        Garantía de Fábrica
                      </p>
                      <h4 className="text-sm sm:text-base font-bold text-slate-900">
                        Confección & Bordado Directo
                      </h4>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center gap-1 text-xs text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                        <CheckCircle2 size={12} /> Stock Disponible
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Stat Widget Top Left */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-6 -left-4 sm:-left-6 bg-white text-slate-900 p-3.5 sm:p-4 rounded-2xl shadow-xl border border-slate-200 flex items-center gap-3 z-20"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-[#1B3A6B] border border-amber-200/60">
                  <Award size={22} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Experiencia</p>
                  <p className="text-base font-extrabold text-slate-900 leading-none mt-0.5">
                    {COMPANY_INFO.experienceYears} Años en el Mercado
                  </p>
                </div>
              </motion.div>

              {/* Floating Stat Widget Bottom Right */}
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute -bottom-6 -right-4 sm:-right-6 bg-white text-slate-900 p-3.5 sm:p-4 rounded-2xl shadow-xl border border-slate-200 flex items-center gap-3 z-20"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-50 text-[#1B3A6B] border border-slate-200">
                  <Sparkles size={22} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Producción</p>
                  <p className="text-base font-extrabold text-slate-900 leading-none mt-0.5">
                    {COMPANY_INFO.deliveredUniforms} Prendas
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
