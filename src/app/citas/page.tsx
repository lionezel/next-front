import React from "react";
import InteractiveAppointmentCenter from "@/src/features/hub/InteractiveAppointmentCenter";
import HeroBackgroundAnimation from "@/src/components/common/HeroBackgroundAnimation";
import { Calendar, CheckCircle2, ShieldCheck, MapPin } from "lucide-react";

export const metadata = {
  title: "Agendar Cita | Next Connection Group",
  description: "Agenda tu cita virtual por Google Meet o presencial en nuestras sedes en Bogotá, Medellín y Cali. Asesoría 100% personalizada en crédito, inversiones, seguros y bienestar.",
};

export default function CitasPage() {
  return (
    <main className="min-h-screen pb-20 md:pb-12 bg-slate-50/50">
      {/* Header Banner: Clean & Institutional */}
      <section className="relative overflow-hidden pt-6 pb-6 sm:pt-10 sm:pb-12 bg-white border-b border-slate-200/80">
        <div className="opacity-25">
          <HeroBackgroundAnimation theme="hub" />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-2 sm:space-y-3 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-[11px] sm:text-xs font-semibold text-slate-700 shadow-2xs">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>Módulo de Agendamiento Oficial</span>
            <span className="w-1 h-1 rounded-full bg-slate-300" />
            <span className="text-emerald-700 font-bold">Tiempo Real</span>
          </div>

          <h1 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Agenda tu Asesoría Personalizada
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
            Aparta tu horario con confirmación inmediata por <strong>Google Meet</strong> o atención en sedes físicas de Bogotá, Medellín y Cali.
          </p>

          <div className="hidden sm:flex flex-wrap items-center justify-center gap-6 pt-1 text-xs text-slate-600 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Google Meet automático</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Sincronización Calendar</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>100% Gratuito y sin compromiso</span>
            </span>
          </div>
        </div>
      </section>

      {/* Dedicated Interactive Appointment Center */}
      <div className="max-w-4xl mx-auto px-3.5 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        <InteractiveAppointmentCenter />
      </div>
    </main>
  );
}
