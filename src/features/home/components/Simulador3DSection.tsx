"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RotateCcw,
  Sparkles,
  Sun,
  Moon,
  Camera,
  Layers,
  Shield,
  Check,
  ArrowRight,
  Maximize2,
  Share2,
  Info,
  CheckCircle2,
  Flame,
  Zap,
  Sliders,
  Award,
  Grid,
} from "lucide-react";
import UniformCanvas3D, {
  GarmentType,
  LogoPosition,
  HOTSPOTS_DATA,
} from "@/src/components/3d/UniformCanvas3D";
import { COMPANY_INFO } from "@/src/data/uniforms-data";

export interface PresetDesign {
  id: string;
  name: string;
  industry: string;
  icon: string;
  standardBadge: string;
  description: string;
  garmentType: GarmentType;
  primaryColor: string;
  secondaryColor: string;
  reflectiveTape: boolean;
  logoPosition: LogoPosition;
  logoText: string;
  nightModeRecommended?: boolean;
}

export const PREDEFINED_PRESETS: PresetDesign[] = [
  {
    id: "mineria-vial",
    name: "Dotación Minera & Trabajo Pesado",
    industry: "Minería & Construcción",
    icon: "⛏️",
    standardBadge: "ANSI 107 / NTC 3252",
    description: "Chaqueta bicolor Azul Industrial y Naranja de alta visibilidad con dobles cintas 3M™ reflectivas.",
    garmentType: "chaqueta",
    primaryColor: "#1B3A6B",
    secondaryColor: "#EA580C",
    reflectiveTape: true,
    logoPosition: "pecho",
    logoText: "MINERÍA PRO",
    nightModeRecommended: true,
  },
  {
    id: "brigada-rescate",
    name: "Brigada de Emergencia & Rescate",
    industry: "Seguridad Industrial",
    icon: "🚨",
    standardBadge: "Norma NFPA Rescate",
    description: "Chaleco Rojo Rescate con arnés de cintas reflectivas en 'V', porta-carnet y ribetes reforzados.",
    garmentType: "chaleco",
    primaryColor: "#DC2626",
    secondaryColor: "#18181B",
    reflectiveTape: true,
    logoPosition: "pecho",
    logoText: "BRIGADA DE RESCATE",
    nightModeRecommended: true,
  },
  {
    id: "seguridad-vial",
    name: "Seguridad Vial & Operadores",
    industry: "Tránsito & Vías",
    icon: "🚧",
    standardBadge: "ANSI Clase 2",
    description: "Chaleco Amarillo Neón fluorescente con cintas 3M™ retro-reflectivas para máxima visibilidad de operadores.",
    garmentType: "chaleco",
    primaryColor: "#CA8A04",
    secondaryColor: "#1B3A6B",
    reflectiveTape: true,
    logoPosition: "espalda",
    logoText: "SEGURIDAD VIAL",
    nightModeRecommended: true,
  },
  {
    id: "petroleo-gas",
    name: "Operaciones Petroleras & Gas",
    industry: "Petróleo & Energía",
    icon: "⛽",
    standardBadge: "Antiestático / NFPA 2112",
    description: "Overol enterizo Azul Petróleo con contraste Naranja y triple cinta reflectiva en mangas y piernas.",
    garmentType: "overol",
    primaryColor: "#0F1D36",
    secondaryColor: "#EA580C",
    reflectiveTape: true,
    logoPosition: "pecho",
    logoText: "PETRÓLEO & GAS",
  },
  {
    id: "logistica-bodega",
    name: "Logística, Almacén & Montacargas",
    industry: "Logística & Transporte",
    icon: "📦",
    standardBadge: "Drill Vulcano 240g",
    description: "Chaqueta moderna Negro Carbón con hombrera Amarillo Neón de seguridad para personal de bodega.",
    garmentType: "chaqueta",
    primaryColor: "#18181B",
    secondaryColor: "#CA8A04",
    reflectiveTape: true,
    logoPosition: "manga",
    logoText: "LOGÍSTICA DISTRI",
  },
  {
    id: "supervision-ejecutiva",
    name: "Supervisión Técnica & Directiva",
    industry: "Línea Corporativa",
    icon: "👔",
    standardBadge: "Oxford Lafayette",
    description: "Camisa ejecutiva Azul Industrial con acabado antiarrugas y bordado computarizado de alta definición.",
    garmentType: "camisa",
    primaryColor: "#1B3A6B",
    secondaryColor: "#64748B",
    reflectiveTape: false,
    logoPosition: "pecho",
    logoText: "SUPERVISIÓN",
  },
  {
    id: "mantenimiento-soldadura",
    name: "Mantenimiento & Metalmecánica",
    industry: "Industria Manufactura",
    icon: "🧑‍🏭",
    standardBadge: "100% Algodón Pesado",
    description: "Overol Gris Cemento con acentos Azul Industrial resistente a fricción, chispas y trabajo mecánico.",
    garmentType: "overol",
    primaryColor: "#64748B",
    secondaryColor: "#1B3A6B",
    reflectiveTape: true,
    logoPosition: "pecho",
    logoText: "MANTENIMIENTO",
  },
  {
    id: "agro-forestal",
    name: "Agroindustrial & Ambiental",
    industry: "Agro & Forestal",
    icon: "🌲",
    standardBadge: "Protección Solar UV 50+",
    description: "Chaqueta Verde Forestal con tratamiento repelente a humedad y detalles de alta visibilidad.",
    garmentType: "chaqueta",
    primaryColor: "#15803D",
    secondaryColor: "#CA8A04",
    reflectiveTape: true,
    logoPosition: "pecho",
    logoText: "AGRO & AMBIENTAL",
  },
];

