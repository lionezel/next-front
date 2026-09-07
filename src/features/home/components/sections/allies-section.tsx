"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { subscribePartners } from "@/src/services/firebase/partners.service";
import { Partner } from "@/src/types/firebase";

export function AlliesSection() {
  const [partnerList, setPartnerList] = useState<Partner[]>([]);

  useEffect(() => {
    const unsubscribe = subscribePartners((data) => {
      setPartnerList(data);
    });

    return () => {
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, []);

  // Repeat items if list is small to maintain nice marquee effect
  const displayPartners = partnerList.length > 0 ? partnerList : [];
  const marqueeItems = [...displayPartners, ...displayPartners, ...displayPartners];

  return (
    <section className="border-y border-zinc-100 bg-white py-16 overflow-hidden">
      <div className="container mx-auto px-6 text-center lg:px-12 mb-10">
        <h3 className="text-sm font-semibold uppercase tracking-widest text-zinc-400">
          Empresas que confían en nuestras Dotaciones
        </h3>
      </div>

      <div className="relative flex overflow-hidden w-full group mask-image-linear-edges">
        <div className="flex whitespace-nowrap group-hover:[animation-play-state:paused] animate-marquee">
          {/* Repeated logo track for smooth continuous display */}
          <div className="flex items-center gap-16 md:gap-24 px-8 md:px-12">
            {marqueeItems.map((partner, index) => {
              const src = partner.logoUrl || `/logos/${partner.id}.png`;
              return (
                <div
                  key={`${partner.id}-${index}`}
                  className="flex flex-col items-center justify-center opacity-60 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0 min-w-[140px] px-2"
                >
                  {src.startsWith("http") || src.startsWith("/") ? (
                    <Image
                      src={src}
                      alt={`Logo de ${partner.name}`}
                      width={130}
                      height={50}
                      className="h-12 w-auto max-w-[130px] object-contain cursor-pointer transition-transform hover:scale-105"
                      unoptimized={src.startsWith("http")}
                    />
                  ) : (
                    <span className="font-bold text-slate-700 text-sm tracking-wide">
                      {partner.name}
                    </span>
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