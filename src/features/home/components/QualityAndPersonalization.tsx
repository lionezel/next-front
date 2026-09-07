"use client";

import Image from "next/image";
import {
  Sparkles,
  Layers,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Cpu,
  Palette,
  Sun,
} from "lucide-react";

export default function QualityAndPersonalization() {
  const highlights = [
    {
      icon: Cpu,
      title: "Bordado Computarizado Multicabezal",
      desc: "Digitalización de logotipo y bordado de alta densidad con hasta 12 colores simultáneos. Hilos Isacord y Madeira resistentes a lavados intensivos.",
    },
    {
      icon: Palette,
      title: "Estampado DTF Textil Full Color",
      desc: "Impresión de alta resolución con tacto suave, degradados hiperrealistas y elasticidad que no se cuartea con el uso ni el sol.",
    },
    {
      icon: Sun,
      title: "Cintas Reflectivas Normadas 3M",
      desc: "Aplicación de cintas de alta visibilidad para operarios en carretera, minería y turnos nocturnos, cumpliendo normatividad de seguridad.",
    },
    {
      icon: ShieldCheck,
      title: "Telas Certificadas de Alto Rendimiento",
      desc: "Trabajamos con textiles de primera línea (Lafayette, Dril Vulcano, Popelinas) con tecnologías antifluido, anti-desgarre y solidez al color.",
    },
  ];

  return (
    <section id="servicios" className="py-24 bg-white text-slate-900 relative overflow-hidden scroll-mt-20 border-b border-slate-100">
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Workshop Image & Floating Badge */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden border-2 border-slate-200 shadow-xl bg-white">
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src="/images/products/bordados.jpg"
                  alt="Taller de bordado computarizado Distripako"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div className="p-5 bg-white/95 backdrop-blur-md border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#1B3A6B] tracking-wider">
                      Tecnología Textil
                    </span>
                    <h4 className="text-sm font-bold text-slate-900">
                      Maquinaria Industrial de Precisión
                    </h4>
                  </div>
                  <span className="text-xs font-bold text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                    HD Stitching
                  </span>
                </div>
              </div>
            </div>

            {/* Floating Quality Guarantee Seal */}
            <div className="absolute -bottom-6 -left-4 sm:-left-6 bg-white text-slate-900 p-4 rounded-2xl shadow-xl border border-slate-200 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-50 text-[#1B3A6B] border border-amber-200">
                <ShieldCheck size={26} />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                  Compromiso Total
                </p>
                <p className="text-sm font-black text-slate-900">
                  100% Garantía de Confección
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Descriptions & Tech Specs */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold uppercase tracking-wider">
                <Sparkles size={13} className="text-[#1B3A6B]" />
                <span>Personalización & Calidad Textil</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
                La Imagen de tu Empresa con Acabados Impecables
              </h2>
              <p className="text-slate-600 text-base leading-relaxed">
                En Distripako cuidamos cada detalle: desde la selección del gramaje de la tela hasta la puntada final del bordado. Tu personal lucirá impecable, cómodo y protegido todos los días.
              </p>
            </div>

            {/* Feature list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
              {highlights.map((item, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-[#1B3A6B] transition-all hover:bg-white space-y-2.5 shadow-sm"
                >
                  <div className="p-2.5 rounded-xl bg-white text-[#1B3A6B] border border-slate-200 w-fit shadow-xs">
                    <item.icon size={20} />
                  </div>
                  <h4 className="text-base font-bold text-slate-900">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <a
                href="#cotizador"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[#1B3A6B] hover:bg-[#2557A7] text-white font-bold text-sm shadow-lg shadow-[#1B3A6B]/20 transition-all hover:scale-105"
              >
                <span>Personalizar Dotación de tu Empresa</span>
                <Sparkles size={16} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
