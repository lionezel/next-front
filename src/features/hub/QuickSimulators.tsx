"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Coins,
  TrendingUp,
  ShieldCheck,
  Dumbbell,
  ArrowRight,
  Calculator,
  CheckCircle,
} from "lucide-react";

export default function QuickSimulators() {
  const [activeTab, setActiveTab] = useState<"credito" | "inversiones" | "seguros" | "fit">("credito");

  // Crédito State
  const [creditAmount, setCreditAmount] = useState(15000000); // 15 millones COP
  const [creditMonths, setCreditMonths] = useState(24);
  const creditMonthlyRate = 0.0145; // 1.45% MV
  const creditMonthlyPayment = Math.round(
    (creditAmount * creditMonthlyRate) / (1 - Math.pow(1 + creditMonthlyRate, -creditMonths))
  );

  // Inversiones State
  const [investCapital, setInvestCapital] = useState(10000000); // 10 millones COP
  const [investMonths, setInvestMonths] = useState(12);
  const investAnnualRate = 0.145; // 14.5% EA
  const investEstimatedReturn = Math.round(
    investCapital * (Math.pow(1 + investAnnualRate, investMonths / 12) - 1)
  );

  // Seguros State
  const [insuranceType, setInsuranceType] = useState<"salud" | "vida" | "vehiculo">("salud");
  const insurancePrices = {
    salud: { price: 65000, desc: "Póliza integral de hospitalización y especialistas" },
    vida: { price: 42000, desc: "Protección familiar con respaldo patrimonial total" },
    vehiculo: { price: 89000, desc: "Todo riesgo con asistencia 24/7 sin deducible alto" },
  };

  // Fit State
  const [fitGoal, setFitGoal] = useState<"masa" | "definicion" | "rendimiento">("masa");
  const fitPacks = {
    masa: { name: "Pack Volumen Magro", price: 285000, includes: "Proteína Whey + Creatina Creapure + Shaker Oficial" },
    definicion: { name: "Pack Definición & Pérdida", price: 245000, includes: "Proteína Isolate Zero + Quemador Lipotrópico" },
    rendimiento: { name: "Pack Rendimiento Pro", price: 260000, includes: "Pre-Entreno Nitro + BCAA Recovery + Glutamina" },
  };

  const formatCOP = (val: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <section id="simuladores" className="py-20 bg-white relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-blue-800">
            <Calculator className="w-3.5 h-3.5" />
            <span>Simulador Interactivo en Vivo</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Calcula en Tiempo Real tus Beneficios
          </h2>
          <p className="text-sm text-slate-600">
            Selecciona una vertical y experimenta con cifras reales antes de solicitar o adquirir.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          <button
            onClick={() => setActiveTab("credito")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all border ${
              activeTab === "credito"
                ? "bg-emerald-50 text-emerald-800 border-emerald-300 shadow-xs"
                : "text-slate-600 hover:text-slate-900 bg-slate-50 border-slate-200 hover:bg-slate-100"
            }`}
          >
            <Coins className="w-4 h-4 text-emerald-600" />
            <span>Simulador Crédito</span>
          </button>

          <button
            onClick={() => setActiveTab("inversiones")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all border ${
              activeTab === "inversiones"
                ? "bg-indigo-50 text-indigo-800 border-indigo-300 shadow-xs"
                : "text-slate-600 hover:text-slate-900 bg-slate-50 border-slate-200 hover:bg-slate-100"
            }`}
          >
            <TrendingUp className="w-4 h-4 text-indigo-600" />
            <span>Simulador Inversiones</span>
          </button>

          <button
            onClick={() => setActiveTab("seguros")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all border ${
              activeTab === "seguros"
                ? "bg-sky-50 text-sky-800 border-sky-300 shadow-xs"
                : "text-slate-600 hover:text-slate-900 bg-slate-50 border-slate-200 hover:bg-slate-100"
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-sky-600" />
            <span>Cotizador Seguros</span>
          </button>

          <button
            onClick={() => setActiveTab("fit")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all border ${
              activeTab === "fit"
                ? "bg-amber-50 text-amber-900 border-amber-300 shadow-xs"
                : "text-slate-600 hover:text-slate-900 bg-slate-50 border-slate-200 hover:bg-slate-100"
            }`}
          >
            <Dumbbell className="w-4 h-4 text-amber-600" />
            <span>Calculadora Fit</span>
          </button>
        </div>

        {/* Tab Content Box */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-xl">
          {/* TAB 1: CRÉDITO */}
          {activeTab === "credito" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Monto a Solicitar
                    </label>
                    <span className="text-2xl font-black text-emerald-700">
                      {formatCOP(creditAmount)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={1000000}
                    max={50000000}
                    step={500000}
                    value={creditAmount}
                    onChange={(e) => setCreditAmount(Number(e.target.value))}
                    className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                  />
                  <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                    <span>$1,000,000 COP</span>
                    <span>$50,000,000 COP</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Plazo en Meses
                    </label>
                    <span className="text-2xl font-black text-slate-900">
                      {creditMonths} Meses
                    </span>
                  </div>
                  <input
                    type="range"
                    min={6}
                    max={60}
                    step={6}
                    value={creditMonths}
                    onChange={(e) => setCreditMonths(Number(e.target.value))}
                    className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                  />
                  <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                    <span>6 Meses</span>
                    <span>60 Meses</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 flex items-center justify-between text-xs">
                  <span className="text-slate-700">Tasa de interés preferencial estimada:</span>
                  <span className="font-bold text-emerald-800">1.45% M.V. (18.8% E.A.)</span>
                </div>
              </div>

              <div className="lg:col-span-5 bg-gradient-to-b from-slate-50 to-white rounded-2xl p-6 border border-slate-200 text-center space-y-4 shadow-sm">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                  Cuota Mensual Estimada
                </span>
                <div className="text-3xl sm:text-4xl font-black text-emerald-700">
                  {formatCOP(creditMonthlyPayment)}
                  <span className="text-xs text-slate-500 font-normal block mt-1">/ mes</span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-200">
                  <div className="flex justify-between">
                    <span>Monto Total Financiado:</span>
                    <span className="font-semibold text-slate-900">{formatCOP(creditAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Estimado a Pagar:</span>
                    <span className="font-semibold text-slate-900">
                      {formatCOP(creditMonthlyPayment * creditMonths)}
                    </span>
                  </div>
                </div>

                <Link
                  href="/credito#solicitud"
                  className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all mt-4"
                >
                  <span>Solicitar Crédito Ahora</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}

          {/* TAB 2: INVERSIONES */}
          {activeTab === "inversiones" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Capital Inicial a Invertir
                    </label>
                    <span className="text-2xl font-black text-indigo-700">
                      {formatCOP(investCapital)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={1000000}
                    max={50000000}
                    step={1000000}
                    value={investCapital}
                    onChange={(e) => setInvestCapital(Number(e.target.value))}
                    className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                    <span>$1,000,000 COP</span>
                    <span>$50,000,000 COP</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Plazo de Inversión
                    </label>
                    <span className="text-2xl font-black text-slate-900">
                      {investMonths} Meses
                    </span>
                  </div>
                  <input
                    type="range"
                    min={6}
                    max={36}
                    step={6}
                    value={investMonths}
                    onChange={(e) => setInvestMonths(Number(e.target.value))}
                    className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                    <span>6 Meses</span>
                    <span>36 Meses</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200 flex items-center justify-between text-xs">
                  <span className="text-slate-700">Rendimiento anual estimado de portafolio:</span>
                  <span className="font-bold text-indigo-800">14.5% E.A.</span>
                </div>
              </div>

              <div className="lg:col-span-5 bg-gradient-to-b from-slate-50 to-white rounded-2xl p-6 border border-slate-200 text-center space-y-4 shadow-sm">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                  Ganancia Estimada Proyectada
                </span>
                <div className="text-3xl sm:text-4xl font-black text-indigo-700">
                  +{formatCOP(investEstimatedReturn)}
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-200">
                  <div className="flex justify-between">
                    <span>Capital Inicial:</span>
                    <span className="font-semibold text-slate-900">{formatCOP(investCapital)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Monto Final Estimado:</span>
                    <span className="font-bold text-indigo-900">
                      {formatCOP(investCapital + investEstimatedReturn)}
                    </span>
                  </div>
                </div>

                <Link
                  href="/inversiones#simulador"
                  className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all mt-4"
                >
                  <span>Abrir Portafolio de Inversión</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}

          {/* TAB 3: SEGUROS */}
          {activeTab === "seguros" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Selecciona la Póliza de tu Interés:
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(["salud", "vida", "vehiculo"] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setInsuranceType(type)}
                      className={`p-3.5 rounded-2xl border text-left transition-all ${
                        insuranceType === type
                          ? "bg-sky-50 border-sky-300 text-sky-900 shadow-xs"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      <span className="text-xs uppercase font-extrabold block text-slate-900">
                        {type === "salud" ? "Salud" : type === "vida" ? "Vida" : "Vehículo"}
                      </span>
                      <span className="text-[10px] text-slate-500">Póliza integral</span>
                    </button>
                  ))}
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-2">
                  <p className="font-semibold text-slate-900">Cobertura destacada:</p>
                  <p className="text-slate-600">{insurancePrices[insuranceType].desc}</p>
                  <div className="flex items-center gap-2 text-sky-700 pt-1 font-medium">
                    <CheckCircle className="w-3.5 h-3.5 text-sky-600" />
                    <span>Atención y asistencia médica 24/7 sin copagos sorpresa</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 bg-gradient-to-b from-slate-50 to-white rounded-2xl p-6 border border-slate-200 text-center space-y-4 shadow-sm">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                  Prima Mensual desde
                </span>
                <div className="text-3xl sm:text-4xl font-black text-sky-700">
                  {formatCOP(insurancePrices[insuranceType].price)}
                  <span className="text-xs text-slate-500 font-normal block mt-1">/ mes</span>
                </div>

                <p className="text-xs text-slate-600">
                  Cotización instantánea con emisión 100% digital en minutos.
                </p>

                <Link
                  href="/seguros#cotizador"
                  className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 shadow-md shadow-sky-600/20 flex items-center justify-center gap-2 transition-all mt-4"
                >
                  <span>Cotizar Póliza Completa</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}

          {/* TAB 4: FIT */}
          {activeTab === "fit" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Selecciona tu Objetivo Fitness:
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(["masa", "definicion", "rendimiento"] as const).map((goal) => (
                    <button
                      key={goal}
                      onClick={() => setFitGoal(goal)}
                      className={`p-3.5 rounded-2xl border text-left transition-all ${
                        fitGoal === goal
                          ? "bg-amber-50 border-amber-300 text-amber-900 shadow-xs"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      <span className="text-xs uppercase font-extrabold block text-slate-900">
                        {goal === "masa" ? "Aumento Masa" : goal === "definicion" ? "Definición" : "Rendimiento"}
                      </span>
                      <span className="text-[10px] text-slate-500">Pack recomendado</span>
                    </button>
                  ))}
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-2">
                  <p className="font-semibold text-amber-900">{fitPacks[fitGoal].name}</p>
                  <p className="text-slate-600">Incluye: {fitPacks[fitGoal].includes}</p>
                  <div className="flex items-center gap-2 text-amber-700 pt-1 font-medium">
                    <CheckCircle className="w-3.5 h-3.5 text-amber-600" />
                    <span>Laboratorio con registro INVIMA y envío nacional asegurado</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 bg-gradient-to-b from-slate-50 to-white rounded-2xl p-6 border border-slate-200 text-center space-y-4 shadow-sm">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                  Precio Combo Especial
                </span>
                <div className="text-3xl sm:text-4xl font-black text-amber-700">
                  {formatCOP(fitPacks[fitGoal].price)}
                </div>

                <p className="text-xs text-slate-600">
                  Ahorro del 25% frente a compra individual + asesoría incluida.
                </p>

                <Link
                  href="/fit#catalogo"
                  className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 shadow-md shadow-amber-600/20 flex items-center justify-center gap-2 transition-all mt-4"
                >
                  <span>Ver Catálogo Fit</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
