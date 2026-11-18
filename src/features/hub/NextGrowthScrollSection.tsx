"use client";

import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { ChevronRight } from "lucide-react";
import { VerticalKey } from "@/src/types/common";

export const NEXT_3D_SCROLL_CONFIG = {
  dampingFactor: 0.14,
  thresholds: {
    scene1End: 0.25,
    scene2End: 0.5,
    scene3End: 0.75,
    scene4End: 1.0,
  },
};

const NextIndustrialGrowth3D = dynamic(
  () => import("@/src/components/3d/NextIndustrialGrowth3D"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-2xl bg-[#0F243C] text-[#38BDF8] flex items-center justify-center font-black text-sm animate-pulse shadow-md font-mono mb-3">
          NE➔XT
        </div>
        <span className="text-xs font-bold text-[#0F243C]/60 tracking-wider uppercase">
          Cargando Mundo 3D...
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

  const scenesData = [
    {
      index: 0,
      stepTag: "01 • Punto de Partida",
      title: "Un negocio organizado listo para multiplicar su escala",
      bullets: [
        "Evaluamos la operación de tu empresa con más de 35 bancos y entidades aliadas en Colombia.",
        "$0 de cobros anticipados y diagnóstico de viabilidad en 24 horas sin costos ocultos.",
        "Ideal para empresarios con taller o negocio activo que buscan dar el salto industrial.",
        "Estructuramos capital de trabajo, compra de cartera, confirming y factoring con tasas competitivas.",
      ],
      primaryCta: "Solicitar estudio",
      secondaryCta: "Conoce nuestras líneas",
      vertical: "credito" as VerticalKey,
    },
    {
      index: 1,
      stepTag: "02 • Financiación Corporativa NEXT",
      title: "Una tarjeta y línea empresarial que inyecta liquidez inmediata",
      bullets: [
        "Aparece el respaldo financiero de NEXT con cupos estructurados desde $20M hasta $5.000M+.",
        "Tasas preferenciales indexadas a IBR y plazos adaptados al ciclo productivo de tu empresa.",
        "Sin filas bancarias ni trámites notariales engorrosos: validación y activación 100% digital.",
        "Desembolso directo a la cuenta bancaria de tu empresa para disponer del capital de inmediato.",
      ],
      primaryCta: "Activar cupo NEXT",
      secondaryCta: "Pide tu tarjeta corporativa",
      vertical: "credito" as VerticalKey,
    },
    {
      index: 2,
      stepTag: "03 • Expansión de Planta & Equipo",
      title: "Tu empresa construye nuevas naves, automatiza y suma talento",
      bullets: [
        "El capital desembolsado se transforma en maquinaria nueva, robótica y líneas continuas de producción.",
        "Ampliación de bodegas de almacenamiento e inventario comprado a precios de contado.",
        "Incorporación de nuevos operadores especializados y blindaje con Seguros 360° (ahorro hasta del 50%).",
        "Flujo de caja protegido para atender licitaciones y pedidos corporativos de gran volumen.",
      ],
      primaryCta: "Impulsar mi planta",
      secondaryCta: "Ver blindaje y seguros",
      vertical: "seguros" as VerticalKey,
    },
    {
      index: 3,
      stepTag: "04 • Industria Consolidada",
      title: "Una gran industria moderna dirigida por su mismo fundador",
      bullets: [
        "Tu negocio alcanza su máximo nivel: torre ejecutiva, planta automatizada y flota logística activa.",
        "Crecimiento sostenido en facturación con acompañamiento patrimonial continuo de NEXT.",
        "Rentabiliza los excedentes de tu industria en portafolios de inversión fiduciaria vigilada.",
        "El mismo empresario liderando una operación consolidada, sólida y lista para nuevos mercados.",
      ],
      primaryCta: "Consolidar mi empresa",
      secondaryCta: "Simular inversión",
      vertical: "inversiones" as VerticalKey,
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] bg-[#e4eef8] select-none"
    >
      <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-14 lg:px-24 grid grid-cols-1 lg:grid-cols-12 items-start gap-8">
        {/* LEFT COLUMN (5 Cols): Natural Page Scroll through the 4 Editorial Blocks (Just like Lulo Cards!) */}
        <div className="lg:col-span-5 relative z-20 py-12 lg:py-0">
          {scenesData.map((sc) => (
            <div
              key={sc.index}
              className="min-h-[75vh] lg:min-h-[92vh] flex flex-col justify-center py-12"
            >
              <span className="inline-flex items-center self-start px-3.5 py-1 rounded-full bg-white/85 text-[#0284C7] text-xs font-extrabold uppercase tracking-wider mb-5 shadow-2xs">
                {sc.stepTag}
              </span>

              <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-[#0f243c] leading-[1.06] tracking-[-0.04em] mb-7">
                {sc.title}
              </h2>

              <ul className="list-disc pl-5 space-y-3.5 text-[#0f243c] text-sm sm:text-[17px] leading-[1.48] mb-9">
                {sc.bullets.map((bullet, bIdx) => (
                  <li key={bIdx}>{bullet}</li>
                ))}
              </ul>

              <div className="flex flex-wrap items-center gap-6">
                <button
                  onClick={() =>
                    onSelectVertical && onSelectVertical(sc.vertical)
                  }
                  className="px-7 py-3.5 rounded-full bg-[#38bdf8] hover:bg-[#0ea5e9] text-[#081c45] font-extrabold text-sm sm:text-base flex items-center gap-3 transition-all active:scale-95 cursor-pointer shadow-lg shadow-sky-400/30"
                >
                  <span>{sc.primaryCta}</span>
                  <ChevronRight className="w-4 h-4 stroke-[3]" />
                </button>

                <button
                  onClick={() =>
                    onSelectVertical && onSelectVertical(sc.vertical)
                  }
                  className="text-[#0f243c] font-extrabold text-sm sm:text-base hover:text-sky-600 transition-colors cursor-pointer"
                >
                  {sc.secondaryCta}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT COLUMN (7 Cols): Sticky Un-Boxed 3D Voxel World Floating Directly on the Page Background */}
        <div className="lg:col-span-7 lg:sticky lg:top-0 h-[440px] sm:h-[560px] lg:h-screen w-full flex items-center justify-center relative z-10">
          {/* Subtle Ambient Glow behind the floating 3D Voxel Island */}
          <div className="absolute w-[75%] h-[65%] rounded-full bg-sky-300/30 blur-3xl pointer-events-none" />

          <div className="w-full h-full max-h-[720px] relative">
            <NextIndustrialGrowth3D
              progress={progress}
              activeScene={activeScene}
              reducedMotion={reducedMotion}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
