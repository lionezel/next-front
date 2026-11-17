"use client";

import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  CreditCard,
  Factory,
  TrendingUp,
  CheckCircle2,
  ChevronRight,
  Building2,
  ShieldCheck,
  Cpu,
} from "lucide-react";
import { VerticalKey } from "@/src/types/common";

/**
 * ============================================================================
 * CONFIGURACIÓN DE VELOCIDAD, DURACIÓN Y TRANSICIONES DEL SCROLL 3D
 * ============================================================================
 * - `sectionHeightVh`: Altura total de la pista de scroll en unidades `vh`
 *   (ej. 380 = 3.8 pantallas de recorrido; mayor valor = animación más pausada).
 * - `dampingFactor`: Suavizado inercial entre el scroll nativo y la escena 3D
 *   (0.08 = más suave/lento, 0.22 = más inmediato, 1.0 = instantáneo sin inercia).
 * - `thresholds`: Cortes normalizados (0.0 a 1.0) para cada una de las 4 escenas.
 */
export const NEXT_3D_SCROLL_CONFIG = {
  sectionHeightVh: 380,
  dampingFactor: 0.14,
  thresholds: {
    scene1End: 0.25, // 0%  - 25%: Pequeña instalación manufacturera inicial
    scene2End: 0.5, // 25% - 50%: Aparición de tarjeta corporativa 3D NEXT y financiación
    scene3End: 0.75, // 50% - 75%: Expansión progresiva de planta, robots y equipo
    scene4End: 1.0, // 75% - 100%: Industria moderna consolidada dirigida por el empresario
  },
};

const NextIndustrialGrowth3D = dynamic(
  () => import("@/src/components/3d/NextIndustrialGrowth3D"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#F0F9FF] via-white to-[#E0F2FE] rounded-3xl border border-sky-200">
        <div className="w-12 h-12 rounded-2xl bg-[#0F243C] text-[#38BDF8] flex items-center justify-center font-black text-sm animate-pulse shadow-lg mb-3">
          NE➔XT
        </div>
        <span className="text-xs font-bold text-slate-500 tracking-wide">
          Cargando experiencia interactiva 3D en alta definición...
        </span>
      </div>
    ),
  }
);

interface NextGrowthScrollSectionProps {
  onSelectVertical?: (vertical: VerticalKey | any) => void;
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

export default function NextGrowthScrollSection({
  onSelectVertical,
}: NextGrowthScrollSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState<number>(0);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);

  const targetProgressRef = useRef<number>(0);
  const currentProgressRef = useRef<number>(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    let rafId: number;

    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const vh = window.innerHeight;
      const totalScrollable = Math.max(1, sectionRef.current.offsetHeight - vh);
      targetProgressRef.current = clamp(-rect.top / totalScrollable, 0, 1);
    };

