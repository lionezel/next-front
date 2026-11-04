"use client";

import React from "react";
import { X, Calendar } from "lucide-react";
import CalendlyEmbed from "./CalendlyEmbed";
import { CALENDLY_CONFIG } from "@/src/config/verticals";

interface CalendlyModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialEventKey?: keyof typeof CALENDLY_CONFIG.events;
}

export default function CalendlyModal({
  isOpen,
  onClose,
  initialEventKey = "general",
}: CalendlyModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-5xl my-auto animate-in fade-in zoom-in-95 duration-200">
        <div className="relative">
          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 z-20 w-10 h-10 rounded-full bg-slate-900 text-white hover:bg-slate-800 shadow-xl border-2 border-white flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>

          <CalendlyEmbed initialEventKey={initialEventKey} />
        </div>
      </div>
    </div>
  );
}
