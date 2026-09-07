"use client";

import { MessageCircle, Phone } from "lucide-react";
import { COMPANY_INFO } from "@/src/data/uniforms-data";

export function Floating() {
  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
      <a
        href={`https://wa.me/${COMPANY_INFO.whatsappNumber}?text=Hola%20Distripako,%20deseo%20cotizar%20una%20dotaci%C3%B3n%20para%20mi%20empresa`}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center gap-3 rounded-full bg-emerald-600 px-4 py-3 text-white shadow-xl shadow-emerald-950/30 transition-all hover:bg-emerald-500 hover:scale-105 active:scale-95"
        aria-label="Hablar por WhatsApp con un Asesor de Distripako"
      >
        <span className="hidden sm:inline font-bold text-xs">
          Cotizar por WhatsApp
        </span>

        {/* WhatsApp Icon */}
        <div className="relative">
          <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white" />
          </span>
          <MessageCircle size={22} className="fill-white stroke-emerald-600" />
        </div>
      </a>
    </div>
  );
}