interface ColorOption {
  name: string;
  hex: string;
  badge?: string;
}

const COLOR_PALETTES: ColorOption[] = [
  { name: "Azul Industrial", hex: "#1B3A6B", badge: "Más Vendido" },
  { name: "Naranja Seguridad", hex: "#EA580C", badge: "Alta Visibilidad" },
  { name: "Amarillo Neón", hex: "#CA8A04", badge: "Vial" },
  { name: "Negro Carbón", hex: "#18181B" },
  { name: "Gris Cemento", hex: "#64748B" },
  { name: "Azul Petróleo", hex: "#0F1D36" },
  { name: "Verde Forestal", hex: "#15803D" },
  { name: "Rojo Rescate", hex: "#DC2626" },
];

const GARMENT_OPTIONS: {
  id: GarmentType;
  title: string;
  tagline: string;
  icon: string;
  desc: string;
}[] = [
  {
    id: "chaqueta",
    title: "Chaqueta Industrial",
    tagline: "Drill Vulcano Reforzado",
    icon: "🧥",
    desc: "Cintas reflectivas dobles, cuello camisero y bolsillos cargo.",
  },
  {
    id: "chaleco",
    title: "Chaleco Brigadista",
    tagline: "Norma ANSI / NTC",
    icon: "🦺",
    desc: "Arnés reflectivo en 'V' de alta intensidad y porta-carnet.",
  },
  {
    id: "overol",
    title: "Overol Enterizo",
    tagline: "Protección Completa",
    icon: "🧑‍🏭",
    desc: "Cuerpo entero con triple costura en mangas y piernas.",
  },
  {
    id: "camisa",
    title: "Camisa Tipo Oxford",
    tagline: "Línea Corporativa",
    icon: "👔",
    desc: "Corte ergonómico con cuello rígido y tapeta reforzada.",
  },
];

