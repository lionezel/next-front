"use client";

import React from "react";
import { CheckCircle2, X } from "lucide-react";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  referenceCode?: string;
  actionText?: string;
}

export default function SuccessModal({
  isOpen,
  onClose,
  title,
  message,
  referenceCode,
  actionText = "Entendido",
}: SuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
          aria-label="Cerrar"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
        <p className="text-sm text-slate-600 mb-6 leading-relaxed">{message}</p>

        {referenceCode && (
          <div className="mb-6 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-xs text-slate-500 block mb-1 uppercase tracking-wider font-semibold">
              Código de Solicitud / Radicado:
            </span>
            <span className="text-base font-mono font-bold text-blue-600">
              {referenceCode}
            </span>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/20 transition-all duration-200"
        >
          {actionText}
        </button>
      </div>
    </div>
  );
}
