"use client";

import React, { useState } from "react";
import {
  Zap,
  X,
  Copy,
  Check,
  ExternalLink,
  HelpCircle,
  Bookmark,
  ShieldCheck,
  Building,
  User,
  CreditCard,
  Phone,
  Mail,
  MapPin,
  ChevronRight,
  AlertCircle,
  FileSpreadsheet,
} from "lucide-react";
import {
  generateBankAutoFillBookmarklet,
  generateBankAutoFillRawScript,
  generateConsolidatedDataSheet,
  AutoFillClientData,
} from "@/src/utils/bankAutoFillScript";

interface AutoFillModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientData: AutoFillClientData;
}

export default function AutoFillModal({
  isOpen,
  onClose,
  clientData,
}: AutoFillModalProps) {
  const [copiedBookmarklet, setCopiedBookmarklet] = useState(false);
  const [copiedSheet, setCopiedSheet] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const bookmarkletRef = React.useRef<HTMLAnchorElement>(null);

  const bookmarkletCode = generateBankAutoFillBookmarklet(clientData);
  const rawScriptCode = generateBankAutoFillRawScript(clientData);
  const consolidatedSheet = generateConsolidatedDataSheet(clientData);

  React.useEffect(() => {
    if (bookmarkletRef.current && bookmarkletCode) {
      const el = bookmarkletRef.current;
      try {
        const nativeSetter = Object.getOwnPropertyDescriptor(HTMLAnchorElement.prototype, "href")?.set;
        if (nativeSetter) {
          nativeSetter.call(el, bookmarkletCode);
        } else {
          el.setAttribute("href", bookmarkletCode);
        }
      } catch (err) {
        el.setAttribute("href", bookmarkletCode);
      }
    }
  }, [bookmarkletCode, isOpen]);

  if (!isOpen) return null;

  const handleCopyBookmarklet = () => {
    navigator.clipboard.writeText(rawScriptCode);
    setCopiedBookmarklet(true);
    setTimeout(() => setCopiedBookmarklet(false), 2500);
  };

  const handleCopySheet = () => {
    navigator.clipboard.writeText(consolidatedSheet);
    setCopiedSheet(true);
    setTimeout(() => setCopiedSheet(false), 2500);
  };

  const handleCopyField = (val: string, key: string) => {
    if (!val) return;
    navigator.clipboard.writeText(val);
    setCopiedField(key);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const fieldsList = [
    { label: "Razón Social Empresa", val: clientData.companyName || clientData.clientName, icon: Building, key: "company" },
    { label: "NIT Empresa", val: clientData.companyNit || clientData.documentNumber, icon: CreditCard, key: "nit" },
    { label: "Representante Legal", val: clientData.clientName, icon: User, key: "name" },
    { label: "Cédula / Documento", val: clientData.documentNumber, icon: CreditCard, key: "doc" },
    { label: "Celular / WhatsApp", val: clientData.phone, icon: Phone, key: "phone" },
    { label: "Correo Electrónico", val: clientData.email, icon: Mail, key: "email" },
    { label: "Ciudad", val: clientData.city || "Medellín", icon: MapPin, key: "city" },
    { label: "Monto Solicitado", val: clientData.amount ? `$${clientData.amount.toLocaleString("es-CO")}` : "", icon: Zap, key: "amount" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 text-white px-6 py-4 flex items-center justify-between gap-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-400 font-black">
              <Zap className="w-5 h-5 text-amber-400 fill-amber-400" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white tracking-tight flex items-center gap-2">
                Auto-Fill Bancario (1-Clic)
              </h3>
              <p className="text-xs text-slate-300 font-normal">
                Autocompleta formularios de cualquier banco en 1 segundo
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-slate-800">
          {/* Active Client Badge */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-2xl bg-blue-50 border border-blue-200 text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
              <span>
                Datos cargados para: <strong>{clientData.clientName}</strong> {clientData.companyName ? `(${clientData.companyName})` : ""}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {clientData.documents && clientData.documents.length > 0 && (
                <span className="text-[11px] font-bold text-indigo-700 bg-indigo-100/80 px-2.5 py-0.5 rounded-full border border-indigo-200 flex items-center gap-1">
                  📎 {clientData.documents.length} Docs
                </span>
              )}
              <span className="font-mono text-[11px] font-bold text-blue-800 bg-white px-2.5 py-0.5 rounded-full border border-blue-200">
                {clientData.code || "NEXT"}
              </span>
            </div>
          </div>

          {/* MAIN ACTION: BOOKMARKLET BUTTON */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 text-white shadow-lg shadow-blue-600/25 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-200 block mb-1">
                  HERRAMIENTA MÁGICA DE NAVEGADOR
                </span>
                <h4 className="text-lg font-black text-white">
                  Botón Bookmarklet "Next Auto-Fill"
                </h4>
                <p className="text-xs text-blue-100 mt-1 leading-relaxed">
                  Arrastra el botón hacia tu <strong>barra de marcadores de Chrome/Edge</strong>. Cuando estés en la página del banco, haz clic en él y llenará todos los campos y <strong>adjuntará los documentos (PDFs) automáticamente</strong>.
                </p>
              </div>

              <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                <Bookmark className="w-5 h-5 text-amber-300" />
              </div>
            </div>

            {/* Draggable button */}
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex flex-col sm:flex-row items-center justify-between gap-3">
              <a
                ref={bookmarkletRef}
                onDragStart={(e) => {
                  e.dataTransfer.setData("text/uri-list", bookmarkletCode);
                  e.dataTransfer.setData("text/plain", bookmarkletCode);
                  e.dataTransfer.setData("text/html", `<a href="${bookmarkletCode}">⚡ Next Auto-Fill</a>`);
                }}
                onClick={(e) => {
                  e.preventDefault();
                  handleCopyBookmarklet();
                }}
                className="cursor-grab active:cursor-grabbing px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm flex items-center gap-2 shadow-md shadow-amber-400/30 transition-transform hover:scale-105 active:scale-95 shrink-0"
                title="Arrastra este botón a tu barra de marcadores o haz clic para copiar"
              >
                <Zap className="w-4 h-4 fill-slate-950 text-slate-950" />
                <span>⚡ Next Auto-Fill ({clientData.clientName.split(" ")[0]})</span>
              </a>

              <button
                type="button"
                onClick={handleCopyBookmarklet}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors border border-white/20"
              >
                {copiedBookmarklet ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-300" />
                    <span className="text-emerald-300">¡Código Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar Código</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center justify-between text-[11px] text-blue-200 pt-1">
              <span>💡 Presiona <strong>Ctrl + Shift + B</strong> (o <strong>Cmd + Shift + B</strong> en Mac) si no ves tu barra de marcadores.</span>
              <button
                type="button"
                onClick={() => setShowInstructions(!showInstructions)}
                className="underline hover:text-white font-bold"
              >
                {showInstructions ? "Ocultar guía" : "¿Cómo se usa?"}
              </button>
            </div>

            {/* Collapsible Step-by-Step Instructions */}
            {showInstructions && (
              <div className="p-4 rounded-2xl bg-slate-900/90 text-white border border-white/10 text-xs space-y-2.5 animate-in fade-in">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-[10px] shrink-0">1</span>
                  <span>Arrastra el botón amarillo hacia tu barra de marcadores en Chrome o pulsa "Copiar Código" y agrégalo como marcador.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-[10px] shrink-0">2</span>
                  <span>Abre en otra pestaña el enlace que te mandó el banco (ej: Bancolombia, Davivienda, etc.).</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-[10px] shrink-0">3</span>
                  <span>Haz clic en tu marcador <strong>⚡ Next Auto-Fill</strong>: verás cómo se llenan todos los campos automáticamente y aparece la confirmación de Next en la esquina.</span>
                </div>
              </div>
            )}
          </div>

          {/* SECOND OPTION: QUICK COPY FIELD BY FIELD & CONSOLIDATED DATA */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  Ficha de Datos para Copia Rápida
                </h5>
                <p className="text-[11px] text-slate-500">
                  Por si prefieres copiar campo por campo o copiar la ficha completa:
                </p>
              </div>

              <button
                type="button"
                onClick={handleCopySheet}
                className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-xs font-bold text-slate-700 flex items-center gap-1.5 transition-colors shadow-xs"
              >
                {copiedSheet ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-600">Ficha Copiada</span>
                  </>
                ) : (
                  <>
                    <FileSpreadsheet className="w-3.5 h-3.5 text-blue-600" />
                    <span>Copiar Ficha Completa</span>
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {fieldsList.map((f) => {
                const isCopied = copiedField === f.key;
                const Icon = f.icon;

                return (
                  <div
                    key={f.key}
                    onClick={() => handleCopyField(f.val, f.key)}
                    className="p-2.5 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/40 transition-all cursor-pointer flex items-center justify-between gap-2 group"
                    title="Haz clic para copiar"
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <div className="w-7 h-7 rounded-lg bg-slate-100 group-hover:bg-blue-100 text-slate-600 group-hover:text-blue-600 flex items-center justify-center shrink-0 transition-colors">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="overflow-hidden">
                        <span className="text-[10px] font-bold text-slate-400 block truncate">
                          {f.label}
                        </span>
                        <span className="text-xs font-bold text-slate-900 block truncate">
                          {f.val || "—"}
                        </span>
                      </div>
                    </div>

                    <div className="shrink-0 p-1.5 rounded-md text-slate-400 group-hover:text-blue-600 group-hover:bg-white transition-colors">
                      {isCopied ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex items-center justify-between gap-3 text-xs">
          <span className="text-slate-500 truncate">
            Compatible con Bancolombia, Davivienda, Banco de Bogotá y formularios web.
          </span>
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="/extensions/next-autofill-extension/COMO_INSTALAR.md"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 font-bold hover:underline flex items-center gap-1"
            >
              <span>Guía Extensión Chrome 🧩</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition-colors"
            >
              Listo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
