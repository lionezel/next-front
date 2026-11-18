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
  Grid,
} from "lucide-react";
import { VerticalKey } from "@/src/types/common";
import type { PixelResolutionMode } from "@/src/components/3d/NextIndustrialGrowth3D";

/**
 * ============================================================================
 * CONFIGURACIÓN DE VELOCIDAD, DURACIÓN Y TRANSICIONES DEL SCROLL 3D PIXEL-ART
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
      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#0F243C] via-[#132F5C] to-[#081C45] rounded-3xl border border-sky-400/30">
        <div className="w-12 h-12 rounded-xl bg-[#38BDF8] text-[#081C45] flex items-center justify-center font-black text-sm animate-pulse shadow-lg font-mono mb-3">
          NE&gt;XT
        </div>
        <span className="text-xs font-mono font-bold text-sky-200 tracking-wider uppercase">
          Renderizando Mundo Voxel Pixel-Art...
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
  const [pixelMode, setPixelMode] = useState<PixelResolutionMode>("hd-pixel");

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
      shortLabel: "01. Taller Inicial",
      badge: "Nivel 1 • Pequeña Instalación Manufacturera",
      title: "Un negocio organizado listo para multiplicar su escala",
      description:
        "El empresario cuenta con una instalación manufacturera limpia, máquina CNC de engranaje activo y línea inicial de producción, pero requiere capital estratégico para expandir su planta.",
      bullets: [
        "Módulo productivo inicial con maquinaria activa y flujo ordenado",
        "Empresario fundador supervisando directamente el primer lote",
        "Potencial inmediato para atender pedidos industriales mayores",
      ],
      metricTitle: "Capacidad Instalada",
      metricValue: "1.200 uds/mes",
      metricSub: "NIVEL 01 • TALLER ACTIVO",
      icon: Factory,
    },
    {
      index: 1,
      rangeLabel: "25% – 50%",
      shortLabel: "02. Capital NEXT",
      badge: "Nivel 2 • Financiación Corporativa NEXT",
      title: "Aparece el respaldo financiero de NEXT en 3D",
      description:
        "La tarjeta corporativa NEXT desciende sobre la empresa activando el flujo de liquidez multibanca (+35 entidades aliadas), con tasas preferenciales y 0% cobros por adelantado.",
      bullets: [
        "Tarjeta corporativa 3D NEXT y monedas de liquidez en órbita",
        "Inyección directa para maquinaria, insumos y capital de trabajo",
        "Estudio sin costo y estructura financiera a la medida del negocio",
      ],
      metricTitle: "Línea Aprobada NEXT",
      metricValue: "$450.000.000",
      metricSub: "DESEMBOLSO ACTIVO • IBR",
      icon: CreditCard,
    },
    {
      index: 2,
      rangeLabel: "50% – 75%",
      shortLabel: "03. Expansión Planta",
      badge: "Nivel 3 • Construcción & Automatización",
      title: "Nuevas naves, robótica, almacenamiento y equipo",
      description:
        "Bloque a bloque se construye la ampliación industrial: se extiende la banda transportadora, entran en operación 3 brazos robóticos, bodega de estanterías en altura y nuevos operadores.",
      bullets: [
        "3 brazos robóticos articulados ensamblando en línea continua",
        "Estanterías de almacenamiento industrial con carga clasificada",
        "Nuevos operadores especializados integrados a la operación",
      ],
      metricTitle: "Capacidad en Expansión",
      metricValue: "6.800 uds/mes",
      metricSub: "+320% PRODUCTIVIDAD",
      icon: Cpu,
    },
    {
      index: 3,
      rangeLabel: "75% – 100%",
      shortLabel: "04. Industria Líder",
      badge: "Nivel 4 • Industria Manufacturera Consolidada",
      title: "Una gran industria moderna dirigida por el mismo fundador",
      description:
        "Se eleva la torre corporativa iluminada, llega el transporte logístico de distribución y crecen las barras financieras, con el mismo empresario dirigiendo el complejo desde su balcón ejecutivo.",
      bullets: [
        "Torre ejecutiva iluminada y planta manufacturera 100% consolidada",
        "Flota de transporte logístico en ruta y crecimiento patrimonial",
        "El mismo empresario liderando su industria al máximo nivel",
      ],
      metricTitle: "Producción Consolidada",
      metricValue: "15.000 uds/mes",
      metricSub: "NIVEL MÁXIMO • INDUSTRIA 360°",
      icon: Building2,
    },
  ];

  const currentScene = scenesData[activeScene];
  const progressPercent = Math.round(progress * 100);
  const totalBlocks = 20;
  const filledBlocks = Math.round((progressPercent / 100) * totalBlocks);

  return (
    <section
      ref={sectionRef}
      style={{ height: `${NEXT_3D_SCROLL_CONFIG.sectionHeightVh}vh` }}
      className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] bg-gradient-to-b from-[#F8FAFC] via-[#EFF6FF] to-[#E0F2FE] select-none"
    >
      {/* Subtle Pixel Dot Matrix Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-[0.35] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(#93C5FD 1.25px, transparent 1.25px)",
          backgroundSize: "16px 16px",
        }}
      />

      {/* STICKY FULL-VIEWPORT INTERACTIVE STAGE */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between py-5 sm:py-7 px-4 sm:px-8 lg:px-14 max-w-[1440px] mx-auto">
        {/* TOP HEADER & 4-STAGE PIXEL-VOXEL TIMELINE */}
        <div className="relative z-20 flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3.5 border-b border-sky-200/80">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#0F243C] text-[#38BDF8] text-[11px] font-mono font-extrabold uppercase tracking-wider mb-1.5 shadow-xs">
              <Grid className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>Voxel Pixel-Art 3D • Transformación Industrial NEXT</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#0F243C] tracking-tight">
              De Pequeño Negocio a{" "}
              <span className="gradient-text-sky">
                Industria Manufacturera Consolidada
              </span>
            </h2>
          </div>

          {/* Interactive Stage Switcher Buttons */}
          <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-white/95 backdrop-blur-md border-2 border-sky-200/90 shadow-xs overflow-x-auto">
            {scenesData.map((sc) => {
              const isActive = activeScene === sc.index;
              return (
                <button
                  key={sc.index}
                  onClick={() => scrollToScene(sc.index)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-extrabold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                    isActive
                      ? "bg-[#0F243C] text-[#38BDF8] shadow-sm"
                      : "text-slate-600 hover:text-[#0F243C] hover:bg-sky-50"
                  }`}
                >
                  <span
                    className={`w-2 h-2 ${
                      isActive ? "bg-[#38BDF8]" : "bg-slate-300"
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
                transition={{ duration: 0.24, ease: "easeOut" }}
                className="p-6 sm:p-7 rounded-3xl bg-white/95 backdrop-blur-xl border-2 border-sky-200/90 shadow-[0_18px_45px_rgba(15,36,60,0.09)]"
              >
                {/* Stage Badge & Scroll Range */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#F0F9FF] border border-sky-200 text-[#0284C7] text-[11px] font-mono font-extrabold">
                    <currentScene.icon className="w-3.5 h-3.5 text-[#0EA5E9]" />
                    <span>{currentScene.badge}</span>
                  </span>
                  <span className="text-[11px] font-mono font-extrabold text-[#0284C7] bg-sky-50 px-2 py-0.5 rounded-md border border-sky-100">
                    {currentScene.rangeLabel}
                  </span>
                </div>

                {/* Scene Title */}
                <h3 className="text-xl sm:text-2xl lg:text-[26px] font-black text-[#0F243C] leading-[1.14] tracking-tight mb-3">
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
                      className="flex items-start gap-2.5 text-xs sm:text-[13px] text-[#0F243C] font-medium"
                    >
                      <span className="w-4 h-4 rounded-xs bg-sky-100 border border-sky-300 text-[#0284C7] flex items-center justify-center shrink-0 mt-0.5 font-mono text-[10px] font-black">
                        ✓
                      </span>
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
                    className="px-5 py-2.5 rounded-xl bg-[#38BDF8] hover:bg-[#0EA5E9] text-[#081C45] font-extrabold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-[0_4px_0_#0284C7] active:translate-y-0.5 cursor-pointer"
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

          {/* RIGHT COLUMN (7 Cols): Isometric Voxel Pixel-Art 3D Diorama Stage */}
          <div className="lg:col-span-7 relative h-[330px] sm:h-[440px] lg:h-[530px] w-full rounded-3xl bg-gradient-to-b from-[#0B1D3A] via-[#12325E] to-[#1D4E89] border-2 border-sky-300/80 shadow-[0_25px_60px_rgba(8,28,69,0.22)] overflow-hidden">
            {/* Pixel-Art Star/Grid Backdrop inside 3D Viewport */}
            <div
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage:
                  "linear-gradient(to right, rgba(125,211,252,0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(125,211,252,0.2) 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />

            {/* Soft Sky Horizon Glow behind the Voxel Island */}
            <div className="absolute inset-x-10 bottom-10 h-48 rounded-full bg-sky-400/25 blur-3xl pointer-events-none" />

            {/* 3D Voxel Pixel-Art WebGL Canvas */}
            <NextIndustrialGrowth3D
              progress={progress}
              activeScene={activeScene}
              reducedMotion={reducedMotion}
              pixelMode={pixelMode}
            />

            {/* TOP-LEFT FLOATING PIXEL HUD: Protagonist Status */}
            <div className="absolute top-3.5 left-3.5 sm:top-4 sm:left-4 z-20 px-3 py-2 rounded-xl bg-[#081C45]/90 backdrop-blur-md border border-sky-400/50 text-white shadow-lg flex items-center gap-2.5 pointer-events-none">
              <div className="w-8 h-8 rounded-lg bg-[#38BDF8] text-[#081C45] flex items-center justify-center font-mono font-black text-xs shadow-inner">
                NX
              </div>
              <div>
                <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-sky-300 block">
                  FUNDADOR PROTAGONISTA
                </span>
                <span className="text-xs font-mono font-extrabold text-white block">
                  NIVEL {activeScene + 1}/4 • {currentScene.shortLabel.slice(4)}
                </span>
              </div>
            </div>

            {/* TOP-RIGHT INTERACTIVE PIXEL RESOLUTION SWITCHER */}
            <div className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 z-20 flex items-center gap-1 p-1 rounded-xl bg-[#081C45]/90 backdrop-blur-md border border-sky-400/50 text-[10px] font-mono font-bold">
              {(
                [
                  { id: "retro", label: "Pixel 16-Bit" },
                  { id: "hd-pixel", label: "Pixel HD" },
                  { id: "voxel-crisp", label: "Voxel Nítido" },
                ] as { id: PixelResolutionMode; label: string }[]
              ).map((m) => (
                <button
                  key={m.id}
                  onClick={() => setPixelMode(m.id)}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    pixelMode === m.id
                      ? "bg-[#38BDF8] text-[#081C45] font-black"
                      : "text-sky-200 hover:text-white"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {/* BOTTOM-RIGHT FLOATING PIXEL HUD: Live Production Metric */}
            <div className="absolute bottom-3.5 right-3.5 sm:bottom-4 sm:right-4 z-20 px-4 py-2.5 rounded-xl bg-[#081C45]/95 backdrop-blur-md border-2 border-sky-400/60 text-white shadow-xl pointer-events-none min-w-[200px]">
              <div className="flex items-center justify-between gap-3 mb-0.5">
                <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-sky-300">
                  {currentScene.metricTitle}
                </span>
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="text-base sm:text-lg font-mono font-black text-white">
                {currentScene.metricValue}
              </div>
              <span className="text-[9px] font-mono font-bold text-emerald-400 block">
                {currentScene.metricSub}
              </span>
            </div>
          </div>
        </div>

        {/* BOTTOM STEPPED PIXEL-ART PROGRESS BAR (0% -> 100%) */}
        <div className="relative z-20 pt-2.5 flex items-center gap-3">
          <span className="text-[11px] font-mono font-extrabold text-[#0F243C] whitespace-nowrap">
            EXPANSIÓN: {progressPercent}%
          </span>

          {/* Segmented Pixel Blocks Progress Bar */}
          <div className="flex-1 grid grid-cols-20 gap-1 p-1 rounded-lg bg-white/90 border border-sky-200">
            {Array.from({ length: totalBlocks }).map((_, i) => (
              <div
                key={i}
                className={`h-2 rounded-[2px] transition-colors duration-75 ${
                  i < filledBlocks
                    ? i >= 15
                      ? "bg-emerald-500"
                      : "bg-[#0EA5E9]"
                    : "bg-sky-100"
                }`}
              />
            ))}
          </div>

          <span className="text-[11px] font-mono font-bold text-slate-500 hidden sm:inline whitespace-nowrap">
            [SCROLL ARRIBA / ABAJO]
          </span>
        </div>
      </div>
    </section>
  );
}
