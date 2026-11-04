"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  Heart,
  Car,
  Home,
  Users,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { submitInsuranceQuote } from "@/src/services/firebase/insuranceService";
import { InsuranceCategory } from "@/src/types/insurance";
import SuccessModal from "@/src/components/common/SuccessModal";

export default function InsuranceQuoter() {
  const [category, setCategory] = useState<InsuranceCategory>("salud");

  const [selectedAddons, setSelectedAddons] = useState<string[]>(["urgencias", "asistencia"]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [radicadoCode, setRadicadoCode] = useState("");

  const [lead, setLead] = useState({
    fullName: "",
    documentNumber: "",
    email: "",
    phone: "",
    city: "Bogotá",
  });

  const plansConfig: Record<
    InsuranceCategory,
    {
      title: string;
      basePrice: number;
      icon: any;
      description: string;
      availableAddons: { id: string; label: string; price: number }[];
    }
  > = {
    salud: {
      title: "Póliza de Salud Integral",
      basePrice: 65000,
      icon: Heart,
      description: "Cobertura hospitalaria, citas con especialistas, laboratorio y medicamentos ambulatorios.",
      availableAddons: [
        { id: "urgencias", label: "Atención domiciliaria de urgencias 24/7", price: 15000 },
        { id: "asistencia", label: "Cobertura odontológica preventiva", price: 18000 },
        { id: "viajes", label: "Asistencia médica internacional en viajes", price: 22000 },
      ],
    },
    vida: {
      title: "Seguro de Vida & Respaldo",
      basePrice: 42000,
      icon: Users,
      description: "Protección financiera para tus seres queridos ante cualquier imprevisto, enfermedad o invalidez.",
      availableAddons: [
        { id: "urgencias", label: "Renta diaria por hospitalización", price: 12000 },
        { id: "asistencia", label: "Cobertura anticipada de enfermedades graves", price: 16000 },
        { id: "viajes", label: "Asistencia exequial para 4 familiares", price: 14000 },
      ],
    },
    vehiculo: {
      title: "Seguro Todo Riesgo Auto",
      basePrice: 89000,
      icon: Car,
      description: "Póliza integral ante colisiones, pérdidas totales, responsabilidad civil extracontractual y hurto.",
      availableAddons: [
        { id: "urgencias", label: "Vehículo de reemplazo hasta por 15 días", price: 20000 },
        { id: "asistencia", label: "Conductor elegido y grúa ilimitada", price: 15000 },
        { id: "viajes", label: "Cero deducible en accesorios y lunas", price: 18000 },
      ],
    },
    hogar: {
      title: "Protección Integral Hogar",
      basePrice: 38000,
      icon: Home,
      description: "Amparo total contra incendios, inundaciones, terremotos, daños a terceros y hurto de enseres.",
      availableAddons: [
        { id: "urgencias", label: "Plomería, cerrajería y electricidad 24/7", price: 10000 },
        { id: "asistencia", label: "Cobertura de electrodomésticos por daño eléctrico", price: 15000 },
        { id: "viajes", label: "Alojamiento temporal de emergencia", price: 12000 },
      ],
    },
    pyme: {
      title: "Multiriesgo Empresarial & PYME",
      basePrice: 120000,
      icon: ShieldCheck,
      description: "Seguridad completa para las instalaciones de tu empresa, inventarios, equipos y colaboradores.",
      availableAddons: [
        { id: "urgencias", label: "Lucro cesante por siniestro", price: 35000 },
        { id: "asistencia", label: "Responsabilidad civil patronal", price: 25000 },
        { id: "viajes", label: "Ciberseguridad y protección de datos", price: 30000 },
      ],
    },
  };

  const currentPlan = plansConfig[category];

  const toggleAddon = (id: string) => {
    if (selectedAddons.includes(id)) {
      setSelectedAddons(selectedAddons.filter((item) => item !== id));
    } else {
      setSelectedAddons([...selectedAddons, id]);
    }
  };

  const addonTotal = currentPlan.availableAddons
    .filter((a) => selectedAddons.includes(a.id))
    .reduce((sum, a) => sum + a.price, 0);

  const totalMonthlyPremium = currentPlan.basePrice + addonTotal;

  const formatCOP = (val: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const radicado = "SEG-" + Math.floor(100000 + Math.random() * 900000);
      await submitInsuranceQuote({
        ...lead,
        category,
        selectedPlanId: category,
        selectedPlanName: currentPlan.title,
        estimatedMonthlyPremium: totalMonthlyPremium,
        coverageDetails: selectedAddons,
        status: "pendiente",
        notes: `Cotización de ${currentPlan.title} por ${formatCOP(totalMonthlyPremium)}/mes. Radicado: ${radicado}`,
        source: "portal_seguros_cotizador",
      });

      setRadicadoCode(radicado);
      setIsModalOpen(false);
      setSuccess(true);
    } catch (err) {
      console.error(err);
      alert("Error al procesar la cotización. Por favor intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="cotizador" className="py-16 bg-white relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs font-semibold text-sky-800">
            <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
            <span>Cotizador Dinámico de Pólizas</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Personaliza tu Cobertura y Cotiza al Instante
          </h2>
          <p className="text-sm text-slate-600">
            Elige el tipo de seguro que necesitas, añade asistencias opcionales y recibe tu cotización en segundos.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {(Object.keys(plansConfig) as InsuranceCategory[]).map((cat) => {
            const Icon = plansConfig[cat].icon;
            return (
              <button
                key={cat}
                onClick={() => {
                  setCategory(cat);
                  setSelectedAddons(["urgencias"]);
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                  category === cat
                    ? "bg-sky-50 text-sky-800 border-sky-300 shadow-xs"
                    : "bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{plansConfig[cat].title.split(" ")[0]} {plansConfig[cat].title.split(" ")[1]}</span>
              </button>
            );
          })}
        </div>

        {/* Main Box */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Configuration & Addons */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="text-xs uppercase font-extrabold text-sky-700 tracking-wider block mb-1">
                  Plan Base Seleccionado
                </span>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">{currentPlan.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{currentPlan.description}</p>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-3">
                  Asistencias & Coberturas Adicionales
                </label>
                <div className="space-y-2.5">
                  {currentPlan.availableAddons.map((addon) => {
                    const isChecked = selectedAddons.includes(addon.id);
                    return (
                      <div
                        key={addon.id}
                        onClick={() => toggleAddon(addon.id)}
                        className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                          isChecked
                            ? "bg-sky-50/70 border-sky-300 text-slate-900"
                            : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100/60"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                              isChecked
                                ? "bg-sky-600 border-sky-600 text-white"
                                : "border-slate-300 bg-white"
                            }`}
                          >
                            {isChecked && <CheckCircle2 className="w-4 h-4" />}
                          </div>
                          <span className="text-xs font-semibold">{addon.label}</span>
                        </div>
                        <span className="text-xs font-bold text-sky-700 shrink-0 ml-2">
                          +{formatCOP(addon.price)} /mes
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right: Quote Summary Card */}
            <div className="lg:col-span-5 bg-gradient-to-b from-slate-50 to-white rounded-2xl p-7 border border-slate-200 text-center shadow-md space-y-5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                Prima Mensual Estimada
              </span>
              <div className="text-4xl sm:text-5xl font-black text-sky-700">
                {formatCOP(totalMonthlyPremium)}
                <span className="text-xs text-slate-500 font-normal block mt-1">
                  / mes (impuestos incluidos)
                </span>
              </div>

              <div className="space-y-2 text-xs text-slate-600 pt-4 border-t border-slate-200 text-left">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>Cobertura Base:</span>
                  <span className="font-bold text-slate-900">{formatCOP(currentPlan.basePrice)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>Adicionales Seleccionados ({selectedAddons.length}):</span>
                  <span className="font-bold text-slate-700">+{formatCOP(addonTotal)}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Emisión y Activación:</span>
                  <span className="font-extrabold text-emerald-700">Gratis (Digital)</span>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-sky-600 via-blue-600 to-sky-600 hover:from-sky-700 hover:to-blue-700 shadow-md shadow-sky-600/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
              >
                <span>Solicitar Póliza Inmediata</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-slate-900 mb-1">
              Emisión de Póliza en Línea
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Póliza: <strong className="text-sky-700">{currentPlan.title}</strong> por{" "}
              <strong className="text-slate-900">{formatCOP(totalMonthlyPremium)} /mes</strong>.
            </p>

            <form onSubmit={handleApply} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Nombre Completo del Titular *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Ana Patricia Gómez"
                  value={lead.fullName}
                  onChange={(e) => setLead({ ...lead, fullName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:bg-white focus:border-sky-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Número de Documento *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. 52489123"
                    value={lead.documentNumber}
                    onChange={(e) => setLead({ ...lead, documentNumber: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:bg-white focus:border-sky-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Ciudad de Residencia *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Cali"
                    value={lead.city}
                    onChange={(e) => setLead({ ...lead, city: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:bg-white focus:border-sky-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="ana@ejemplo.com"
                    value={lead.email}
                    onChange={(e) => setLead({ ...lead, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:bg-white focus:border-sky-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Teléfono Celular *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="Ej. 315 456 7890"
                    value={lead.phone}
                    onChange={(e) => setLead({ ...lead, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:bg-white focus:border-sky-600"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-1/3 py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-2/3 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 shadow-md shadow-sky-600/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <span>Generando póliza...</span>
                  ) : (
                    <>
                      <span>Confirmar y Enviar Póliza</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <SuccessModal
        isOpen={success}
        onClose={() => setSuccess(false)}
        title="¡Cotización Registrada con Éxito!"
        message="Tu póliza ha sido pre-emitida en nuestro sistema de seguros. Te enviaremos la carátula y condiciones a tu correo y te contactaremos para confirmar tu medio de pago preferido."
        referenceCode={radicadoCode}
      />
    </section>
  );
}
