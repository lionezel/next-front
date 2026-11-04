"use client";

import React, { useState, useEffect } from "react";
import HubHero from "./HubHero";
import ClientsCarousel from "./ClientsCarousel";
import InteractiveAppointmentCenter from "./InteractiveAppointmentCenter";
import HubContact from "./HubContact";
import VerticalInfoModal from "@/src/components/common/VerticalInfoModal";
import { VerticalKey } from "@/src/types/common";

export default function HomeFeature() {
  const [selectedVertical, setSelectedVertical] = useState<VerticalKey | null>(null);

  useEffect(() => {
    const handleOpenModal = (e: any) => {
      if (e.detail?.vertical) {
        setSelectedVertical(e.detail.vertical);
      }
    };

    window.addEventListener("open-vertical-modal", handleOpenModal);

    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const v = params.get("vertical") as VerticalKey;
      if (v) setSelectedVertical(v);
    }

    return () => {
      window.removeEventListener("open-vertical-modal", handleOpenModal);
    };
  }, []);

  const handleCloseModal = () => {
    setSelectedVertical(null);
    if (typeof window !== "undefined" && window.location.search) {
      window.history.replaceState({}, "", window.location.pathname);
    }
  };

  const handleBookFromModal = (verticalKey: VerticalKey) => {
    handleCloseModal();
    window.dispatchEvent(
      new CustomEvent("set-appointment-specialty", {
        detail: { specialty: verticalKey },
      })
    );
  };

  return (
    <main className="min-h-screen pb-16 md:pb-0 bg-[#F8FAFC]">
      {/* 1. Concise Hero with the 4 Service Cards & Direct Agendar Triggers */}
      <HubHero />

      {/* 2. Minimalist Partner Logo Strip */}
      <ClientsCarousel />

      {/* 3. The Core Feature: Real-Time Appointment Booking Center */}
      <section className="py-8 sm:py-14 px-3.5 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8 space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Reserva tu espacio 1 a 1
          </span>
          <h2 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Agenda tu Cita en Tiempo Real
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Confirma tu horario en vivo por <strong>Google Meet</strong> o en nuestras oficinas presenciales.
          </p>
        </div>

        <InteractiveAppointmentCenter />
      </section>

      {/* 4. Physical Offices & Quick Contact */}
      <HubContact />

      {/* Elegant & Spacious Information Modal */}
      <VerticalInfoModal
        verticalKey={selectedVertical}
        onClose={handleCloseModal}
        onBookAppointment={handleBookFromModal}
      />
    </main>
  );
}
