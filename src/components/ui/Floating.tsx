"use client";

import React from "react";
import Link from "next/link";
import { MessageCircle, Calendar, Video } from "lucide-react";
import { ECOSYSTEM_INFO } from "@/src/config/verticals";

export function Floating() {
  return (
    <div className="hidden md:flex fixed bottom-6 right-6 z-40 flex-col items-end gap-2.5">
      {/* Appointment Floating Button */}
      <Link
        href="/citas"
        className="group relative flex items-center gap-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 shadow-lg transition-all hover:scale-105 active:scale-95"
        aria-label="Agendar Cita en Línea"
      >
        <Calendar className="w-4 h-4 text-emerald-400" />
        <span className="font-bold text-xs tracking-wide">
          Agendar Cita
        </span>
      </Link>

      {/* WhatsApp Button */}
      <a
        href={`https://wa.me/${ECOSYSTEM_INFO.contact.whatsapp.replace(/[^0-9]/g, "")}?text=Hola,%20quisiera%20solicitar%20asesor%C3%ADa%20personalizada%20con%20un%20especialista`}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center gap-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 shadow-lg transition-all hover:scale-105 active:scale-95"
        aria-label="Hablar por WhatsApp con un Asesor"
      >
        <span className="font-bold text-xs tracking-wide">
          WhatsApp Directo
        </span>
        <MessageCircle size={18} className="fill-white stroke-none" />
      </a>
    </div>
  );
}

export default Floating;
