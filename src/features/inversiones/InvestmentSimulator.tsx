"use client";

import React, { useState } from "react";
import {
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { submitInvestmentLead } from "@/src/services/firebase/investmentService";
import { RiskProfile } from "@/src/types/investment";
import SuccessModal from "@/src/components/common/SuccessModal";

export default function InvestmentSimulator() {
  const [initialCapital, setInitialCapital] = useState(15000000); // 15M COP
  const [monthlyContribution, setMonthlyContribution] = useState(500000); // 500k COP/mes
  const [termMonths, setTermMonths] = useState(24);
  const [riskProfile, setRiskProfile] = useState<RiskProfile>("moderado");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [radicadoCode, setRadicadoCode] = useState("");

  const [lead, setLead] = useState({
    fullName: "",
    email: "",
    phone: "",
    city: "Bogotá",
    investmentExperience: "intermedio" as const,
  });

  const profiles: Record<RiskProfile, { rateEA: number; label: string; desc: string }> = {
    conservador: {
      rateEA: 0.115,
      label: "Conservador (11.5% E.A.)",
      desc: "Renta fija estructurada, deuda privada de alta calificación y mínima volatilidad.",
    },
    moderado: {
      rateEA: 0.145,
      label: "Moderado (14.5% E.A.)",
      desc: "Estrategia mixta equilibrada con renta fija institucional y activos de retorno continuo.",
    },
    dinamico: {
      rateEA: 0.178,
      label: "Dinámico (17.8% E.A.)",
      desc: "Portafolio de alto crecimiento patrimonial enfocado en oportunidades de alta rentabilidad.",
    },
  };

  const selectedProfile = profiles[riskProfile];
  const monthlyRate = Math.pow(1 + selectedProfile.rateEA, 1 / 12) - 1;

  let runningBalance = initialCapital;
  let totalInvested = initialCapital;

  for (let m = 1; m <= termMonths; m++) {
    runningBalance = runningBalance * (1 + monthlyRate) + monthlyContribution;
    totalInvested += monthlyContribution;
  }

  const finalBalance = Math.round(runningBalance);
  const estimatedEarnings = Math.max(0, finalBalance - totalInvested);

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
      const radicado = "INV-" + Math.floor(100000 + Math.random() * 900000);
      await submitInvestmentLead({
        ...lead,
        riskProfile,
        intendedCapital: initialCapital,
        plannedTermMonths: termMonths,
        status: "pendiente",
        notes: `Simulación calculada: Capital inicial ${formatCOP(initialCapital)}, aporte mensual ${formatCOP(monthlyContribution)}, plazo ${termMonths} meses (${selectedProfile.label}). Proyección final: ${formatCOP(finalBalance)}. Radicado: ${radicado}`,
        source: "portal_inversiones_simulador",
      });

      setRadicadoCode(radicado);
      setIsModalOpen(false);
      setSuccess(true);
    } catch (err) {
      console.error(err);
      alert("Error al procesar la solicitud de asesoría. Por favor intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="simulador" className="py-16 bg-white relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-xs font-semibold text-indigo-800">
            <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
            <span>Simulador de Interés Compuesto</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Proyecta el Crecimiento de tu Capital
          </h2>
          <p className="text-sm text-slate-600">
            Conoce el poder de los rendimientos acumulados con aportes periódicos y portafolios de alto desempeño.
          </p>
        </div>

        {/* Profile Selector */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          {(Object.keys(profiles) as RiskProfile[]).map((p) => (
            <button
              key={p}
              onClick={() => setRiskProfile(p)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                riskProfile === p
                  ? "bg-indigo-50 text-indigo-800 border-indigo-300 shadow-xs"
                  : "bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              {profiles[p].label}
            </button>
          ))}
        </div>

        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Sliders Area */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Capital Inicial
                  </label>
                  <span className="text-2xl font-black text-indigo-700">
                    {formatCOP(initialCapital)}
                  </span>
                </div>
                <input
                  type="range"
                  min={500000}
                  max={100000000}
                  step={500000}
                  value={initialCapital}
                  onChange={(e) => setInitialCapital(Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                  <span>$500,000 COP</span>
                  <span>$100,000,000 COP</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Aporte Mensual Adicional
                  </label>
                  <span className="text-2xl font-black text-slate-900">
                    {formatCOP(monthlyContribution)}
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={10000000}
                  step={100000}
                  value={monthlyContribution}
                  onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                  <span>$0 COP (Sin aportes)</span>
                  <span>$10,000,000 COP / mes</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Plazo de Inversión
                  </label>
                  <span className="text-2xl font-black text-slate-900">
                    {termMonths} Meses ({Math.round((termMonths / 12) * 10) / 10} años)
                  </span>
                </div>
                <input
                  type="range"
                  min={6}
                  max={60}
                  step={6}
                  value={termMonths}
                  onChange={(e) => setTermMonths(Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                  <span>6 Meses</span>
                  <span>60 Meses</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs text-slate-600">
                <p className="font-semibold text-slate-900">{selectedProfile.label}</p>
                <p className="text-slate-600 leading-relaxed">{selectedProfile.desc}</p>
              </div>
            </div>

            {/* Results Card */}
            <div className="lg:col-span-5 bg-gradient-to-b from-slate-50 to-white rounded-2xl p-7 border border-slate-200 text-center shadow-md space-y-5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                Patrimonio Final Proyectado
              </span>
              <div className="text-3xl sm:text-4xl font-black text-indigo-700">
                {formatCOP(finalBalance)}
              </div>

              <div className="space-y-2 text-xs text-slate-600 pt-4 border-t border-slate-200 text-left">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>Total Capital Aportado:</span>
                  <span className="font-bold text-slate-900">{formatCOP(totalInvested)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>Rendimientos Generados:</span>
                  <span className="font-extrabold text-emerald-700">
                    +{formatCOP(estimatedEarnings)}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Rendimiento Proyectado:</span>
                  <span className="font-bold text-indigo-800">
                    {((estimatedEarnings / totalInvested) * 100).toFixed(1)}% de retorno total
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 hover:from-indigo-700 hover:to-violet-700 shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
              >
                <span>Solicitar Asesoría Patrimonial</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Advisory Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-slate-900 mb-1">
              Solicitud de Apertura de Inversión
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Portafolio: <strong className="text-indigo-700">{selectedProfile.label}</strong> con capital proyectado de{" "}
              <strong className="text-slate-900">{formatCOP(initialCapital)}</strong>.
            </p>

            <form onSubmit={handleApply} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. María Fernanda López"
                  value={lead.fullName}
                  onChange={(e) => setLead({ ...lead, fullName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:bg-white focus:border-indigo-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="maria@ejemplo.com"
                    value={lead.email}
                    onChange={(e) => setLead({ ...lead, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:bg-white focus:border-indigo-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Teléfono Celular *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="Ej. 312 987 6543"
                    value={lead.phone}
                    onChange={(e) => setLead({ ...lead, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:bg-white focus:border-indigo-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Ciudad *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Medellín"
                    value={lead.city}
                    onChange={(e) => setLead({ ...lead, city: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:bg-white focus:border-indigo-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Experiencia Invirtiendo
                  </label>
                  <select
                    value={lead.investmentExperience}
                    onChange={(e) =>
                      setLead({
                        ...lead,
                        investmentExperience: e.target.value as any,
                      })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:bg-white focus:border-indigo-600"
                  >
                    <option value="principiante">Principiante</option>
                    <option value="intermedio">Intermedio</option>
                    <option value="avanzado">Avanzado</option>
                  </select>
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
                  className="w-2/3 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <span>Registrando solicitud...</span>
                  ) : (
                    <>
                      <span>Contactar Asesor Patrimonial</span>
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
        title="¡Solicitud de Asesoría Registrada!"
        message="Un consultor patrimonial senior de Inversiones Next se pondrá en contacto contigo para estructurar tu portafolio y formalizar la apertura."
        referenceCode={radicadoCode}
      />
    </section>
  );
}
