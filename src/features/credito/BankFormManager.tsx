"use client";

import React, { useState, useEffect } from "react";
import {
  Folder,
  FileText,
  Upload,
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Building2,
  Cpu,
  FileSearch,
  Download,
  Copy,
  Zap,
  Info,
  Layers,
  UserCheck,
  Briefcase,
  TrendingUp,
} from "lucide-react";
import { BankFolder, BankTemplate, EconomicActivityProfile, ExtractedFinancialProfile } from "@/src/types/bankForm";
import { DEFAULT_BANKS, PROFILE_REQUIREMENT_MATRIX, ALL_DOCUMENT_TYPES } from "@/src/data/bankProfileMatrix";
import { getBankFolders, addBankTemplate, deleteBankTemplate } from "@/src/services/firebase/bankFoldersService";
import { parseDocumentWithAI } from "@/src/services/aiDocumentParser";
import { generateBankAutoFillBookmarklet, generateConsolidatedDataSheet } from "@/src/utils/bankAutoFillScript";
import { downloadAutoFilledBankFormPDF } from "@/src/utils/pdfFormFiller";

export default function BankFormManager() {
  const [banks, setBanks] = useState<BankFolder[]>(DEFAULT_BANKS);
  const [selectedBankId, setSelectedBankId] = useState<string>("bbva");
  const [selectedProfile, setSelectedProfile] = useState<EconomicActivityProfile>("asalariado_empleado");
  const [loading, setLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"plantillas" | "matriz" | "ia_lectura">("plantillas");

  // Modal para agregar plantilla
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newFormType, setNewFormType] = useState<"pdf_acroform" | "web_portal" | "google_form">("pdf_acroform");
  const [newFile, setNewFile] = useState<File | null>(null);

  // Estado del Analizador de Documentos con IA
  const [parsingDoc, setParsingDoc] = useState<boolean>(false);
  const [aiProfile, setAiProfile] = useState<ExtractedFinancialProfile | null>(null);
  const [lastParsedDocType, setLastParsedDocType] = useState<string>("");

  useEffect(() => {
    loadBankFolders();
  }, []);

  const loadBankFolders = async () => {
    setLoading(true);
    try {
      const data = await getBankFolders();
      setBanks(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const currentBank = banks.find((b) => b.id === selectedBankId) || banks[0];
  const currentMatrixRule = PROFILE_REQUIREMENT_MATRIX.find((m) => m.activityProfile === selectedProfile);

  const handleAddTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    try {
      const updated = await addBankTemplate(selectedBankId, {
        bankId: selectedBankId,
        title: newTitle,
        description: newDesc,
        formType: newFormType,
        fileName: newFile ? newFile.name : "formulario_oficial.pdf",
        fileUrl: newFile ? URL.createObjectURL(newFile) : "",
      });
      setBanks(updated);
      setNewTitle("");
      setNewDesc("");
      setNewFile(null);
      setShowUploadModal(false);
    } catch (error) {
      alert("Error al agregar la plantilla");
    }
  };

  const handleDeleteTemplate = async (tplId: string) => {
    if (!confirm("¿Deseas eliminar esta plantilla?")) return;
    try {
      const updated = await deleteBankTemplate(selectedBankId, tplId);
      setBanks(updated);
    } catch (error) {
      alert("Error al eliminar la plantilla");
    }
  };

  // Simulación de prueba de la IA leyendo un documento
  const handleTestAIDocument = async (docType: any, sampleFileName: string) => {
    setParsingDoc(true);
    setLastParsedDocType(docType);
    try {
      const parsed = await parseDocumentWithAI(docType, "", sampleFileName, aiProfile || undefined);
      setAiProfile(parsed);
    } catch (e) {
      console.error(e);
    } finally {
      setParsingDoc(false);
    }
  };

  return (
    <div className="space-y-8 p-4 sm:p-6 bg-slate-900 text-slate-100 rounded-3xl border border-slate-800 shadow-2xl">
      {/* Encabezado Principal */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Gestión Inteligente de Créditos & IA
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Gestor de Bancos y Formularios
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Administra las carpetas de bancos (BBVA, Itaú, AV Villas, Bogotá, Bancolombia), sube plantillas de radicación y procesa documentos con IA para autocompletar formularios.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold text-sm hover:from-emerald-600 hover:to-teal-700 transition shadow-lg shadow-emerald-900/30"
          >
            <Plus className="w-4 h-4" />
            Subir Formulario a {currentBank?.name}
          </button>
        </div>
      </div>

      {/* Tabs Selector de Banco (Carpetas) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {banks.map((bank) => {
          const isSelected = bank.id === selectedBankId;
          return (
            <button
              key={bank.id}
              onClick={() => setSelectedBankId(bank.id)}
              className={`flex items-center gap-3 p-3.5 rounded-2xl border transition-all text-left relative overflow-hidden group ${
                isSelected
                  ? "bg-slate-800 border-emerald-500/50 text-white shadow-xl ring-2 ring-emerald-500/20"
                  : "bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
              }`}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm text-white shadow-md shrink-0"
                style={{ backgroundColor: bank.color || "#059669" }}
              >
                {bank.code.substring(0, 3)}
              </div>
              <div className="truncate min-w-0">
                <div className="font-bold text-sm truncate text-white">{bank.name}</div>
                <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                  <FileText className="w-3 h-3 text-emerald-400" />
                  {bank.templates?.length || 0} plantillas
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Navegación por Pestañas Secundarias */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab("plantillas")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition ${
            activeTab === "plantillas"
              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Folder className="w-4 h-4" />
          Plantillas del Banco ({currentBank?.name})
        </button>
        <button
          onClick={() => setActiveTab("matriz")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition ${
            activeTab === "matriz"
              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Layers className="w-4 h-4" />
          Matriz de Requisitos por Perfil
        </button>
        <button
          onClick={() => setActiveTab("ia_lectura")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition ${
            activeTab === "ia_lectura"
              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Cpu className="w-4 h-4 text-emerald-400" />
          Lectura de Documentos con IA & Auto-Llenado
        </button>
      </div>

      {/* CONTENIDO TAB 1: PLANTILLAS DEL BANCO */}
      {activeTab === "plantillas" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-800/40 border border-slate-800">
            <div className="flex items-center gap-3">
              <Building2 className="w-6 h-6 text-emerald-400" />
              <div>
                <h3 className="font-bold text-white text-base">{currentBank?.name} — Carpeta de Radicación</h3>
                <p className="text-xs text-slate-400">{currentBank?.description}</p>
              </div>
            </div>
            {currentBank?.portalUrl && (
              <a
                href={currentBank.portalUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-xs text-emerald-400 hover:underline font-semibold"
              >
                Portal Oficial <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentBank?.templates && currentBank.templates.length > 0 ? (
              currentBank.templates.map((tpl) => (
                <div
                  key={tpl.id}
                  className="p-5 rounded-2xl bg-slate-800/70 border border-slate-700/60 hover:border-emerald-500/40 transition group flex flex-col justify-between space-y-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm group-hover:text-emerald-300 transition">
                          {tpl.title}
                        </h4>
                        <p className="text-xs text-slate-400 mt-0.5">{tpl.description}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteTemplate(tpl.id)}
                      className="text-slate-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-slate-700/50 transition"
                      title="Eliminar plantilla"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-700/50 text-xs">
                    <span className="px-2.5 py-1 rounded-md bg-slate-900 text-slate-300 font-mono font-medium">
                      {tpl.fileName || "formulario.pdf"}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          downloadAutoFilledBankFormPDF({
                            bankName: currentBank.name,
                            bankCode: currentBank.code,
                            bankColorHex: currentBank.color,
                            profile: aiProfile || {
                              clientName: "",
                              firstName: "CARLOS",
                              secondName: "ALBERTO",
                              firstLastName: "RODRIGUEZ",
                              secondLastName: "GOMEZ",
                              documentType: "CC",
                              documentNumber: "",
                              phone: "3001234567",
                              city: "Medellín",
                              address: "Calle 10 # 43A - 25",
                              monthlyIncome: 4800000,
                              monthlyExpenses: 1400000,
                              companyName: "INDUSTRIAS Y SERVICIOS S.A.S.",
                              companyNit: "900.123.456-7",
                              jobPosition: "Director de Operaciones",
                            },
                          });
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-extrabold hover:bg-emerald-400 transition shadow-md"
                      >
                        <Zap className="w-3.5 h-3.5 fill-current" />
                        Descargar Formulario Diligenciado IA
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 p-12 text-center rounded-2xl bg-slate-800/20 border border-dashed border-slate-800">
                <FileSearch className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                <h4 className="text-slate-300 font-semibold text-sm">No hay plantillas cargadas para este banco</h4>
                <p className="text-xs text-slate-500 mt-1 mb-4">
                  Sube los formularios PDF editables de {currentBank?.name} para que la IA los autocomplete.
                </p>
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-500 transition inline-flex items-center gap-2"
                >
                  <Upload className="w-3.5 h-3.5" /> Subir Primera Plantilla
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CONTENIDO TAB 2: MATRIZ DE REQUISITOS POR PERFIL */}
      {activeTab === "matriz" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-2xl bg-slate-800/40 border border-slate-800">
            <div>
              <h3 className="font-bold text-white text-base">Matriz de Documentos Exigidos</h3>
              <p className="text-xs text-slate-400">
                Requisitos automáticos exigidos por {currentBank?.name} según la actividad económica del solicitante.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-400 font-medium">Perfil Solicitante:</label>
              <select
                value={selectedProfile}
                onChange={(e) => setSelectedProfile(e.target.value as EconomicActivityProfile)}
                className="bg-slate-900 text-white text-xs font-semibold px-3 py-2 rounded-xl border border-slate-700 focus:outline-none focus:border-emerald-500"
              >
                {PROFILE_REQUIREMENT_MATRIX.map((m) => (
                  <option key={m.activityProfile} value={m.activityProfile}>
                    {m.profileLabel}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ALL_DOCUMENT_TYPES.map((docDef) => {
              const bankIdKey = currentBank?.id || "bbva";
              const isRequired = currentMatrixRule?.requiredDocuments[bankIdKey]?.includes(docDef.id);

              return (
                <div
                  key={docDef.id}
                  className={`p-4 rounded-2xl border transition ${
                    isRequired
                      ? "bg-slate-800/80 border-emerald-500/40 ring-1 ring-emerald-500/20"
                      : "bg-slate-900/40 border-slate-800/60 opacity-60"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      {isRequired ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      ) : (
                        <XCircle className="w-5 h-5 text-slate-600 shrink-0" />
                      )}
                      <div>
                        <h5 className={`font-bold text-sm ${isRequired ? "text-white" : "text-slate-400"}`}>
                          {docDef.label}
                        </h5>
                        <p className="text-xs text-slate-500 mt-0.5">{docDef.description}</p>
                      </div>
                    </div>
                    {isRequired && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase tracking-wider">
                        Requerido
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* CONTENIDO TAB 3: LECTURA DE DOCUMENTOS CON IA & AUTO-LLENADO */}
      {activeTab === "ia_lectura" && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 to-teal-950/40 border border-emerald-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Cpu className="w-5 h-5 text-emerald-400" />
                Pipeline de Extracción Automática con IA (Vision OCR)
              </h3>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                Prueba simular la carga de un documento escaneado (Cédula, RUT, Extracto, Certificación). La IA extraerá los datos en tiempo real y generará el script de auto-llenado para {currentBank?.name}.
              </p>
            </div>

            {aiProfile && (
              <button
                onClick={() => {
                  const rawScript = generateBankAutoFillBookmarklet({
                    clientName: aiProfile.clientName || "",
                    documentType: aiProfile.documentType || "CC",
                    documentNumber: aiProfile.documentNumber || "",
                    email: aiProfile.email || "cliente@ejemplo.com",
                    phone: aiProfile.phone || "3001234567",
                    companyName: aiProfile.companyName,
                    companyNit: aiProfile.companyNit,
                    amount: 25000000,
                    termMonths: 36,
                    city: aiProfile.city || "Medellín",
                  });
                  navigator.clipboard.writeText(rawScript);
                  alert("⚡ ¡Script de Auto-Llenado copiado al portapapeles! Puedes pegarlo en la consola del portal del banco.");
                }}
                className="px-4 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-extrabold text-xs hover:bg-emerald-400 transition shadow-lg flex items-center gap-2 shrink-0"
              >
                <Zap className="w-4 h-4 fill-current" />
                Copiar Script Auto-Llenado {currentBank?.name}
              </button>
            )}
          </div>

          {/* Botones de Prueba de Lectura de Documentos */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { id: "cedula", label: "Cédula", icon: UserCheck, file: "cedula_scan.pdf" },
              { id: "rut", label: "RUT", icon: FileText, file: "rut_dian.pdf" },
              { id: "certificacion_laboral", label: "Cert. Laboral", icon: Briefcase, file: "cert_laboral.pdf" },
              { id: "declaracion_renta", label: "Decl. Renta", icon: TrendingUp, file: "renta_2025.pdf" },
              { id: "extractos_bancarios", label: "Extracto Bancario", icon: Building2, file: "extracto_3meses.pdf" },
              { id: "tarjeta_propiedad_vehiculo", label: "Tarjeta Vehículo", icon: Layers, file: "tarjeta_propiedad.pdf" },
            ].map((item) => (
              <button
                key={item.id}
                disabled={parsingDoc}
                onClick={() => handleTestAIDocument(item.id, item.file)}
                className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 hover:border-emerald-500/50 hover:bg-slate-800 transition text-center group disabled:opacity-50"
              >
                <item.icon className="w-6 h-6 text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-white">{item.label}</span>
                <span className="text-[10px] text-slate-500 mt-0.5">Escanear IA</span>
              </button>
            ))}
          </div>

          {/* Resultado de la Extracción */}
          {parsingDoc ? (
            <div className="p-8 text-center rounded-2xl bg-slate-800/40 border border-slate-800">
              <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-xs text-slate-300 font-semibold">
                IA analizando estructura de {lastParsedDocType}... Extrayendo campos financieros y personales.
              </p>
            </div>
          ) : aiProfile ? (
            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <h4 className="font-bold text-white text-sm">
                    Perfil Financiero Consolidado por IA para {aiProfile.clientName || "Cliente"}
                  </h4>
                </div>
                <span className="text-xs text-slate-400 font-mono">
                  {aiProfile.parsedDocuments?.length || 0} documento(s) procesados
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-400 font-semibold block mb-1">Nombre Completo:</span>
                  <span className="text-white font-bold text-sm">{aiProfile.clientName || "No extraído"}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-400 font-semibold block mb-1">Cédula / Identificación:</span>
                  <span className="text-white font-bold text-sm">{aiProfile.documentNumber || "No extraído"}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-400 font-semibold block mb-1">Ingresos Mensuales Estimados:</span>
                  <span className="text-emerald-400 font-extrabold text-sm">
                    ${(aiProfile.monthlyIncome || 0).toLocaleString("es-CO")} COP
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-400 font-semibold block mb-1">Empresa / Razón Social:</span>
                  <span className="text-white font-bold">{aiProfile.companyName || "N/A"}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-400 font-semibold block mb-1">Patrimonio Bruto (Decl. Renta):</span>
                  <span className="text-white font-bold">
                    ${(aiProfile.totalAssets || 0).toLocaleString("es-CO")} COP
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-400 font-semibold block mb-1">Actividad Económica:</span>
                  <span className="text-emerald-300 font-bold uppercase">{aiProfile.economicActivity || "Asalariado"}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center rounded-2xl bg-slate-800/20 border border-slate-800/60 text-slate-500 text-xs">
              Haz clic en cualquier documento superior para simular el escaneo con IA y la generación del formulario para {currentBank?.name}.
            </div>
          )}
        </div>
      )}

      {/* Modal para Subir Formulario al Banco */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-base">
                Subir Formulario Editable a {currentBank?.name}
              </h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleAddTemplate} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Título de la Plantilla:</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Solicitud Única de Crédito Libre Inversión"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Descripción corta:</label>
                <input
                  type="text"
                  placeholder="Ej: Formulario oficial en PDF para auto-llenado"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Tipo de Formulario:</label>
                <select
                  value={newFormType}
                  onChange={(e) => setNewFormType(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="pdf_acroform">PDF Editable (AcroForm para pdf-lib)</option>
                  <option value="web_portal">Portal Web del Banco</option>
                  <option value="google_form">Google Form / Formulario Digital</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Archivo de la Plantilla (PDF):</label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setNewFile(e.target.files ? e.target.files[0] : null)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-300 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 text-slate-950 font-extrabold hover:bg-emerald-400 shadow-lg"
                >
                  Guardar Plantilla
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
