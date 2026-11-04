"use client";

import React, { useState } from "react";
import {
  Send,
  MessageSquare,
  Phone,
  Mail,
  User,
  Building2,
  MapPin,
  MessageCircle,
  ExternalLink,
} from "lucide-react";
import { submitGeneralLead } from "@/src/services/firebase/leadsService";
import { VerticalKey } from "@/src/types/common";
import { BRANCH_OFFICES } from "@/src/types/appointment";
import { ECOSYSTEM_INFO } from "@/src/config/verticals";
import SuccessModal from "@/src/components/common/SuccessModal";

export default function HubContact() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [referenceCode, setReferenceCode] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    city: "",
    verticalInterest: "ecosistema" as VerticalKey | "ecosistema",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const code = "GN-" + Math.floor(100000 + Math.random() * 900000);
      await submitGeneralLead({
        ...formData,
        source: "hub_contact_form",
        status: "pendiente",
      });

      setReferenceCode(code);
      setSuccess(true);
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        city: "",
        verticalInterest: "ecosistema",
        message: "",
      });
    } catch (error) {
      console.error("Error sending lead:", error);
      alert("Ocurrió un error al enviar tu solicitud. Inténtalo nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="contacto"
      className="py-10 sm:py-16 bg-slate-50/70 relative overflow-hidden border-t border-slate-200/80"
    >
      <div className="max-w-6xl mx-auto px-3.5 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-8 sm:mb-10 space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Atención & Sedes
          </span>
          <h2 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Oficinas Presenciales y Contacto
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Visítanos en nuestras sedes o déjanos tu consulta escrita.
          </p>
        </div>

        {/* 2-Column Grid: Physical Offices + Written Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
          {/* Card 1: Physical Offices & WhatsApp */}
          <div className="lg:col-span-5 rounded-3xl bg-slate-900 text-white p-5 sm:p-7 flex flex-col justify-between shadow-sm relative overflow-hidden border border-slate-800">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-slate-200">
                <Building2 className="w-3.5 h-3.5 text-sky-400" />
                <span>Sedes Corporativas</span>
              </div>

              <div className="space-y-3">
                {BRANCH_OFFICES.map((branch) => (
                  <div
                    key={branch.id}
                    className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{branch.city}</span>
                      <span className="text-[10px] text-slate-400">{branch.name}</span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-snug flex items-start gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                      <span>{branch.address}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-white/10">
              <a
                href={`https://wa.me/${ECOSYSTEM_INFO.contact.whatsapp.replace(/[^0-9]/g, "")}?text=Hola,%20quisiera%20asesoría%20sobre%20los%20servicios%20de%20Next%20Connection%20Group`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Hablar por WhatsApp Directo</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </a>
            </div>
          </div>

          {/* Card 2: Written Message Form */}
          <div className="lg:col-span-7 bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-7 shadow-xs">
            <div className="mb-4">
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Déjanos tu consulta por escrito
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Te responderemos por correo o celular en menos de 2 horas hábiles.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Tu Nombre *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      placeholder="Nombre y apellido"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Correo Electrónico *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      required
                      placeholder="correo@ejemplo.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900 transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Teléfono / WhatsApp *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="tel"
                      required
                      placeholder="300 123 4567"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Área de Interés
                  </label>
                  <select
                    value={formData.verticalInterest}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        verticalInterest: e.target.value as any,
                      })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900 transition-colors"
                  >
                    <option value="ecosistema">Asesoría General</option>
                    <option value="credito">Crédito & Financiación</option>
                    <option value="inversiones">Inversiones & Capital</option>
                    <option value="seguros">Seguros & Pólizas</option>
                    <option value="fit">Nutrición & Fit</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Mensaje o Consulta
                </label>
                <textarea
                  rows={2}
                  placeholder="Cuéntanos brevemente qué necesitas..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900 transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-xl font-bold text-xs text-white bg-slate-900 hover:bg-slate-800 shadow-2xs flex items-center justify-center gap-2 transition-all disabled:opacity-50 active:scale-98"
              >
                {loading ? (
                  <span>Enviando mensaje...</span>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Enviar Mensaje</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      <SuccessModal
        isOpen={success}
        onClose={() => setSuccess(false)}
        title="¡Mensaje Enviado con Éxito!"
        message="Hemos recibido tus datos correctamente. Un asesor se comunicará contigo muy pronto."
        referenceCode={referenceCode}
      />
    </section>
  );
}