    const tick = () => {
      const factor = reducedMotion ? 1 : NEXT_3D_SCROLL_CONFIG.dampingFactor;
      const diff = targetProgressRef.current - currentProgressRef.current;
      if (Math.abs(diff) > 0.0004) {
        currentProgressRef.current += diff * factor;
        setProgress(currentProgressRef.current);
      }
      rafId = window.requestAnimationFrame(tick);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    handleScroll();
    rafId = window.requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      window.cancelAnimationFrame(rafId);
    };
  }, [reducedMotion]);

  const { scene1End, scene2End, scene3End } = NEXT_3D_SCROLL_CONFIG.thresholds;
  const activeScene =
    progress < scene1End
      ? 0
      : progress < scene2End
      ? 1
      : progress < scene3End
      ? 2
      : 3;

  const scrollToScene = (sceneIdx: number) => {
    if (!sectionRef.current) return;
    const targetPercentages = [0.05, 0.36, 0.62, 0.92];
    const targetP = targetPercentages[sceneIdx] ?? 0;
    const rect = sectionRef.current.getBoundingClientRect();
    const absoluteTop = window.scrollY + rect.top;
    const totalScrollable =
      sectionRef.current.offsetHeight - window.innerHeight;
    window.scrollTo({
      top: absoluteTop + totalScrollable * targetP,
      behavior: reducedMotion ? "auto" : "smooth",
    });
  };

  const scenesData = [
    {
      index: 0,
      rangeLabel: "0% – 25%",
      shortLabel: "01. Operación Inicial",
      badge: "Etapa 1 • Pequeña Instalación Manufacturera",
      title: "Un negocio organizado listo para multiplicar su escala",
      description:
        "El empresario cuenta con una instalación manufacturera limpia, máquina CNC en movimiento y línea inicial activa, pero requiere capital estratégico para expandir su planta.",
      bullets: [
        "Módulo productivo inicial con maquinaria activa y flujo continuo",
        "Empresario fundador supervisando directamente la producción",
        "Potencial inmediato para atender contratos corporativos mayores",
      ],
      metricTitle: "Capacidad Instalada",
      metricValue: "1.200 uds/mes",
      metricSub: "1 Módulo Operativo Activo",
      icon: Factory,
    },
    {
      index: 1,
      rangeLabel: "25% – 50%",
      shortLabel: "02. Financiación NEXT",
      badge: "Etapa 2 • Tarjeta Corporativa & Liquidez NEXT",
      title: "NEXT inyecta el capital estratégico para escalar",
      description:
        "La tarjeta corporativa 3D de NEXT desciende sobre la planta desplegando un flujo de liquidez multibanca (+35 entidades aliadas), con tasas preferenciales y 0% cobros por adelantado.",
      bullets: [
        "Activación de línea corporativa NEXT para maquinaria y capital de trabajo",
        "Estructuración con +35 entidades financieras aliadas",
        "Plazos y cuotas alineados con el retorno de la nueva producción",
      ],
      metricTitle: "Línea Aprobada NEXT",
      metricValue: "$450.000.000",
      metricSub: "Desembolso Directo • Tasa IBR",
      icon: CreditCard,
    },
    {
      index: 2,
      rangeLabel: "50% – 75%",
      shortLabel: "03. Expansión Activa",
      badge: "Etapa 3 • Automatización, Planta & Equipo",
      title: "Nuevas naves, robótica, montacargas y talento humano",
      description:
        "Los recursos financiados se convierten en crecimiento real: emergen nuevas naves, 3 brazos robóticos ensamblando en vivo, un montacargas autónomo, bodega en altura y nuevos operadores.",
      bullets: [
        "3 brazos robóticos articulados y línea de ensamblaje extendida",
        "Montacargas autónomo y estanterías industriales de alto volumen",
        "Nuevos operadores especializados trabajando en equipo",
      ],
      metricTitle: "Capacidad en Expansión",
      metricValue: "6.800 uds/mes",
      metricSub: "+320% Productividad en Planta",
      icon: Cpu,
    },
    {
      index: 3,
      rangeLabel: "75% – 100%",
      shortLabel: "04. Industria Consolidada",
      badge: "Etapa 4 • Complejo Industrial Moderno",
      title: "Una gran industria moderna dirigida por el mismo fundador",
      description:
        "Se eleva la torre corporativa en cristal azul cielo, llega el camión logístico de distribución y crecen las columnas financieras, con el mismo empresario dirigiendo todo el complejo.",
      bullets: [
        "Complejo industrial integrado con torre ejecutiva de control",
        "Flota de transporte logístico activa para distribución nacional",
        "El mismo empresario liderando su industria desde el balcón ejecutivo",
      ],
      metricTitle: "Producción Consolidada",
      metricValue: "15.000 uds/mes",
      metricSub: "Industria Líder 100% Consolidada",
      icon: Building2,
    },
  ];

  const currentScene = scenesData[activeScene];
  const progressPercent = Math.round(progress * 100);

  return (
    <section
      ref={sectionRef}
      style={{ height: `${NEXT_3D_SCROLL_CONFIG.sectionHeightVh}vh` }}
      className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] bg-gradient-to-b from-[#F8FAFC] via-[#F0F9FF] to-[#E0F2FE]/70 select-none"
    >
      {/* STICKY FULL-VIEWPORT INTERACTIVE STAGE */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between py-5 sm:py-7 px-4 sm:px-8 lg:px-14 max-w-[1440px] mx-auto">
        {/* TOP HEADER & 4-STAGE TIMELINE */}
        <div className="relative z-20 flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3.5 border-b border-sky-200/80">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 border border-sky-200 text-[#0284C7] text-[11px] font-extrabold uppercase tracking-wider mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#0EA5E9]" />
              <span>Animación Interactiva 3D en Tiempo Real • NEXT Empresas</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#0F243C] tracking-tight">
              De Pequeño Negocio a{" "}
              <span className="gradient-text-sky">
                Industria Manufacturera Consolidada
              </span>
            </h2>
          </div>

          {/* Interactive Stage Switcher Pills */}
          <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-white/95 backdrop-blur-md border border-sky-200/90 shadow-xs overflow-x-auto">
            {scenesData.map((sc) => {
              const isActive = activeScene === sc.index;
              return (
                <button
                  key={sc.index}
                  onClick={() => scrollToScene(sc.index)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                    isActive
                      ? "bg-[#0F243C] text-white shadow-sm"
                      : "text-slate-600 hover:text-[#0F243C] hover:bg-sky-50"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isActive ? "bg-[#38BDF8] animate-pulse" : "bg-slate-300"
                    }`}
                  />
                  <span>{sc.shortLabel}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* MAIN 12-COLUMN INTERACTIVE GRID */}
        <div className="relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center my-auto py-2 min-h-0">
          {/* LEFT COLUMN (5 Cols): Narrative Card */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentScene.index}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="p-6 sm:p-7 rounded-3xl bg-white/95 backdrop-blur-xl border border-sky-200/90 shadow-[0_20px_50px_rgba(15,36,60,0.08)]"
              >
                {/* Stage Badge & Scroll Range */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F0F9FF] border border-sky-200 text-[#0284C7] text-[11px] font-extrabold">
                    <currentScene.icon className="w-3.5 h-3.5 text-[#0EA5E9]" />
                    <span>{currentScene.badge}</span>
                  </span>
                  <span className="text-[11px] font-mono font-bold text-[#0284C7] bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-100">
                    {currentScene.rangeLabel}
                  </span>
                </div>

                {/* Scene Title */}
                <h3 className="text-xl sm:text-2xl lg:text-[26px] font-black text-[#0F243C] leading-[1.15] tracking-tight mb-3">
                  {currentScene.title}
                </h3>

                {/* Scene Description */}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                  {currentScene.description}
                </p>

                {/* Bullet Points */}
                <div className="space-y-2 mb-5">
                  {currentScene.bullets.map((b, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2 text-xs sm:text-[13px] text-[#0F243C] font-medium"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#0EA5E9] shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>

                {/* CTA & Guarantee */}
                <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <button
                    onClick={() =>
                      onSelectVertical && onSelectVertical("credito")
                    }
                    className="px-5 py-2.5 rounded-full bg-[#38BDF8] hover:bg-[#0EA5E9] text-[#081C45] font-extrabold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md shadow-sky-400/25 active:scale-95 cursor-pointer"
                  >
                    <span>Impulsar mi empresa con NEXT</span>
                    <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                  </button>

                  <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    0% cobros anticipados
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* RIGHT COLUMN (7 Cols): Clean Pure-White Isometric Vector Infographic Stage */}
          <div className="lg:col-span-7 relative h-[350px] sm:h-[460px] lg:h-[540px] w-full rounded-3xl bg-white border border-slate-200/90 shadow-[0_20px_50px_rgba(15,36,60,0.07)] overflow-hidden">
            {/* Animated 2.5D Isometric Vector Infographic */}
            <NextIndustrialGrowth3D
              progress={progress}
              activeScene={activeScene}
              reducedMotion={reducedMotion}
            />

            {/* TOP-LEFT FLOATING BADGE */}
            <div className="absolute top-3.5 left-3.5 sm:top-4 sm:left-4 z-20 px-3 py-1.5 rounded-xl bg-white/95 backdrop-blur-md border border-slate-200 shadow-xs flex items-center gap-2 pointer-events-none">
              <div className="w-7 h-7 rounded-lg bg-[#0F243C] text-[#38BDF8] flex items-center justify-center font-black text-[11px]">
                NE➔XT
              </div>
              <span className="text-xs font-extrabold text-[#0F243C]">
                Etapa {activeScene + 1}/4 • {currentScene.shortLabel.slice(4)}
              </span>
            </div>

            {/* BOTTOM-RIGHT FLOATING METRIC PILL */}
            <div className="absolute bottom-3.5 right-3.5 sm:bottom-4 sm:right-4 z-20 px-3.5 py-2 rounded-xl bg-[#0F243C]/95 backdrop-blur-md text-white shadow-lg pointer-events-none flex items-center gap-3">
              <div>
                <span className="text-[9px] font-bold uppercase tracking-wider text-sky-300 block">
                  {currentScene.metricTitle}
                </span>
                <span className="text-sm font-black text-white font-mono">
                  {currentScene.metricValue}
                </span>
              </div>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
        </div>

        {/* BOTTOM SCROLL PROGRESS BAR (0% -> 100%) */}
        <div className="relative z-20 pt-3 flex items-center gap-4">
          <span className="text-[11px] font-extrabold text-[#0F243C] whitespace-nowrap">
            Progreso de Transformación: {progressPercent}%
          </span>
          <div className="flex-1 h-2 rounded-full bg-sky-100 border border-sky-200/70 overflow-hidden relative">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#0284C7] via-[#0EA5E9] to-[#10B981] transition-all duration-75"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-[11px] font-semibold text-slate-500 hidden sm:inline whitespace-nowrap">
            Haz scroll para avanzar o retroceder libremente
          </span>
        </div>
      </div>
    </section>
  );
}
