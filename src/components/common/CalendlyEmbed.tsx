"use client";

import React, { useState, useEffect } from "react";
import {
  Video,
  Clock,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  Calendar,
  MessageCircle,
  ShieldCheck,
  Users,
  Lock,
  ChevronRight,
  Headphones,
  Award,
} from "lucide-react";
import { subscribeCalendlyConfig } from "@/src/services/firebase/calendlyService";
import { ECOSYSTEM_INFO } from "@/src/config/verticals";
import { useAuth } from "@/src/context/AuthContext";

interface CalendlyEmbedProps {
  initialEventKey?: "credito" | "inversiones" | "seguros" | "fit" | "general" | string;
}

export default function CalendlyEmbed({ initialEventKey }: CalendlyEmbedProps = {}) {
  const { user } = useAuth();
  const [calendlyUrl, setCalendlyUrl] = useState<string>("");
  const [loading, setLoading] = useState(true);

  // Subscribe in real-time to the URL set in next-admin
  useEffect(() => {
    const unsub = subscribeCalendlyConfig((url) => {
      setCalendlyUrl(url || process.env.NEXT_PUBLIC_CALENDLY_URL || "");
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // Format URL: Strip clutter, hide landing page details, hide cookies banner, set modern colors
  const getEmbedUrl = () => {
    if (!calendlyUrl) return "";
    try {
      const url = new URL(calendlyUrl);
      // HIDE the bulky profile header/photo to make the calendar look clean and minimalist
      url.searchParams.set("hide_landing_page_details", "1");
      url.searchParams.set("hide_gdpr_banner", "1");
      url.searchParams.set("primary_color", "0284c7");
      url.searchParams.set("text_color", "0f172a");
      url.searchParams.set("background_color", "ffffff");

      if (user?.displayName) {
        url.searchParams.set("name", user.displayName);
      }
      if (user?.email) {
        url.searchParams.set("email", user.email);
      }

      return url.toString();
    } catch {
      return calendlyUrl;
    }
  };

  const embedUrl = getEmbedUrl();

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Outer Sleek Device Mockup Frame */}
      <div className="rounded-[32px] bg-slate-900/5 p-2 sm:p-3 border border-slate-200/90 shadow-2xl shadow-sky-500/10 backdrop-blur-xl">
        <div className="rounded-[26px] bg-white border border-slate-200/80 overflow-hidden shadow-inner flex flex-col">
          {/* Top Window Bar (Mac OS inspired high-tech window header) */}
          <div className="px-5 py-3.5 bg-slate-50/90 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 select-none">
            {/* Window Dots */}
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-400 border border-rose-500/30" />
              <span className="w-3 h-3 rounded-full bg-amber-400 border border-amber-500/30" />
              <span className="w-3 h-3 rounded-full bg-emerald-400 border border-emerald-500/30" />
              <span className="ml-3 hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-2xs">
                <Lock className="w-3 h-3 text-emerald-600" />
                <span>nextgroup.com/agenda-segura</span>
              </span>
            </div>

            {/* Live Specialists Status */}
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-slate-900 font-extrabold">Especialistas en Línea</span>
              <span className="hidden md:inline text-slate-400">•</span>
              <span className="hidden md:inline text-sky-700 font-medium">Asesoría Gratuita 1 a 1</span>
            </div>
          </div>

          {/* Value Props & Steps Bar */}
          <div className="p-4 sm:p-6 bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-200 text-[11px] font-extrabold uppercase tracking-wider">
                <Video className="w-3.5 h-3.5 text-sky-300" />
                <span>Google Meet Directo</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Elige tu Horario de Atención
              </h3>
              <p className="text-xs sm:text-sm text-slate-300">
                Selecciona una fecha y hora disponible. Recibirás tu confirmación de inmediato.
              </p>
            </div>

            {/* Quick 3-Step Indicator */}
            <div className="flex items-center gap-2 text-xs font-bold bg-white/10 px-4 py-2.5 rounded-2xl border border-white/10 backdrop-blur-md self-start md:self-auto">
              <div className="flex items-center gap-1.5 text-sky-300">
                <span className="w-5 h-5 rounded-full bg-sky-500 text-white text-[10px] font-black flex items-center justify-center">1</span>
                <span>Horario</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
              <div className="flex items-center gap-1.5 text-slate-300">
                <span className="w-5 h-5 rounded-full bg-white/20 text-white text-[10px] font-black flex items-center justify-center">2</span>
                <span>Datos</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
              <div className="flex items-center gap-1.5 text-slate-400">
                <span className="w-5 h-5 rounded-full bg-white/10 text-slate-400 text-[10px] font-black flex items-center justify-center">3</span>
                <span>Meet</span>
              </div>
            </div>
          </div>

          {/* Interactive Calendly Container */}
          <div className="relative min-h-[700px] w-full bg-white flex flex-col justify-center">
            {loading ? (
              <div className="h-[600px] flex flex-col items-center justify-center space-y-4 text-slate-400">
                <div className="relative">
                  <div className="w-12 h-12 border-3 border-sky-500/30 border-t-sky-600 rounded-full animate-spin" />
                  <Calendar className="w-5 h-5 text-sky-600 absolute inset-0 m-auto" />
                </div>
                <div className="text-center">
                  <div className="text-sm font-bold text-slate-800">Cargando disponibilidad de citas</div>
                  <div className="text-xs text-slate-500 mt-0.5">Conectando con Google Calendar en tiempo real...</div>
                </div>
              </div>
            ) : embedUrl ? (
              <div className="w-full flex-1 flex flex-col">
                {/* Clean Iframe without clutter */}
                <iframe
                  src={embedUrl}
                  width="100%"
                  height="720"
                  title="Calendly Booking Widget"
                  className="w-full flex-1 border-0 bg-white"
                  style={{ minHeight: "720px" }}
                />

                {/* Bottom Trust & Security Bar */}
                <div className="p-3.5 bg-slate-50/80 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 px-6">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5 text-emerald-700 font-bold">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Cita 100% Gratuita & Confidencial</span>
                    </span>
                    <span className="hidden sm:flex items-center gap-1.5 text-slate-500">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <span>Duración: 30 minutos</span>
                    </span>
                  </div>

                  <a
                    href={calendlyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-sky-600 hover:text-sky-800 underline inline-flex items-center gap-1 transition-colors"
                  >
                    <span>Abrir en pantalla completa</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ) : (
              /* High-End Empty State if admin has not set link yet */
              <div className="p-10 sm:p-16 max-w-lg mx-auto text-center space-y-5">
                <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-sky-100 to-cyan-50 border border-sky-200 text-sky-600 mx-auto flex items-center justify-center shadow-lg shadow-sky-500/10">
                  <Calendar className="w-8 h-8" />
                </div>

                <div className="space-y-1.5">
                  <h4 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    Agendamiento de Asesoría en Línea
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    Nuestros especialistas atienden consultas personalizadas sobre crédito, inversiones, seguros y bienestar integral.
                  </p>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <a
                    href={`https://wa.me/${ECOSYSTEM_INFO.contact.whatsapp.replace(/[^0-9]/g, "")}?text=Hola,%20deseo%20agendar%20una%20asesor%C3%ADa%20personalizada`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-emerald-600/25 transition-all hover:scale-105 active:scale-95"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Agendar por WhatsApp</span>
                  </a>

                  <a
                    href="#contacto"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all hover:scale-105 active:scale-95"
                  >
                    <span>Dejar Mensaje Escrito</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