export default function Simulador3DSection() {
  const [activeTab, setActiveTab] = useState<"presets" | "custom">("presets");
  const [selectedPresetId, setSelectedPresetId] = useState<string>("mineria-vial");

  // Customization State
  const [garmentType, setGarmentType] = useState<GarmentType>("chaqueta");
  const [primaryColor, setPrimaryColor] = useState<string>("#1B3A6B");
  const [secondaryColor, setSecondaryColor] = useState<string>("#EA580C");
  const [nightMode, setNightMode] = useState<boolean>(false);
  const [reflectiveTape, setReflectiveTape] = useState<boolean>(true);
  const [logoPosition, setLogoPosition] = useState<LogoPosition>("pecho");
  const [logoText, setLogoText] = useState<string>("MINERÍA PRO");
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [activeHotspot, setActiveHotspot] = useState<string | null>("reflectivo");

  const captureFnRef = useRef<(() => string) | null>(null);

  // Apply a Predefined Preset
  const handleSelectPreset = (preset: PresetDesign) => {
    setSelectedPresetId(preset.id);
    setGarmentType(preset.garmentType);
    setPrimaryColor(preset.primaryColor);
    setSecondaryColor(preset.secondaryColor);
    setReflectiveTape(preset.reflectiveTape);
    setLogoPosition(preset.logoPosition);
    setLogoText(preset.logoText);
    if (preset.nightModeRecommended !== undefined) {
      setNightMode(preset.nightModeRecommended);
    }
  };

  // Handle Capture Snapshot
  const handleCapture = () => {
    if (captureFnRef.current) {
      const dataUrl = captureFnRef.current();
      if (dataUrl) {
        const a = document.createElement("a");
        a.href = dataUrl;
        a.download = `distripako-3d-${garmentType}-${Date.now()}.png`;
        a.click();
      }
    }
  };

  const selectedPresetObj = PREDEFINED_PRESETS.find((p) => p.id === selectedPresetId);
  const selectedGarmentObj = GARMENT_OPTIONS.find((g) => g.id === garmentType);
  const selectedColorObj = COLOR_PALETTES.find((c) => c.hex === primaryColor);

  const handleConsultWhatsApp = () => {
    const text = `Hola Distripako 👋, me interesó el diseño en el *Simulador 3D*:\n\n` +
      `• *Modelo:* ${selectedPresetObj ? selectedPresetObj.name : selectedGarmentObj?.title}\n` +
      `• *Sector:* ${selectedPresetObj?.industry || "Industrial"}\n` +
      `• *Color Principal:* ${selectedColorObj?.name || primaryColor}\n` +
      `• *Cintas 3M:* ${reflectiveTape ? "Sí (Incluidas)" : "No"}\n` +
      `• *Bordado:* ${logoPosition !== "ninguno" ? `Sí en ${logoPosition} (${logoText})` : "Sin logo"}\n\n` +
      `¿Me podrían cotizar precios para 30, 50 y 100 unidades?`;

    const url = `https://wa.me/57${COMPANY_INFO.phone}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  return (
    <section id="simulador-3d" className="relative py-20 lg:py-28 bg-slate-950 text-white overflow-hidden">
      {/* Glow Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#1B3A6B]/30 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-10">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-400 text-xs font-bold uppercase tracking-widest mb-4 shadow-lg shadow-blue-500/10"
          >
            <Sparkles size={14} className="animate-spin" style={{ animationDuration: "6s" }} />
            <span>Simulador 3D Interactivo en Tiempo Real</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4"
          >
            Catálogo & Diseños Predefinidos en{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300">
              3D en 360°
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-base sm:text-lg"
          >
            Selecciona un diseño industrial certificado o personaliza colores, cintas reflectivas 3M™ y ubicación de bordado en vivo.
          </motion.p>
        </div>

        {/* PRESET DESIGNS HORIZONTAL SELECTOR BAR */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <Award size={15} className="text-amber-400" />
              <span>1. Elige un Diseño Predefinido por Sector Industrial</span>
            </span>
            <span className="text-xs text-blue-400 font-bold hidden sm:inline">
              8 Modelos Listos para Fabricar
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
            {PREDEFINED_PRESETS.map((preset) => {
              const isSelected = selectedPresetId === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset)}
                  className={`relative p-3 rounded-2xl border text-left transition-all flex flex-col justify-between group ${
                    isSelected
                      ? "bg-gradient-to-b from-blue-600/30 to-blue-900/40 border-blue-400 text-white shadow-xl shadow-blue-500/20 ring-2 ring-blue-400 scale-[1.03]"
                      : "bg-slate-900/80 border-slate-800 text-slate-400 hover:border-slate-700 hover:bg-slate-900 hover:text-white"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xl">{preset.icon}</span>
                      <div
                        className="w-3.5 h-3.5 rounded-full border border-white/30"
                        style={{ backgroundColor: preset.primaryColor }}
                      />
                    </div>
                    <p className="text-xs font-extrabold line-clamp-1 text-white">
                      {preset.name.split("&")[0].trim()}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate mt-0.5">
                      {preset.industry}
                    </p>
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-[9px] font-bold text-amber-400 truncate">
                      {preset.standardBadge.split("/")[0]}
                    </span>
                    {isSelected && (
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main 3D Studio Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* 3D VIEWPORT STAGE (Left 7 Cols) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className={`lg:col-span-7 relative h-[530px] sm:h-[640px] rounded-3xl border overflow-hidden shadow-2xl transition-all duration-700 ${
              nightMode
                ? "bg-radial from-slate-900 via-slate-950 to-black border-blue-900/40 shadow-blue-950/50"
                : "bg-radial from-slate-900 via-slate-950 to-[#091222] border-slate-800 shadow-slate-950/80"
            }`}
          >
            {/* Top Toolbar Overlay */}
            <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
              {/* Selected Preset Badge */}
              <div className="pointer-events-auto flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-slate-900/90 border border-slate-700/80 backdrop-blur-md text-xs font-semibold text-slate-300 shadow-lg">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-white font-extrabold text-sm">
                  {selectedPresetObj ? selectedPresetObj.name : selectedGarmentObj?.title}
                </span>
                <span className="text-slate-500">•</span>
                <span className="text-amber-400 text-[11px] font-bold">
                  {selectedPresetObj?.standardBadge || "Norma NTC"}
                </span>
              </div>

              {/* Viewport Control Buttons */}
              <div className="pointer-events-auto flex items-center gap-2">
                {/* Night Mode / High Visibility Toggle */}
                <button
                  onClick={() => setNightMode(!nightMode)}
                  title={nightMode ? "Cambiar a Modo Día" : "Simular Visibilidad Nocturna (Cintas 3M)"}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    nightMode
                      ? "bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/30 scale-105 font-extrabold"
                      : "bg-slate-900/80 border border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:text-white backdrop-blur-md"
                  }`}
                >
                  {nightMode ? <Sun size={14} /> : <Moon size={14} />}
                  <span className="hidden sm:inline">
                    {nightMode ? "Modo Día" : "Modo Noche 3M"}
                  </span>
                </button>

                {/* Auto-Rotate Toggle */}
                <button
                  onClick={() => setAutoRotate(!autoRotate)}
                  title="Activar/Desactivar Rotación Automática"
                  className={`p-2 rounded-xl border backdrop-blur-md transition-all ${
                    autoRotate
                      ? "bg-blue-600/30 border-blue-500/50 text-blue-300"
                      : "bg-slate-900/80 border-slate-700/60 text-slate-400 hover:text-white"
                  }`}
                >
                  <RotateCcw size={16} className={autoRotate ? "animate-spin" : ""} style={{ animationDuration: "12s" }} />
                </button>

                {/* Screenshot Button */}
                <button
                  onClick={handleCapture}
                  title="Capturar y Descargar Imagen 3D"
                  className="p-2 rounded-xl bg-slate-900/80 border border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:text-white backdrop-blur-md transition-colors"
                >
                  <Camera size={16} />
                </button>
              </div>
            </div>

            {/* Three.js Interactive Canvas Component */}
            <UniformCanvas3D
              garmentType={garmentType}
              primaryColor={primaryColor}
              secondaryColor={secondaryColor}
              nightMode={nightMode}
              reflectiveTape={reflectiveTape}
              logoPosition={logoPosition}
              logoText={logoText}
              autoRotate={autoRotate}
              activeHotspot={activeHotspot}
              onHotspotClick={(id) => setActiveHotspot(id)}
              onRequestCapture={(fn) => {
                captureFnRef.current = fn;
              }}
            />

            {/* Bottom Floating Hotspot Info Card */}
            <div className="absolute bottom-4 left-4 right-4 z-20 pointer-events-none">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800/90 backdrop-blur-xl pointer-events-auto shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
                    <Shield size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-white uppercase tracking-wider">
                        {activeHotspot ? HOTSPOTS_DATA.find((h) => h.id === activeHotspot)?.title : "Especificación Técnica"}
                      </p>
                      {nightMode && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                          3M™ Fluorescente Activo
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-1 sm:line-clamp-none">
                      {activeHotspot
                        ? HOTSPOTS_DATA.find((h) => h.id === activeHotspot)?.description
                        : selectedPresetObj?.description || "Arrastra con el mouse para rotar en 360°."}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                  {HOTSPOTS_DATA.map((hotspot) => (
                    <button
                      key={hotspot.id}
                      onClick={() => setActiveHotspot(hotspot.id)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                        activeHotspot === hotspot.id
                          ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                          : "bg-slate-800/80 text-slate-400 hover:text-white"
                      }`}
                    >
                      {hotspot.title.split(" ")[0]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* CUSTOMIZATION & ADJUSTMENT STUDIO (Right 5 Cols) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-7 backdrop-blur-xl shadow-2xl flex flex-col justify-between"
          >
            {/* TABS: Preset Summary vs Custom Tuning */}
            <div className="space-y-6">
              {/* Tab Header */}
              <div className="flex items-center p-1 bg-slate-950 rounded-2xl border border-slate-800">
                <button
                  onClick={() => setActiveTab("presets")}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 ${
                    activeTab === "presets"
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Grid size={14} />
                  <span>Ficha del Modelo</span>
                </button>
                <button
                  onClick={() => setActiveTab("custom")}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 ${
                    activeTab === "custom"
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Sliders size={14} />
                  <span>Ajustar Personalización</span>
                </button>
              </div>

              {activeTab === "presets" ? (
                /* PRESET DETAILS CARD */
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-950/40 via-slate-900 to-slate-950 border border-blue-500/20">
                    <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-wider mb-1">
                      <span>{selectedPresetObj?.industry}</span>
                    </div>
                    <h3 className="text-lg font-extrabold text-white mb-2">
                      {selectedPresetObj?.name}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed mb-4">
                      {selectedPresetObj?.description}
                    </p>

                    <div className="grid grid-cols-2 gap-2.5 text-[11px]">
                      <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                        <span className="text-slate-500 block text-[10px] uppercase font-bold">Norma Técnica</span>
                        <span className="font-bold text-amber-400">{selectedPresetObj?.standardBadge}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                        <span className="text-slate-500 block text-[10px] uppercase font-bold">Tipo de Tejido</span>
                        <span className="font-bold text-slate-200">Drill Vulcano 240g/m²</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                        <span className="text-slate-500 block text-[10px] uppercase font-bold">Cintas de Seguridad</span>
                        <span className="font-bold text-emerald-400">
                          {reflectiveTape ? "3M™ 2 Pulgadas (500 CPL)" : "Sin Cintas"}
                        </span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                        <span className="text-slate-500 block text-[10px] uppercase font-bold">Bordado Incluido</span>
                        <span className="font-bold text-blue-300 capitalize">{logoPosition} ({logoText})</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-white">¿Deseas cambiar colores o bordado?</p>
                      <p className="text-[11px] text-slate-400">Haz clic en 'Ajustar Personalización' arriba para editarlo.</p>
                    </div>
                    <button
                      onClick={() => setActiveTab("custom")}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-blue-400 border border-slate-700 transition-colors shrink-0"
                    >
                      Editar
                    </button>
                  </div>
                </div>
              ) : (
                /* CUSTOM CONTROLS */
                <div className="space-y-5">
                  {/* Prenda */}
                  <div>
                    <label className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
                      <span>Tipo de Prenda</span>
                      <span className="text-[11px] text-blue-400 font-bold capitalize">{garmentType}</span>
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {GARMENT_OPTIONS.map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => setGarmentType(opt.id)}
                          className={`p-2.5 rounded-xl text-left border transition-all ${
                            garmentType === opt.id
                              ? "bg-blue-600/20 border-blue-500 text-white ring-1 ring-blue-500"
                              : "bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white"
                          }`}
                        >
                          <span className="text-xs font-bold text-white flex items-center gap-1.5">
                            <span>{opt.icon}</span> {opt.title}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Color Principal */}
                  <div>
                    <label className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
                      <span>Color Principal</span>
                      <span className="text-[11px] text-blue-400 font-bold">{selectedColorObj?.name || primaryColor}</span>
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {COLOR_PALETTES.map((color) => (
                        <button
                          key={color.hex}
                          onClick={() => setPrimaryColor(color.hex)}
                          className={`flex items-center gap-2 p-1.5 rounded-xl border text-[11px] font-semibold transition-all ${
                            primaryColor === color.hex
                              ? "border-blue-500 bg-blue-500/20 text-white"
                              : "border-slate-800 bg-slate-950/40 text-slate-400 hover:text-slate-200"
                          }`}
                        >
                          <div
                            className="w-4 h-4 rounded-full border border-white/20 shrink-0"
                            style={{ backgroundColor: color.hex }}
                          />
                          <span className="truncate">{color.name.split(" ")[0]}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Color Contraste / Hombreras */}
                  <div>
                    <label className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
                      <span>Color de Contraste (Hombrera / Ribete)</span>
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {COLOR_PALETTES.map((color) => (
                        <button
                          key={color.hex}
                          onClick={() => setSecondaryColor(color.hex)}
                          className={`flex items-center gap-2 p-1.5 rounded-xl border text-[11px] font-semibold transition-all ${
                            secondaryColor === color.hex
                              ? "border-amber-400 bg-amber-400/20 text-amber-300"
                              : "border-slate-800 bg-slate-950/40 text-slate-400 hover:text-slate-200"
                          }`}
                        >
                          <div
                            className="w-4 h-4 rounded-full border border-white/20 shrink-0"
                            style={{ backgroundColor: color.hex }}
                          />
                          <span className="truncate">{color.name.split(" ")[0]}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Cintas y Logo */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-white">Cintas 3M™</span>
                        <button
                          onClick={() => setReflectiveTape(!reflectiveTape)}
                          className={`w-9 h-5 rounded-full transition-colors relative p-0.5 cursor-pointer ${
                            reflectiveTape ? "bg-blue-600" : "bg-slate-800"
                          }`}
                        >
                          <div
                            className={`w-4 h-4 rounded-full bg-white transition-transform ${
                              reflectiveTape ? "translate-x-4" : "translate-x-0"
                            }`}
                          />
                        </button>
                      </div>
                      <span className="text-[10px] text-slate-400 block">Alta Visibilidad</span>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800">
                      <span className="text-xs font-bold text-white block mb-1.5">Posición Logo</span>
                      <div className="grid grid-cols-3 gap-1">
                        {(["pecho", "espalda", "ninguno"] as LogoPosition[]).map((pos) => (
                          <button
                            key={pos}
                            onClick={() => setLogoPosition(pos)}
                            className={`py-1 text-center rounded-lg text-[10px] font-bold capitalize transition-all ${
                              logoPosition === pos
                                ? "bg-blue-600 text-white"
                                : "bg-slate-800/80 text-slate-400 hover:text-white"
                            }`}
                          >
                            {pos}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {logoPosition !== "ninguno" && (
                    <input
                      type="text"
                      value={logoText}
                      maxLength={16}
                      placeholder="Nombre de tu empresa"
                      onChange={(e) => setLogoText(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-semibold"
                    />
                  )}
                </div>
              )}
            </div>

            {/* ACTION CTA BUTTONS */}
            <div className="mt-8 pt-6 border-t border-slate-800 space-y-3">
              <a
                href="#cotizador"
                className="w-full inline-flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white font-extrabold text-sm shadow-xl shadow-blue-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Cotizar este Diseño en el Cotizador</span>
                <ArrowRight size={16} />
              </a>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={handleConsultWhatsApp}
                  className="inline-flex items-center justify-center gap-2 py-3 px-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-400 text-xs font-bold transition-colors"
                >
                  <span>Pedir por WhatsApp</span>
                </button>

                <button
                  onClick={handleCapture}
                  className="inline-flex items-center justify-center gap-2 py-3 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-colors"
                >
                  <Camera size={14} />
                  <span>Guardar Foto 3D</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
