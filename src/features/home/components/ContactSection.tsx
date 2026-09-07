"use client";

import { useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  Building,
  User,
  MessageSquare,
  Loader2,
} from "lucide-react";
import { COMPANY_INFO } from "@/src/data/uniforms-data";
import { createOrderQuote } from "@/src/services/firebase/quotes.service";

export default function ContactSection() {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    let orderCode = "";

    try {
      const res = await createOrderQuote({
        clientName: name || "Cliente Web",
        companyName: company || "Empresa no especificada",
        phone: phone || "No suministrado",
        email: email || "",
        city: "Colombia",
        notes: message || "Mensaje desde formulario de contacto web",
        productId: "consulta-general",
        productName: "Consulta General / Asesoría",
        selectedColor: "N/A",
        customizationId: "por-definir",
        customizationName: "Por definir",
        quantities: {},
        totalUnits: 0,
        unitPrice: 0,
        customizationPrice: 0,
        discountPct: 0,
        discountAmount: 0,
        totalPrice: 0,
        source: "contacto_web",
      });
      orderCode = res.code;
    } catch (err) {
      console.error("Error guardando contacto en Firestore:", err);
    } finally {
      setIsSubmitting(false);
      setSubmitted(true);
      const codeLine = orderCode ? `\nCódigo de Solicitud: ${orderCode}` : "";
      const text = `*CONTACTO WEB DISTRIPAKO*${codeLine}\nEmpresa: ${company || "No indicada"}\nNombre: ${name}\nTeléfono: ${phone}\nCorreo: ${email}\nMensaje: ${message}`;
      const url = `https://wa.me/${COMPANY_INFO.whatsappNumber}?text=${encodeURIComponent(text)}`;
      window.open(url, "_blank");
    }
  };


  return (
    <section id="contacto" className="py-24 bg-white scroll-mt-20 border-b border-slate-100">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold uppercase tracking-wider">
            <Mail size={13} className="text-[#1B3A6B]" />
            <span>Atención Inmediata</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Contáctanos y Solicita tu Asesoría
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Estaremos encantados de resolver tus dudas y enviarte cotizaciones personalizadas sin compromiso.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Info Cards (Clean White / Light) */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-slate-50 text-slate-900 p-7 sm:p-8 rounded-3xl space-y-6 border border-slate-200 shadow-sm">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#1B3A6B]">
                  Canales Oficiales
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">
                  Distripako Dotaciones
                </h3>
              </div>

              <div className="space-y-4 text-sm">
                <a
                  href={`https://wa.me/${COMPANY_INFO.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3.5 p-3 rounded-2xl bg-white hover:bg-slate-100 border border-slate-200 transition-colors shadow-xs"
                >
                  <div className="p-2.5 rounded-xl bg-amber-50 text-[#1B3A6B] border border-amber-200">
                    <Phone size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Línea & WhatsApp</p>
                    <p className="font-bold text-slate-900">{COMPANY_INFO.phone}</p>
                  </div>
                </a>

                <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-white border border-slate-200 shadow-xs">
                  <div className="p-2.5 rounded-xl bg-amber-50 text-[#1B3A6B] border border-amber-200">
                    <Mail size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Correo Electrónico</p>
                    <p className="font-bold text-slate-900">{COMPANY_INFO.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-white border border-slate-200 shadow-xs">
                  <div className="p-2.5 rounded-xl bg-amber-50 text-[#1B3A6B] border border-amber-200">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Cobertura</p>
                    <p className="font-bold text-slate-900">{COMPANY_INFO.coverage}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-white border border-slate-200 shadow-xs">
                  <div className="p-2.5 rounded-xl bg-amber-50 text-[#1B3A6B] border border-amber-200">
                    <Clock size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Horario de Atención</p>
                    <p className="font-semibold text-xs text-slate-800">{COMPANY_INFO.schedule}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Form */}
          <div className="lg:col-span-7">
            <div className="bg-slate-50/60 p-7 sm:p-9 rounded-3xl border border-slate-200 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-6">
                Envíanos un Mensaje Directo
              </h3>

              {submitted ? (
                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                  <CheckCircle2 size={36} className="text-emerald-600 mx-auto" />
                  <h4 className="text-base font-bold text-emerald-900">
                    ¡Mensaje Preparado con Éxito!
                  </h4>
                  <p className="text-xs text-emerald-700">
                    Se abrió tu WhatsApp para completar el envío. Uno de nuestros asesores comerciales te responderá en breve.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-3 text-xs font-bold text-emerald-800 underline"
                  >
                    Enviar otro mensaje
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Tu Nombre Completo *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ej. Juan Pérez"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#1B3A6B] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Empresa / Organización
                      </label>
                      <input
                        type="text"
                        placeholder="Ej. Distribuciones Alfa S.A.S"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#1B3A6B] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Teléfono / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="Ej. 300 123 4567"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#1B3A6B] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Correo Electrónico
                      </label>
                      <input
                        type="email"
                        placeholder="contacto@empresa.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#1B3A6B] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      ¿Qué prendas o dotaciones necesitas? *
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Indícanos tipo de prendas, cantidad aproximada o si requieres bordado de logo..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#1B3A6B] focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-[#1B3A6B] hover:bg-[#2557A7] text-white font-bold text-sm shadow-md transition-colors"
                  >
                    <Send size={16} />
                    <span>Enviar Consulta por WhatsApp</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
