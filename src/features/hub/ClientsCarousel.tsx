"use client";

import React, { useEffect, useState } from "react";
import { Partner } from "@/src/types/firebase";
import { subscribePartners, fallbackPartners } from "@/src/services/firebase/partners.service";

// Crisp SVG Wordmarks / Logos for financial and wellness partners
function PartnerWordmark({ name }: { name: string }) {
  const brandStyles: Record<string, { font: string; icon?: string; color: string }> = {
    Bancolombia: { font: "font-black tracking-tight", color: "text-slate-800" },
    "Banco de Bogotá": { font: "font-black tracking-normal", color: "text-slate-800" },
    Corficolombiana: { font: "font-extrabold tracking-wide", color: "text-slate-800" },
    "Credicorp Capital": { font: "font-bold tracking-tight", color: "text-slate-800" },
    "Sura Seguros": { font: "font-black tracking-tighter text-base", color: "text-slate-800" },
    "Seguros Bolívar": { font: "font-extrabold tracking-normal", color: "text-slate-800" },
    "Smart Fit Club": { font: "font-black tracking-tight uppercase", color: "text-slate-800" },
    "Bodytech Fitness": { font: "font-black tracking-widest uppercase", color: "text-slate-800" },
  };

  const style = brandStyles[name] || { font: "font-bold tracking-tight", color: "text-slate-800" };

  return (
    <div className="flex items-center gap-2">
      <div className="w-2 h-2 rounded-full bg-slate-400 group-hover:bg-slate-900 transition-colors" />
      <span className={`text-sm sm:text-base ${style.font} ${style.color} whitespace-nowrap`}>
        {name}
      </span>
    </div>
  );
}

interface ClientsCarouselProps {
  category?: string;
  title?: string;
  subtitle?: string;
}

export default function ClientsCarousel({ category, title, subtitle }: ClientsCarouselProps = {}) {
  const [partners, setPartners] = useState<Partner[]>(fallbackPartners);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const unsub = subscribePartners((data) => {
      if (data && data.length > 0) {
        setPartners(data);
      }
    });

    return () => unsub();
  }, []);

  // Marquee repeat items (duplicated 3 times for a seamless infinite loop)
  const displayItems =
    partners.length === 0
      ? []
      : [...partners, ...partners, ...partners];

  return (
    <section className="py-6 sm:py-8 bg-white border-b border-slate-200/80 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Subtle, quiet heading */}
        <p className="text-center text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 sm:mb-6">
          Respaldado por las principales entidades del sector
        </p>

        {/* Infinite Logo Marquee Strip */}
        <div
          className="relative w-full overflow-hidden mask-gradient-x"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Subtle fade on edges */}
          <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

          <div
            className={`flex items-center gap-8 sm:gap-14 w-max ${
              isPaused ? "" : "animate-marquee"
            }`}
          >
            {displayItems.map((partner, index) => {
              return (
                <div
                  key={`${partner.id}-${index}`}
                  className="flex items-center justify-center px-4 py-2 opacity-60 hover:opacity-100 grayscale hover:grayscale-0 transition-all duration-300 group cursor-default select-none shrink-0"
                  title={partner.name}
                >
                  {partner.logoUrl ? (
                    <img
                      src={partner.logoUrl}
                      alt={partner.name}
                      className="h-7 sm:h-9 max-w-[120px] sm:max-w-[150px] object-contain filter transition-all duration-300"
                    />
                  ) : (
                    <PartnerWordmark name={partner.name} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
