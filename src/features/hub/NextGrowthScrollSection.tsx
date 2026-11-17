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
  Layers,
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

// Lazy load the WebGL 3D scene to optimize initial bundle & SSR
const NextIndustrialGrowth3D = dynamic(
  () => import("@/src/components/3d/NextIndustrialGrowth3D"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#F0F9FF] via-white to-[#E0F2FE] rounded-3xl border border-sky-100">
        <div className="w-12 h-12 rounded-2xl bg-[#0F243C] text-[#38BDF8] flex items-center justify-center font-black text-sm animate-pulse shadow-md mb-3">
          NE➔XT
        </div>
        <span className="text-xs font-bold text-slate-500 tracking-wide">
          Inicializando entorno industrial 3D...
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

  // Detect prefers-reduced-motion
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Scroll listener + damped RAF interpolation loop
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

  // Determine current active scene (0, 1, 2, 3) based on thresholds
  const { scene1End, scene2End, scene3End } = NEXT_3D_SCROLL_CONFIG.thresholds;
  const activeScene =
    progress < scene1End
      ? 0
      : progress < scene2End
      ? 1
      : progress < scene3End
      ? 2
      : 3;

  // Allow user to click a stage tab to smoothly scroll to that exact scroll percentage
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
      badge: "Punto de Partida • Taller Manufacturero",
      title: "Un negocio organizado listo para dar el siguiente salto",
      description:
        "El empresario cuenta con una operación manufacturera formal, maquinaria inicial y clientes activos, pero su capacidad instalada limita el volumen de pedidos que puede atender.",
      bullets: [
        "Módulo productivo inicial con 2 máquinas operativas",
        "Flujo de producción constante pero con capacidad al límite",
        "Oportunidad clara de atender contratos corporativos mayores",
      ],
      metricTitle: "Capacidad Instalada",
      metricValue: "1.200 uds/mes",
      metricSub: "1 Módulo Operativo",
      icon: Factory,
    },
    {
      index: 1,
      rangeLabel: "25% – 50%",
      shortLabel: "02. Financiación NEXT",
      badge: "Impulso Financiero • Tarjeta & Capital NEXT",
      title: "NEXT inyecta el capital estratégico para escalar",
      description:
        "A través de estructuración financiera multibanca y líneas de crédito corporativo NEXT, el empresario accede a liquidez inmediata con tasas preferenciales y 0% cobros anticipados.",
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
      badge: "Transformación • Maquinaria, Planta & Equipo",
      title: "Ampliación de planta, automatización y nuevos talentos",
      description:
        "Los recursos financiados por NEXT se transforman en infraestructura real: nuevas naves industriales, brazos robóticos de ensamblaje, estanterías de almacenamiento y más empleo calificado.",
      bullets: [
        "Incorporación de 3 celdas robóticas y línea continua de ensamblaje",
        "Ampliación de bodega de almacenamiento de alto volumen",
        "Crecimiento del equipo técnico y supervisión en planta",
      ],
      metricTitle: "Capacidad en Expansión",
      metricValue: "6.800 uds/mes",
      metricSub: "+320% Productividad",
      icon: Cpu,
    },
    {
      index: 3,
      rangeLabel: "75% – 100%",
      shortLabel: "04. Industria Consolidada",
      badge: "Resultado Final • Complejo Industrial Moderno",
      title: "Una industria manufacturera líder dirigida por su fundador",
      description:
        "El mismo empresario ahora dirige desde su torre ejecutiva una planta industrial consolidada, con logística automatizada, distribución nacional y solidez patrimonial respaldada por NEXT.",
      bullets: [
        "Complejo industrial integrado con torre de control ejecutiva",
        "Muelle logístico activo para distribución nacional e internacional",
        "Crecimiento financiero sostenible y blindaje patrimonial 360°",
      ],
      metricTitle: "Producción Consolidada",
      metricValue: "15.000 uds/mes",
      metricSub: "Industria Líder Consolidada",
      icon: Building2,
    },
  ];

  const currentScene = scenesData[activeScene];
  const progressPercent = Math.round(progress * 100);

  return (
    <section
      ref={sectionRef}
      style={{ height: `${NEXT_3D_SCROLL_CONFIG.sectionHeightVh}vh` }}
      className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] bg-gradient-to-b from-[#F8FAFC] via-[#F0F9FF] to-[#E0F2FE]/60 select-none"
    >
      {/* STICKY FULL-VIEWPORT INTERACTIVE STAGE */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between py-6 sm:py-8 px-4 sm:px-8 lg:px-14 max-w-[1440px] mx-auto">
        {/* TOP HEADER & 4-STAGE PROGRESS TIMELINE */}
        <div className="relative z-20 flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-sky-200/70">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100/90 border border-sky-200 text-[#0284C7] text-[11px] font-extrabold uppercase tracking-wider mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#0EA5E9]" />
              <span>Experiencia Interactiva 3D • Crecimiento Empresarial NEXT</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#0F243C] tracking-tight">
              De Pequeño Taller a{" "}
              <span className="gradient-text-sky">
                Industria Manufacturera Consolidada
              </span>
            </h2>
          </div>

          {/* Interactive Stage Switcher Pills */}
          <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-white/90 backdrop-blur-md border border-sky-200/80 shadow-xs overflow-x-auto">
            {scenesData.map((sc) => {
              const isActive = activeScene === sc.index;
              return (
                <button
                  key={sc.index}
                  onClick={() => scrollToScene(sc.index)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                    isActive
                      ? "bg-[#0F243C] text-white shadow-sm"
                      : "text-slate-600 hover:text-[#0F243C] hover:bg-sky-50"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isActive ? "bg-[#38BDF8]" : "bg-slate-300"
                    }`}
                  />
                  <span>{sc.shortLabel}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* MAIN 12-COLUMN INTERACTIVE GRID: NARRATIVE LEFT + 3D ISOMETRIC SCENE RIGHT */}
        <div className="relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center my-auto py-2 min-h-0">
          {/* LEFT COLUMN (5 Cols): Scroll-Synced Story Card */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentScene.index}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.28, ease: "easeOut" }}
                className="p-6 sm:p-7 rounded-3xl bg-white/92 backdrop-blur-xl border border-sky-200/80 shadow-[0_20px_50px_rgba(15,36,60,0.08)]"
              >
                {/* Stage Badge & Scroll Range */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F0F9FF] border border-sky-200 text-[#0284C7] text-[11px] font-extrabold">
                    <currentScene.icon className="w-3.5 h-3.5 text-[#0EA5E9]" />
                    <span>{currentScene.badge}</span>
                  </span>
                  <span className="text-[11px] font-mono font-bold text-slate-400">
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

                {/* Bottom Action & Financial Guarantee */}
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

          {/* RIGHT COLUMN (7 Cols): Real-Time 3D Isometric WebGL Viewport + Floating Financial Cards */}
          <div className="lg:col-span-7 relative h-[320px] sm:h-[430px] lg:h-[520px] w-full rounded-3xl bg-gradient-to-br from-white via-[#F0F9FF] to-[#E0F2FE] border border-sky-200/90 shadow-[0_25px_60px_rgba(2,132,199,0.12)] overflow-hidden">
            {/* Ambient Subtle Radial Glow */}
            <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-sky-300/25 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-cyan-300/20 blur-3xl pointer-events-none" />

            {/* 3D WebGL Canvas */}
            <NextIndustrialGrowth3D
              progress={progress}
              activeScene={activeScene}
              reducedMotion={reducedMotion}
            />

            {/* FLOATING FINANCIAL CARD 1 (Top-Left of 3D Stage): Protagonist Identity */}
            <div className="absolute top-3.5 left-3.5 sm:top-5 sm:left-5 z-20 px-3.5 py-2 rounded-2xl bg-white/90 backdrop-blur-md border border-sky-200/80 shadow-sm flex items-center gap-2.5 pointer-events-none">
              <div className="w-8 h-8 rounded-xl bg-[#0F243C] text-[#38BDF8] flex items-center justify-center font-black text-xs">
                NE➔XT
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Protagonista Empresarial
                </span>
                <span className="text-xs font-extrabold text-[#0F243C] block">
                  Mismo Empresario • Etapa {activeScene + 1}/4
                </span>
              </div>
            </div>

            {/* FLOATING FINANCIAL CARD 2 (Bottom-Right of 3D Stage): Live Scroll Metric */}
            <div className="absolute bottom-3.5 right-3.5 sm:bottom-5 sm:right-5 z-20 px-4 py-3 rounded-2xl bg-[#0F243C]/95 backdrop-blur-md border border-sky-400/40 text-white shadow-xl pointer-events-none min-w-[190px]">
              <div className="flex items-center justify-between gap-3 mb-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-300">
                  {currentScene.metricTitle}
                </span>
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="text-base sm:text-lg font-black text-white font-mono">
                {currentScene.metricValue}
              </div>
              <span className="text-[10px] font-semibold text-emerald-300 block">
                {currentScene.metricSub}
              </span>
            </div>
          </div>
        </div>

        {/* BOTTOM SCROLL SCRUBBER BAR (0% -> 100%) */}
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
