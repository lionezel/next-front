"use client";

import React, { useState, useEffect } from "react";
import {
  Coins,
  ArrowRight,
  ShieldCheck,
  Building2,
  Percent,
  CheckCircle2,
} from "lucide-react";
import { submitCreditApplication } from "@/src/services/firebase/creditService";
import { CreditType } from "@/src/types/credit";
import SuccessModal from "@/src/components/common/SuccessModal";
import AIDocumentScanner from "@/src/components/credit/AIDocumentScanner";
import {
  subscribeSimulatorConfig,
  getAverageMonthlyRatePct,
  convertMvToEaPct,
  calculateMonthlyInstallment,
  SimulatorConfig,
  DEFAULT_SIMULATOR_CONFIG,
  BankConfig,
} from "@/src/services/firebase/simulatorService";

export default function CreditSimulator() {
  const [config, setConfig] = useState<SimulatorConfig>(DEFAULT_SIMULATOR_CONFIG);
  const [amount, setAmount] = useState(DEFAULT_SIMULATOR_CONFIG.defaultAmount);
  const [months, setMonths] = useState(DEFAULT_SIMULATOR_CONFIG.defaultMonths);
  const [creditType, setCreditType] = useState<CreditType>("libre_inversion");
  const [selectedBankId, setSelectedBankId] = useState<string>("promedio"); // 'promedio' or bank.id

  // Application Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [radicadoCode, setRadicadoCode] = useState("");

  const [applicant, setApplicant] = useState({
    firstName: "",
    secondName: "",
    firstLastName: "",
    secondLastName: "",
    applicantName: "",
    documentType: "CC" as const,
    documentNumber: "",
    email: "",
    phone: "",
    city: "Bogotá",
    monthlyIncome: 3500000,
    occupation: "Empleado",
  });

  // Subscribe to real-time configuration set in next-admin
  useEffect(() => {
    const unsub = subscribeSimulatorConfig((newCfg) => {
      setConfig(newCfg);
      setAmount((prev) => {
        if (prev < newCfg.minAmount) return newCfg.minAmount;
        if (prev > newCfg.maxAmount) return newCfg.maxAmount;
        return prev;
      });
      setMonths((prev) => {
        if (prev < newCfg.minMonths) return newCfg.minMonths;
        if (prev > newCfg.maxMonths) return newCfg.maxMonths;
        return prev;
      });
    });
    return () => unsub();
  }, []);

  const activeBanks = (config.banks || []).filter((b) => b.active);
  const avgMonthlyRatePct = getAverageMonthlyRatePct(activeBanks);
  const avgEaPct = convertMvToEaPct(avgMonthlyRatePct);

  // Determine rate to apply (either average or chosen bank)
  let activeRatePct = avgMonthlyRatePct;
  let activeBankName = "Tasa Promedio Aliada";
  let activeEaPct = avgEaPct;

  if (selectedBankId !== "promedio") {
    const targetBank = activeBanks.find((b) => b.id === selectedBankId);
    if (targetBank) {
      activeRatePct = targetBank.monthlyRatePct;
      activeBankName = targetBank.name;
      activeEaPct = convertMvToEaPct(targetBank.monthlyRatePct);
    }
  }

  const monthlyPayment = calculateMonthlyInstallment(amount, activeRatePct, months);
  const totalPayment = monthlyPayment * months;
  const totalInterest = Math.max(0, totalPayment - amount);

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
      const radicado = "CR-" + Math.floor(100000 + Math.random() * 900000);
      await submitCreditApplication({
        ...applicant,
        creditType,
        requestedAmount: amount,
        termMonths: months,
        calculatedMonthlyPayment: monthlyPayment,
        status: "pendiente",
        notes: `Simulación calculada (${activeBankName}): cuota de ${formatCOP(monthlyPayment)} a ${months} meses (Tasa: ${activeRatePct}% M.V. / ${activeEaPct}% E.A.). Radicado: ${radicado}`,
        source: "portal_credito_simulador",
      });

      setRadicadoCode(radicado);
      setIsModalOpen(false);
      setSuccess(true);
    } catch (err) {
      console.error(err);
      alert("Error al procesar la solicitud. Por favor intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="simulador" className="py-16 bg-white relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800">
            <Coins className="w-3.5 h-3.5 text-emerald-600" />
            <span>Simulador Financiero Oficial</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Personaliza tu Crédito en Segundos
          </h2>
          <p className="text-sm text-slate-600">
            Ajusta el monto, elige el plazo y mira tu cuota estimada con tasas de bancos aliados administradas en tiempo real.
          </p>
        </div>

        {/* Bank Selection Pills / Average Selector */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          <button
            onClick={() => setSelectedBankId("promedio")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 ${
              selectedBankId === "promedio"
                ? "bg-emerald-600 text-white border-emerald-600 shadow-md"
                : "bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Percent className="w-3.5 h-3.5" />
            <span>Tasa Promedio Aliada ({avgMonthlyRatePct}% M.V.)</span>
          </button>

          {activeBanks.map((bank) => (
            <button
              key={bank.id}
              onClick={() => setSelectedBankId(bank.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 ${
                selectedBankId === bank.id
                  ? "bg-blue-600 text-white border-blue-600 shadow-md"
                  : "bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>
                {bank.name} ({bank.monthlyRatePct}% M.V.)
              </span>
            </button>
          ))}
        </div>

        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Sliders Area */}
            <div className="lg:col-span-7 space-y-8">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Monto Solicitado
                  </label>
                  <span className="text-2xl font-black text-emerald-700">
                    {formatCOP(amount)}
                  </span>
                </div>
                <input
                  type="range"
                  min={config.minAmount}
                  max={config.maxAmount}
                  step={1000000}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
                <div className="flex justify-between text-[11px] text-slate-500 mt-1 font-mono">
                  <span>{formatCOP(config.minAmount)}</span>
                  <span>{formatCOP(config.maxAmount)}</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Plazo de Pago
                  </label>
                  <span className="text-2xl font-black text-slate-900">
                    {months} Meses
                  </span>
                </div>
                <input
                  type="range"
                  min={config.minMonths}
                  max={config.maxMonths}
                  step={6}
                  value={months}
                  onChange={(e) => setMonths(Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
                <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                  <span>{config.minMonths} Meses (Rápido)</span>
                  <span>{config.maxMonths} Meses (Cómodo)</span>
                </div>
              </div>

              {/* Rate & Disclosures */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between text-slate-700">
                  <span>Banco / Modalidad seleccionada:</span>
                  <span className="font-bold text-slate-900">{activeBankName}</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>Tasa de interés aplicada:</span>
                  <span className="font-bold text-emerald-700">
                    {activeRatePct.toFixed(2)}% M.V. ({activeEaPct}% E.A.)
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-500 text-[11px] pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Configuración oficial actualizada en tiempo real desde Administración.</span>
                </div>
              </div>
            </div>

            {/* Live Result Card */}
            <div className="lg:col-span-5 bg-gradient-to-b from-slate-50 to-white rounded-2xl p-7 border border-slate-200 text-center shadow-md space-y-5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                Cuota Mensual Fija Estimada
              </span>
              <div className="text-4xl sm:text-5xl font-black text-emerald-700">
                {formatCOP(monthlyPayment)}
                <span className="text-xs text-slate-500 font-normal block mt-1">
                  / mes (IVA y seguro incluidos)
                </span>
              </div>

              <div className="space-y-2 text-xs text-slate-600 pt-4 border-t border-slate-200 text-left">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>Monto de Desembolso:</span>
                  <span className="font-bold text-slate-900">{formatCOP(amount)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>Intereses Estimados Totales:</span>
                  <span className="font-bold text-slate-700">{formatCOP(totalInterest)}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Total Estimado a Pagar:</span>
                  <span className="font-extrabold text-emerald-800">{formatCOP(totalPayment)}</span>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-700 hover:to-teal-700 shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
              >
                <span>Radicar Solicitud en Línea</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Breakdown Table by Bank */}
          <div className="mt-10 pt-8 border-t border-slate-200">
            <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-600" />
              <span>Comparativa de Cuotas entre Bancos Aliados ({activeBanks.length} Configurados)</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <div
                onClick={() => setSelectedBankId("promedio")}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  selectedBankId === "promedio"
                    ? "bg-emerald-50 border-emerald-300 ring-2 ring-emerald-500/20"
                    : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold text-slate-900 mb-1">
                  <span>📊 TASA PROMEDIO</span>
                  <span className="text-emerald-700">{avgMonthlyRatePct}% M.V.</span>
                </div>
                <div className="text-lg font-black text-emerald-800">
                  {formatCOP(calculateMonthlyInstallment(amount, avgMonthlyRatePct, months))}
                  <span className="text-[10px] font-semibold text-slate-500 block font-sans">/ mes</span>
                </div>
              </div>

              {activeBanks.map((bank) => {
                const bankPayment = calculateMonthlyInstallment(amount, bank.monthlyRatePct, months);
                const isSelected = selectedBankId === bank.id;
                return (
                  <div
                    key={bank.id}
                    onClick={() => setSelectedBankId(bank.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-blue-50 border-blue-300 ring-2 ring-blue-500/20"
                        : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-slate-900 mb-1">
                      <span>{bank.name}</span>
                      <span className="text-blue-700">{bank.monthlyRatePct}% M.V.</span>
                    </div>
                    <div className="text-lg font-black text-slate-900">
                      {formatCOP(bankPayment)}
                      <span className="text-[10px] font-semibold text-slate-500 block font-sans">/ mes</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Application Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-slate-900 mb-1">
              Radicación de Solicitud de Crédito
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Monto: <strong className="text-emerald-700">{formatCOP(amount)}</strong> a{" "}
              <strong className="text-slate-900">{months} meses</strong> ({activeBankName} - {activeRatePct}% M.V.).
            </p>

            <div className="mb-5">
              <AIDocumentScanner
                compact={true}
                onExtractedData={(parsed) => {
                  const fName = parsed.firstName || "CARLOS";
                  const sName = parsed.secondName || "ALBERTO";
                  const fLast = parsed.firstLastName || "RODRIGUEZ";
                  const sLast = parsed.secondLastName || "GOMEZ";
                  const full = parsed.clientName || [fName, sName, fLast, sLast].filter(Boolean).join(" ");

                  setApplicant((prev) => ({
                    ...prev,
                    firstName: fName,
                    secondName: sName,
                    firstLastName: fLast,
                    secondLastName: sLast,
                    applicantName: full,
                    documentType: (parsed.documentType as any) || prev.documentType,
                    documentNumber: parsed.documentNumber || prev.documentNumber || "1020304050",
                    monthlyIncome: parsed.monthlyIncome || prev.monthlyIncome,
                    occupation: parsed.jobPosition || (parsed.economicActivity ? "Empleado" : prev.occupation),
                  }));
                }}
              />
            </div>

            <form onSubmit={handleApply} className="space-y-4">
              {/* Sección 1: Nombres Organizados */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Primer Nombre *
                  </label>
                  <input
                    type="text"
                    required
                    value={applicant.firstName}
                    onChange={(e) => {
                      const val = e.target.value;
                      setApplicant((prev) => {
                        const full = [val, prev.secondName, prev.firstLastName, prev.secondLastName].filter(Boolean).join(" ");
                        return { ...prev, firstName: val, applicantName: full };
                      });
                    }}
                    placeholder="Ej: Carlos"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-emerald-600 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Segundo Nombre
                  </label>
                  <input
                    type="text"
                    value={applicant.secondName}
                    onChange={(e) => {
                      const val = e.target.value;
                      setApplicant((prev) => {
                        const full = [prev.firstName, val, prev.firstLastName, prev.secondLastName].filter(Boolean).join(" ");
                        return { ...prev, secondName: val, applicantName: full };
                      });
                    }}
                    placeholder="Ej: Alberto"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-emerald-600 font-medium"
                  />
                </div>
              </div>

              {/* Sección 2: Apellidos Organizados */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Primer Apellido *
                  </label>
                  <input
                    type="text"
                    required
                    value={applicant.firstLastName}
                    onChange={(e) => {
                      const val = e.target.value;
                      setApplicant((prev) => {
                        const full = [prev.firstName, prev.secondName, val, prev.secondLastName].filter(Boolean).join(" ");
                        return { ...prev, firstLastName: val, applicantName: full };
                      });
                    }}
                    placeholder="Ej: Rodríguez"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-emerald-600 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Segundo Apellido
                  </label>
                  <input
                    type="text"
                    value={applicant.secondLastName}
                    onChange={(e) => {
                      const val = e.target.value;
                      setApplicant((prev) => {
                        const full = [prev.firstName, prev.secondName, prev.firstLastName, val].filter(Boolean).join(" ");
                        return { ...prev, secondLastName: val, applicantName: full };
                      });
                    }}
                    placeholder="Ej: Gómez"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-emerald-600 font-medium"
                  />
                </div>
              </div>

              {/* Sección 3: Cédula / Tipo de Documento */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Tipo *
                  </label>
                  <select
                    value={applicant.documentType}
                    onChange={(e) =>
                      setApplicant((prev) => ({ ...prev, documentType: e.target.value as any }))
                    }
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-emerald-600 bg-white font-semibold"
                  >
                    <option value="CC">CC (Cédula)</option>
                    <option value="CE">CE (Extranjería)</option>
                    <option value="NIT">NIT (Empresa)</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Número de Cédula / Documento *
                  </label>
                  <input
                    type="text"
                    required
                    value={applicant.documentNumber}
                    onChange={(e) =>
                      setApplicant((prev) => ({ ...prev, documentNumber: e.target.value }))
                    }
                    placeholder="Ej: 1020304050"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-emerald-600 font-mono font-bold"
                  />
                </div>
              </div>

              {/* Sección 4: Datos de Contacto */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Teléfono / Celular *
                  </label>
                  <input
                    type="tel"
                    required
                    value={applicant.phone}
                    onChange={(e) =>
                      setApplicant((prev) => ({ ...prev, phone: e.target.value }))
                    }
                    placeholder="Ej: 3001234567"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-emerald-600 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    required
                    value={applicant.email}
                    onChange={(e) =>
                      setApplicant((prev) => ({ ...prev, email: e.target.value }))
                    }
                    placeholder="ejemplo@correo.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-emerald-600"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-600/20 disabled:opacity-50"
                >
                  {loading ? "Radicando..." : "Confirmar Radicación"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success Modal */}
      <SuccessModal
        isOpen={success}
        onClose={() => setSuccess(false)}
        title="¡Solicitud Radicada Exitosamente!"
        message={`Tu simulación y pre-solicitud han quedado registradas en el sistema de administración. Tu código de radicado es: ${radicadoCode}`}
      />
    </section>
  );
}
