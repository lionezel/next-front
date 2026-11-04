"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Video,
  User,
  Phone,
  Mail,
  FileText,
  CheckCircle2,
  Building2,
  Coins,
  TrendingUp,
  ShieldCheck,
  Dumbbell,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Copy,
  Check,
  CalendarCheck,
  ExternalLink,
  CalendarPlus,
  Sparkles,
  X,
} from "lucide-react";
import {
  AppointmentModality,
  DocumentType,
  BranchOffice,
  BRANCH_OFFICES,
  AVAILABLE_TIME_SLOTS,
  APPOINTMENT_SERVICES,
} from "@/src/types/appointment";
import {
  createAppointment,
  getOccupiedTimeSlots,
  generateGoogleCalendarUrl,
} from "@/src/services/firebase/appointmentService";
import { subscribeActiveBranches } from "@/src/services/firebase/branchService";
import {
  getUserContactProfile,
  saveUserContactProfile,
} from "@/src/services/firebase/userProfileService";
import { useAuth } from "@/src/context/AuthContext";

export default function AppointmentScheduler() {
  const { user } = useAuth();
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [loading, setLoading] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Dynamic Branches from Admin / Firestore
  const [branches, setBranches] = useState<BranchOffice[]>(BRANCH_OFFICES);

  // Form State
  const [modality, setModality] = useState<AppointmentModality>("virtual");
  const [branch, setBranch] = useState(BRANCH_OFFICES[0].name);
  const [selectedService, setSelectedService] = useState(APPOINTMENT_SERVICES[0]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [occupiedSlots, setOccupiedSlots] = useState<string[]>([]);

  // User details
  const [documentType, setDocumentType] = useState<DocumentType>("CC");
  const [documentNumber, setDocumentNumber] = useState("");
  const [clientName, setClientName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");

  // Auto-fill from Firestore
  const [savedDataLoaded, setSavedDataLoaded] = useState(false);
  const [showSavedBanner, setShowSavedBanner] = useState(false);

  // Result state
  const [createdCode, setCreatedCode] = useState("");
  const [createdMeetUrl, setCreatedMeetUrl] = useState("");
  const [copiedMeetUrl, setCopiedMeetUrl] = useState(false);

  // Generate next 14 available dates (skipping Sundays)
  const availableDates = React.useMemo(() => {
    const dates: { dateStr: string; label: string; dayName: string; isToday: boolean }[] = [];
    const today = new Date();

    let count = 0;
    let daysAhead = 0;

    while (count < 10) {
      const d = new Date();
      d.setDate(today.getDate() + daysAhead);

      // Skip Sunday (0)
      if (d.getDay() !== 0) {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        const dateStr = `${year}-${month}-${day}`;

        const dayName = d.toLocaleDateString("es-CO", { weekday: "short" });
        const label = d.toLocaleDateString("es-CO", { day: "numeric", month: "short" });

        dates.push({
          dateStr,
          label,
          dayName: dayName.toUpperCase(),
          isToday: daysAhead === 0,
        });
        count++;
      }
      daysAhead++;
    }

    return dates;
  }, []);

  // Pre-select first date
  useEffect(() => {
    if (!selectedDate && availableDates.length > 0) {
      setSelectedDate(availableDates[0].dateStr);
    }
  }, [availableDates, selectedDate]);

  // Load saved user data from Firestore when step 4 is reached
  useEffect(() => {
    if (step === 4 && !savedDataLoaded) {
      setSavedDataLoaded(true);
      if (!user) return;
      getUserContactProfile(user.uid)
        .then((profile) => {
          if (!profile) return;
          if (profile.documentType) setDocumentType(profile.documentType as import("@/src/types/appointment").DocumentType);
          if (profile.documentNumber) setDocumentNumber(profile.documentNumber);
          if (profile.clientName) setClientName(profile.clientName);
          if (profile.phone) setPhone(profile.phone);
          if (profile.email) setEmail(profile.email);
          setShowSavedBanner(true);
        })
        .catch((err) => console.error("Error loading user profile:", err));
    }
  }, [step, savedDataLoaded, user]);

  // Save user data to Firestore after successful appointment
  const saveUserData = useCallback(() => {
    if (!user) return;
    saveUserContactProfile(user.uid, {
      documentType,
      documentNumber,
      clientName,
      phone,
      email,
    }).catch((err) => console.error("Error saving user profile:", err));
  }, [user, documentType, documentNumber, clientName, phone, email]);

  // Load branches dynamically from Firestore / Admin
  useEffect(() => {
    const unsub = subscribeActiveBranches((activeBranches) => {
      if (activeBranches && activeBranches.length > 0) {
        setBranches(activeBranches);
        setBranch((prev) => {
          const exists = activeBranches.some((b) => b.name === prev);
          return exists ? prev : activeBranches[0].name;
        });
      }
    });
    return () => {
      if (typeof unsub === "function") unsub();
    };
  }, []);

  // Query occupied time slots when date, modality, or branch changes
  useEffect(() => {
    if (!selectedDate) return;

    let isMounted = true;
    getOccupiedTimeSlots(selectedDate, modality, modality === "presencial" ? branch : undefined)
      .then((slots) => {
        if (isMounted) {
          setOccupiedSlots(slots);
          // If the currently selected time slot is now occupied, reset it
          if (slots.includes(selectedTimeSlot)) {
            setSelectedTimeSlot("");
          }
        }
      })
      .catch((err) => console.error("Error loading slots:", err));

    return () => {
      isMounted = false;
    };
  }, [selectedDate, modality, branch, selectedTimeSlot]);

  // Submit appointment
  const handleConfirmAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await createAppointment({
        clientName,
        documentType,
        documentNumber,
        phone,
        email,
        modality,
        branch: modality === "presencial" ? branch : "Videollamada en Línea",
        vertical: selectedService.vertical,
        serviceName: selectedService.title,
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        notes,
        code: "",
      });

      // Save user data for next time
      saveUserData();

      setCreatedCode(result.code);
      if (result.meetUrl) {
        setCreatedMeetUrl(result.meetUrl);
      }
      setStep(5); // Success confirmation step
    } catch (error) {
      console.error("Error creating appointment:", error);
      alert("Hubo un problema al registrar la cita. Por favor intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = () => {
    if (!createdCode) return;
    navigator.clipboard.writeText(createdCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleCopyMeetUrl = () => {
    if (!createdMeetUrl) return;
    navigator.clipboard.writeText(createdMeetUrl);
    setCopiedMeetUrl(true);
    setTimeout(() => setCopiedMeetUrl(false), 2500);
  };

  const resetForm = () => {
    setStep(1);
    setSelectedTimeSlot("");
    setDocumentNumber("");
    setClientName("");
    setPhone("");
    setEmail("");
    setNotes("");
    setCreatedCode("");
    setCreatedMeetUrl("");
    setCopiedMeetUrl(false);
    setSavedDataLoaded(false);
    setShowSavedBanner(false);
  };

  const clearSavedData = () => {
    if (user) {
      saveUserContactProfile(user.uid, {
        documentType: "CC",
        documentNumber: "",
        clientName: "",
        phone: "",
        email: "",
      }).catch(() => { });
    }
    setDocumentType("CC");
    setDocumentNumber("");
    setClientName("");
    setPhone("");
    setEmail("");
    setShowSavedBanner(false);
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl shadow-xl overflow-hidden">
      {/* Top EPS-style Portal Bar */}
      <div className="bg-slate-900 text-white px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400">
            <CalendarCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Portal de Asignación de Citas
            </h3>
            <p className="text-xs text-slate-400 font-normal">
              Atención Presencial en Sedes y Virtual por Videollamada
            </p>
          </div>
        </div>

        {/* Step Indicators */}
        {step < 5 && (
          <div className="flex items-center gap-2 text-xs font-semibold">
            {[
              { num: 1, label: "Modalidad" },
              { num: 2, label: "Especialidad" },
              { num: 3, label: "Fecha y Turno" },
              { num: 4, label: "Datos" },
            ].map((s) => (
              <div
                key={s.num}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs transition-colors ${step === s.num
                    ? "bg-blue-600 text-white font-bold"
                    : step > s.num
                      ? "bg-emerald-950/70 border border-emerald-500/40 text-emerald-300"
                      : "bg-slate-800 text-slate-400"
                  }`}
              >
                <span>{step > s.num ? "✓" : s.num}</span>
                <span className="hidden sm:inline">{s.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-6 sm:p-10">
        {/* ================= STEP 1: MODALIDAD Y SEDE ================= */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center max-w-xl mx-auto space-y-2 mb-8">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Paso 1 de 4
              </span>
              <h4 className="text-2xl font-extrabold text-slate-900">
                ¿Cómo prefieres recibir tu atención?
              </h4>
              <p className="text-xs sm:text-sm text-slate-600">
                Elige la modalidad que mejor se acomode a tu horario y ubicación.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl mx-auto">
              {/* Virtual Option */}
              <button
                type="button"
                onClick={() => setModality("virtual")}
                className={`p-6 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${modality === "virtual"
                    ? "border-blue-600 bg-blue-50/50 shadow-md ring-2 ring-blue-600/20"
                    : "border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50"
                  }`}
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-blue-100/70 text-blue-700 flex items-center justify-center mb-4">
                    <Video className="w-6 h-6" />
                  </div>
                  <h5 className="text-lg font-bold text-slate-900 mb-1">
                    Cita Virtual
                  </h5>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    Atención personalizada en vivo por videollamada desde tu celular o computadora. Sin filas ni desplazamientos.
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-700">
                  <span>✓ Enlace directo a Google Meet</span>
                </div>
              </button>

              {/* Presencial Option */}
              <button
                type="button"
                onClick={() => setModality("presencial")}
                className={`p-6 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${modality === "presencial"
                    ? "border-blue-600 bg-blue-50/50 shadow-md ring-2 ring-blue-600/20"
                    : "border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50"
                  }`}
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100/70 text-emerald-700 flex items-center justify-center mb-4">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <h5 className="text-lg font-bold text-slate-900 mb-1">
                    Cita Presencial
                  </h5>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    Visítanos en nuestras oficinas ejecutivas para recibir asesoría cara a cara y revisión física de documentos.
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                  <span>✓ Oficinas en Bogotá, Medellín y Cali</span>
                </div>
              </button>
            </div>

            {/* Sede selector if presencial */}
            {modality === "presencial" && (
              <div className="max-w-2xl mx-auto pt-4 space-y-3">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Selecciona la Sede de Atención:
                </label>
                <div className="space-y-3">
                  {branches.map((off) => (
                    <div
                      key={off.id}
                      onClick={() => setBranch(off.name)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${branch === off.name
                          ? "border-blue-600 bg-blue-50/40 shadow-xs"
                          : "border-slate-200 hover:border-slate-300 bg-white"
                        }`}
                    >
                      <MapPin className={`w-5 h-5 shrink-0 mt-0.5 ${branch === off.name ? "text-blue-600" : "text-slate-400"}`} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h6 className="text-sm font-bold text-slate-900">{off.name}</h6>
                          <span className="text-[11px] font-semibold text-slate-500">{off.city}</span>
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5">{off.address}</p>
                        <p className="text-[11px] text-slate-400 mt-1">Horario: {off.schedule}</p>
                        {off.phone && (
                          <p className="text-[11px] text-slate-500 mt-0.5">📞 Contacto: {off.phone}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end max-w-2xl mx-auto pt-6 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-6 py-3 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-600/20 flex items-center gap-2 transition-all"
              >
                <span>Continuar a Especialidad</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 2: ESPECIALIDAD / VERTICAL ================= */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center max-w-xl mx-auto space-y-2 mb-8">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Paso 2 de 4
              </span>
              <h4 className="text-2xl font-extrabold text-slate-900">
                Selecciona el Motivo o Especialidad
              </h4>
              <p className="text-xs sm:text-sm text-slate-600">
                Te asignaremos a un asesor especializado en la vertical correspondiente.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
              {APPOINTMENT_SERVICES.map((srv) => {
                const isSelected = selectedService.vertical === srv.vertical;

                const getIcon = () => {
                  switch (srv.icon) {
                    case "Coins": return <Coins className="w-5 h-5 text-emerald-600" />;
                    case "TrendingUp": return <TrendingUp className="w-5 h-5 text-indigo-600" />;
                    case "ShieldCheck": return <ShieldCheck className="w-5 h-5 text-sky-600" />;
                    case "Dumbbell": return <Dumbbell className="w-5 h-5 text-amber-600" />;
                    default: return <Building2 className="w-5 h-5 text-blue-600" />;
                  }
                };

                return (
                  <div
                    key={srv.vertical}
                    onClick={() => setSelectedService(srv)}
                    className={`p-5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${isSelected
                        ? "border-blue-600 bg-blue-50/50 shadow-md ring-2 ring-blue-600/20"
                        : "border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50"
                      }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                          {getIcon()}
                        </div>
                        <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                          {srv.estimatedDuration}
                        </span>
                      </div>
                      <h5 className="text-sm font-extrabold text-slate-900 mb-1">
                        {srv.title}
                      </h5>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {srv.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100/80 flex items-center justify-between text-xs font-semibold text-blue-600">
                      <span>{isSelected ? "Seleccionado ✓" : "Hacer clic para elegir"}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between max-w-3xl mx-auto pt-6 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Volver</span>
              </button>

              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-6 py-3 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-600/20 flex items-center gap-2 transition-all"
              >
                <span>Elegir Fecha y Turno</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 3: FECHA Y TURNO HORARIO (ESTILO EPS) ================= */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="text-center max-w-xl mx-auto space-y-2 mb-8">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Paso 3 de 4
              </span>
              <h4 className="text-2xl font-extrabold text-slate-900">
                Disponibilidad de Fechas y Turnos
              </h4>
              <p className="text-xs sm:text-sm text-slate-600">
                Elige el día y el horario libre que mejor se ajuste a tu tiempo.
              </p>
            </div>

            <div className="max-w-3xl mx-auto space-y-6">
              {/* Date Slider / Days Grid */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                  1. Selecciona la Fecha:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  {availableDates.map((item) => {
                    const isSelected = selectedDate === item.dateStr;
                    return (
                      <button
                        key={item.dateStr}
                        type="button"
                        onClick={() => setSelectedDate(item.dateStr)}
                        className={`p-3 rounded-xl border text-center transition-all ${isSelected
                            ? "border-blue-600 bg-blue-600 text-white shadow-md font-bold"
                            : "border-slate-200 hover:border-slate-300 bg-white text-slate-700"
                          }`}
                      >
                        <span className={`block text-[10px] font-bold tracking-wider ${isSelected ? "text-blue-100" : "text-slate-400"}`}>
                          {item.dayName}
                        </span>
                        <span className="block text-sm font-black mt-0.5">
                          {item.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time Slots Grid */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    2. Turnos Disponibles para {selectedDate}:
                  </label>
                  <span className="text-[11px] text-slate-500 font-medium">
                    Horario Colombia (GMT-5)
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {AVAILABLE_TIME_SLOTS.map((slot) => {
                    const isOccupied = occupiedSlots.includes(slot);
                    const isSelected = selectedTimeSlot === slot;

                    return (
                      <button
                        key={slot}
                        type="button"
                        disabled={isOccupied}
                        onClick={() => setSelectedTimeSlot(slot)}
                        className={`py-3 px-4 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${isOccupied
                            ? "border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed line-through"
                            : isSelected
                              ? "border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-600 shadow-xs"
                              : "border-slate-200 hover:border-blue-400 bg-white text-slate-800"
                          }`}
                      >
                        <Clock className="w-3.5 h-3.5" />
                        <span>{slot}</span>
                        {isOccupied && <span className="text-[10px] font-normal no-underline">(Ocupado)</span>}
                      </button>
                    );
                  })}
                </div>

                {occupiedSlots.length > 0 && (
                  <p className="text-[11px] text-slate-500 mt-3 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                    <span>Los turnos tachados ya fueron asignados previamente para esta fecha.</span>
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between max-w-3xl mx-auto pt-6 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Volver</span>
              </button>

              <button
                type="button"
                disabled={!selectedTimeSlot}
                onClick={() => setStep(4)}
                className="px-6 py-3 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-600/20 flex items-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span>Continuar con mis Datos</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 4: DATOS DEL SOLICITANTE ================= */}
        {step === 4 && (
          <form onSubmit={handleConfirmAppointment} className="space-y-6">
            <div className="text-center max-w-xl mx-auto space-y-2 mb-8">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Paso 4 de 4
              </span>
              <h4 className="text-2xl font-extrabold text-slate-900">
                Datos de Identificación del Paciente / Cliente
              </h4>
              <p className="text-xs sm:text-sm text-slate-600">
                Ingresa tus datos para registrar la cita formalmente en el sistema.
              </p>
            </div>

            {/* Saved Data Banner */}
            {showSavedBanner && (
              <div className="max-w-2xl mx-auto flex items-start justify-between gap-3 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs">
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-emerald-800 text-sm">¡Tus datos fueron recuperados automáticamente!</p>
                    <p className="text-emerald-700 mt-0.5">Encontramos tu información de la última cita. Verifica que sean correctos o edítalos si cambiaron.</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={clearSavedData}
                    className="text-emerald-700 hover:text-red-600 transition-colors px-2 py-1 rounded-lg hover:bg-red-50 text-[11px] font-semibold whitespace-nowrap"
                  >
                    Borrar datos
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowSavedBanner(false)}
                    className="text-emerald-500 hover:text-emerald-700 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Appointment Summary Capsule */}
            <div className="max-w-2xl mx-auto p-4 rounded-2xl bg-blue-50/60 border border-blue-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-blue-600" />
                <span className="font-bold text-slate-900">
                  {selectedDate} a las {selectedTimeSlot}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {modality === "virtual" ? (
                  <span className="inline-flex items-center gap-1 font-semibold text-blue-700">
                    <Video className="w-3.5 h-3.5" />
                    Cita Virtual
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                    <MapPin className="w-3.5 h-3.5" />
                    {branch}
                  </span>
                )}
              </div>
            </div>

            <div className="max-w-2xl mx-auto space-y-4">
              {/* Document Type & Number */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Tipo de Doc. *
                  </label>
                  <select
                    value={documentType}
                    onChange={(e) => setDocumentType(e.target.value as DocumentType)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-xs sm:text-sm text-slate-900 font-semibold focus:outline-none focus:border-blue-600"
                  >
                    <option value="CC">C.C. Cédula</option>
                    <option value="CE">C.E. Extranjería</option>
                    <option value="NIT">NIT Empresa</option>
                    <option value="PASAPORTE">Pasaporte</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Número de Documento *
                  </label>
                  <div className="relative">
                    <FileText className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      required
                      placeholder="Ej. 1020304050"
                      value={documentNumber}
                      onChange={(e) => setDocumentNumber(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-blue-600"
                    />
                  </div>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Nombres y Apellidos Completos *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    placeholder="Ej. Andrés Felipe Restrepo Gómez"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              {/* Phone and Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Teléfono Móvil (WhatsApp) *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="tel"
                      required
                      placeholder="Ej. 300 123 4567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-blue-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Correo Electrónico *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      required
                      placeholder="andres@ejemplo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-blue-600"
                    />
                  </div>
                </div>
              </div>

              {/* Notes / Special Request */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Motivo Específico o Notas (Opcional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Detalles sobre lo que deseas consultar..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>

            <div className="flex items-center justify-between max-w-2xl mx-auto pt-6 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Volver</span>
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-600/20 flex items-center gap-2 transition-all disabled:opacity-50"
              >
                {loading ? (
                  <span>Registrando Cita...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirmar y Agendar Cita</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* ================= STEP 5: COMPROBANTE OFICIAL DE CITA (ESTILO EPS) ================= */}
        {step === 5 && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3 shadow-xs">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs font-bold text-amber-800">
                Estado: Pendiente de Confirmación
              </span>
              <h4 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                ¡Tu Cita ha sido Agendada con Éxito!
              </h4>
              <p className="text-xs sm:text-sm text-slate-600">
                Hemos registrado tu solicitud en el sistema de asignación de turnos. Un asesor revisará y aceptará la cita a la brevedad.
              </p>
            </div>

            {/* Voucher Card */}
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-5 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200/80">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Código Único de Cita
                  </span>
                  <span className="text-xl font-black text-blue-700 font-mono">
                    {createdCode}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  {copiedCode ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600">Copiado</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                      <span>Copiar</span>
                    </>
                  )}
                </button>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 font-medium block">Paciente / Solicitante</span>
                  <span className="font-bold text-slate-900 block text-sm">{clientName}</span>
                  <span className="text-slate-500 block">{documentType}: {documentNumber}</span>
                </div>

                <div>
                  <span className="text-slate-400 font-medium block">Fecha y Turno</span>
                  <span className="font-bold text-slate-900 block text-sm">{selectedDate}</span>
                  <span className="text-blue-700 font-bold block">{selectedTimeSlot}</span>
                </div>

                <div>
                  <span className="text-slate-400 font-medium block">Especialidad</span>
                  <span className="font-bold text-slate-900 block">{selectedService.title}</span>
                </div>

                <div>
                  <span className="text-slate-400 font-medium block">Modalidad & Ubicación</span>
                  {modality === "virtual" ? (
                    <div>
                      <span className="font-bold text-blue-700 block">
                        Cita Virtual en Google Meet
                      </span>
                      {createdMeetUrl && (
                        <a
                          href={createdMeetUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline font-mono inline-flex items-center gap-1 mt-0.5"
                        >
                          <span>{createdMeetUrl}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  ) : (
                    <span className="font-bold text-emerald-800 block">
                      Presencial en {branch}
                    </span>
                  )}
                </div>
              </div>

              {/* ================= GOOGLE MEET CARD FOR VIRTUAL APPOINTMENTS ================= */}
              {modality === "virtual" && createdMeetUrl && (
                <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50 to-sky-50 border border-blue-200 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                        <Video className="w-5 h-5" />
                      </div>
                      <div>
                        <h6 className="text-xs font-bold text-slate-900">
                          Reunión en Google Meet Generada con Éxito
                        </h6>
                        <p className="text-[11px] text-slate-500">
                          Sala de videollamada asignada exclusivamente para tu cita
                        </p>
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 border border-blue-200">
                      Enlace Activo
                    </span>
                  </div>

                  <div className="flex items-center justify-between bg-white px-3 py-2 rounded-xl border border-blue-100">
                    <span className="font-mono text-xs text-blue-700 font-bold truncate max-w-[280px]">
                      {createdMeetUrl}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyMeetUrl}
                      className="px-2.5 py-1 rounded-md text-[11px] font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-1 border border-slate-200 transition-colors"
                    >
                      {copiedMeetUrl ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-600">Copiado</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-slate-500" />
                          <span>Copiar</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    <a
                      href={createdMeetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 min-w-[170px] px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-sm shadow-blue-600/20"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Unirse a Google Meet</span>
                      <ExternalLink className="w-3 h-3 ml-auto" />
                    </a>

                    <a
                      href={generateGoogleCalendarUrl({
                        serviceName: selectedService.title,
                        date: selectedDate,
                        timeSlot: selectedTimeSlot,
                        modality,
                        branch,
                        meetUrl: createdMeetUrl,
                        code: createdCode,
                        clientName,
                      })}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 transition-colors flex items-center gap-1.5 shadow-xs"
                    >
                      <CalendarPlus className="w-3.5 h-3.5 text-blue-600" />
                      <span>Añadir a Google Calendar</span>
                    </a>
                  </div>
                </div>
              )}

              {/* ================= CREDIT ONBOARDING & NEXT STEPS ================= */}
              <div className="mt-4 p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 text-white space-y-3 shadow-md">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30">
                    NEXT CONNECTION GROUP SAS
                  </span>
                  <span className="text-xs font-bold text-slate-300">
                    Trámite y Estudio de Crédito
                  </span>
                </div>

                <h6 className="text-sm font-black text-white">
                  ¿Deseas iniciar de inmediato la radicación de tu crédito?
                </h6>

                <p className="text-xs text-slate-300 leading-relaxed">
                  Para tener la trazabilidad completa, formalizar el <strong>Contrato de Prestación de Servicios</strong> y cargar los documentos requeridos (Empresa y Avalista &gt;50%), puedes ingresar directamente a tu portal de crédito.
                </p>

                <div className="pt-1 flex flex-wrap items-center gap-3">
                  <Link
                    href="/portal/credito"
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-sm flex items-center gap-1.5"
                  >
                    <span>Ir al Portal de Crédito &amp; Documentos</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <span className="text-[11px] text-slate-400">
                    Estudio de Crédito: $250.000 COP • Cta Cte 29899994884 Bancolombia
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200/80 text-[11px] text-slate-500 leading-relaxed">
                ℹ️ <strong>Importante:</strong> Puedes consultar el estado de tu cita comunicándote a nuestra línea de WhatsApp con el código <strong>{createdCode}</strong>.
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-3 rounded-xl font-bold text-xs sm:text-sm text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Agendar Otra Cita
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-6 py-3 rounded-xl font-bold text-xs sm:text-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-md shadow-blue-600/20"
              >
                Imprimir Comprobante
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}