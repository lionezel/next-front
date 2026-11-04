"use client";

import React, { useState } from "react";
import { Sparkles, FileText, UploadCloud, CheckCircle2, RefreshCw, Edit3, Image as ImageIcon, Zap } from "lucide-react";
import { parseDocumentWithAI } from "@/src/services/aiDocumentParser";
import { ExtractedFinancialProfile, DocumentTypeId } from "@/src/types/bankForm";

interface AIDocumentScannerProps {
  onExtractedData?: (data: Partial<ExtractedFinancialProfile>) => void;
  documentTypeHint?: DocumentTypeId;
  compact?: boolean;
}

export default function AIDocumentScanner({
  onExtractedData,
  documentTypeHint = "cedula",
  compact = false,
}: AIDocumentScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedFile, setScannedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [extractedProfile, setExtractedProfile] = useState<ExtractedFinancialProfile | null>(null);
  const [detectedType, setDetectedType] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processFile(file);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    await processFile(file);
  };

  const processFile = async (file: File) => {
    setScannedFile(file);
    setIsScanning(true);

    if (file.type.startsWith("image/")) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }

    const fileName = file.name.toLowerCase();
    let docType: DocumentTypeId = documentTypeHint;

    if (fileName.includes("cedula") || fileName.includes("cc") || fileName.includes("documento") || fileName.includes("id")) {
      docType = "cedula";
      setDetectedType("Cédula de Ciudadanía");
    } else if (fileName.includes("rut") || fileName.includes("dian")) {
      docType = "rut";
      setDetectedType("RUT Tributario");
    } else if (fileName.includes("nomina") || fileName.includes("desprendible") || fileName.includes("pago") || fileName.includes("sueldo")) {
      docType = "desprendibles_nomina";
      setDetectedType("Desprendible de Nómina");
    } else if (fileName.includes("laboral") || fileName.includes("certificad")) {
      docType = "certificacion_laboral";
      setDetectedType("Certificación Laboral");
    } else if (fileName.includes("extracto") || fileName.includes("banco")) {
      docType = "extractos_bancarios";
      setDetectedType("Extracto Bancario");
    } else if (fileName.includes("renta")) {
      docType = "declaracion_renta";
      setDetectedType("Declaración de Renta");
    } else {
      setDetectedType("Foto de Documento");
    }

    try {
      const fileUrl = URL.createObjectURL(file);
      const parsed = await parseDocumentWithAI(docType, fileUrl, file.name, undefined, file);

      setExtractedProfile(parsed);

      if (onExtractedData) {
        onExtractedData(parsed);
      }
    } catch (error) {
      console.error("Error al procesar el documento con IA:", error);
    } finally {
      setIsScanning(false);
    }
  };

  const handleFieldChange = (field: keyof ExtractedFinancialProfile, value: any) => {
    if (!extractedProfile) return;
    const updated = { ...extractedProfile, [field]: value };
    
    // Si cambian los nombres individuales, actualizar clientName
    if (field === "firstName" || field === "secondName" || field === "firstLastName" || field === "secondLastName") {
      updated.clientName = [updated.firstName, updated.secondName, updated.firstLastName, updated.secondLastName].filter(Boolean).join(" ");
    }

    setExtractedProfile(updated);
    if (onExtractedData) {
      onExtractedData(updated);
    }
  };

  return (
    <div className={`p-4 sm:p-5 rounded-2xl border transition-all ${compact ? "bg-emerald-50/60 border-emerald-200" : "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white border-slate-700 shadow-xl"}`}>
      {/* Encabezado del Escáner */}
      <div className="flex items-center justify-between pb-3 border-b border-emerald-500/20 mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h4 className={`font-black text-sm tracking-tight ${compact ? "text-slate-900" : "text-white"}`}>
              Lector IA de Documentos Reales (OCR)
            </h4>
            <p className={`text-xs ${compact ? "text-slate-600" : "text-slate-400"}`}>
              Selecciona o arrastra tu foto de Cédula o PDF para montar los datos automáticamente.
            </p>
          </div>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-700 font-extrabold text-[10px] uppercase border border-emerald-500/30">
          OCR Instantáneo
        </span>
      </div>

      {/* Zona de Carga / Drop Zone */}
      {!scannedFile ? (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-2xl p-5 text-center transition-all cursor-pointer group ${
            compact
              ? "border-emerald-400 bg-white hover:bg-emerald-50/80 shadow-xs"
              : "border-slate-700 bg-slate-950/50 hover:border-emerald-500/50 hover:bg-slate-900/80"
          }`}
        >
          <input
            type="file"
            accept="image/*,.pdf"
            onChange={handleFileChange}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
          />

          <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
            <UploadCloud className="w-6 h-6" />
          </div>

          <p className={`text-xs font-bold ${compact ? "text-slate-800" : "text-slate-200"}`}>
            Haz clic o suelta aquí tu foto de Cédula o Nómina (JPG, PNG, PDF)
          </p>
          <p className={`text-[11px] mt-0.5 ${compact ? "text-slate-500" : "text-slate-400"}`}>
            La IA leerá la cédula y llenará Nombres, Apellidos y Documento automáticamente.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Header del Archivo Cargado con Vista Previa */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 text-white border border-slate-700 text-xs">
            <div className="flex items-center gap-3 truncate">
              {previewUrl ? (
                <img src={previewUrl} alt="Cédula" className="w-9 h-9 rounded-lg object-cover border border-emerald-500/40 shrink-0" />
              ) : (
                <FileText className="w-5 h-5 text-emerald-400 shrink-0" />
              )}
              <div className="truncate">
                <span className="font-bold text-white block truncate">{scannedFile.name}</span>
                <span className="text-[10px] text-emerald-400 font-semibold">{detectedType || "Documento Analizado"}</span>
              </div>
            </div>

            <label className="text-xs text-emerald-400 hover:underline cursor-pointer font-bold shrink-0 ml-2 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/30">
              <span>Cambiar Foto</span>
              <input type="file" accept="image/*,.pdf" onChange={handleFileChange} className="hidden" />
            </label>
          </div>

          {isScanning ? (
            <div className="p-5 text-center space-y-2 bg-slate-900/40 rounded-xl border border-slate-800">
              <RefreshCw className="w-6 h-6 text-emerald-400 animate-spin mx-auto" />
              <p className="text-xs font-bold text-emerald-300">
                IA escaneando imagen y leyendo datos de la Cédula...
              </p>
            </div>
          ) : extractedProfile ? (
            <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 space-y-3 text-white">
              <div className="flex items-center justify-between pb-2 border-b border-emerald-500/20">
                <div className="flex items-center gap-1.5 text-emerald-400 font-extrabold text-xs">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>¡Datos de Cédula Extraídos y Asignados al Formulario!</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-[11px] font-bold text-emerald-300 hover:text-white underline flex items-center gap-1"
                >
                  <Edit3 className="w-3 h-3" />
                  {isEditing ? "Ver Vista Resumida" : "Ajustar / Editar Leído"}
                </button>
              </div>

              {!isEditing ? (
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                    <span className="text-slate-400 text-[10px] block font-semibold">Cédula Detectada:</span>
                    <span className="text-emerald-400 font-extrabold font-mono text-sm">
                      {extractedProfile.documentNumber || ""}
                    </span>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                    <span className="text-slate-400 text-[10px] block font-semibold">Nombre Completo:</span>
                    <span className="text-white font-bold text-xs truncate block">{extractedProfile.clientName}</span>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  <div>
                    <label className="text-[10px] font-bold text-slate-300 block mb-0.5">Primer Nombre:</label>
                    <input
                      type="text"
                      value={extractedProfile.firstName || ""}
                      onChange={(e) => handleFieldChange("firstName", e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-white text-xs font-semibold focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-300 block mb-0.5">Segundo Nombre:</label>
                    <input
                      type="text"
                      value={extractedProfile.secondName || ""}
                      onChange={(e) => handleFieldChange("secondName", e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-white text-xs font-semibold focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-300 block mb-0.5">Primer Apellido:</label>
                    <input
                      type="text"
                      value={extractedProfile.firstLastName || ""}
                      onChange={(e) => handleFieldChange("firstLastName", e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-white text-xs font-semibold focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-300 block mb-0.5">Segundo Apellido:</label>
                    <input
                      type="text"
                      value={extractedProfile.secondLastName || ""}
                      onChange={(e) => handleFieldChange("secondLastName", e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-white text-xs font-semibold focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-300 block mb-0.5">Número de Cédula:</label>
                    <input
                      type="text"
                      value={extractedProfile.documentNumber || ""}
                      onChange={(e) => handleFieldChange("documentNumber", e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-emerald-400 font-mono text-xs font-bold focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-300 block mb-0.5">Fecha de Expedición:</label>
                    <input
                      type="text"
                      value={extractedProfile.expeditionDate || ""}
                      placeholder=""
                      onChange={(e) => handleFieldChange("expeditionDate", e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-white text-xs font-semibold focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-300 block mb-0.5">Lugar de Expedición:</label>
                    <input
                      type="text"
                      value={extractedProfile.expeditionPlace || ""}
                      placeholder="Medellín (Ant)"
                      onChange={(e) => handleFieldChange("expeditionPlace", e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-white text-xs font-semibold focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-300 block mb-0.5">Fecha de Nacimiento:</label>
                    <input
                      type="text"
                      value={extractedProfile.birthDate || ""}
                      placeholder=""
                      onChange={(e) => handleFieldChange("birthDate", e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-white text-xs font-semibold focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-300 block mb-0.5">Género / RH:</label>
                    <div className="grid grid-cols-2 gap-1">
                      <input
                        type="text"
                        value={extractedProfile.gender || "MASCULINO"}
                        placeholder="MASCULINO"
                        onChange={(e) => handleFieldChange("gender", e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-1.5 py-1 text-white text-[10px] font-semibold focus:border-emerald-500"
                      />
                      <input
                        type="text"
                        value={extractedProfile.rh || "O+"}
                        placeholder="O+"
                        onChange={(e) => handleFieldChange("rh", e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-1.5 py-1 text-emerald-400 text-[10px] font-bold focus:border-emerald-500"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
