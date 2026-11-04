"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar as CalendarIcon,
  Clock,
  Video,
  Building2,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Coins,
  TrendingUp,
  ShieldCheck,
  Dumbbell,
  Layers,
  Phone,
  Mail,
  User,
  Copy,
  Check,
  ExternalLink,
  CalendarPlus,
  RefreshCw,
  Download,
  CheckCircle,
} from "lucide-react";
import {
  createAppointment,
  generateGoogleMeetUrl,
  generateGoogleCalendarUrl,
  generateAppointmentCode,
} from "@/src/services/firebase/appointmentService";
import { db } from "@/src/firebase/config";
import { doc, onSnapshot, collection, query, where } from "firebase/firestore";
import { BRANCH_OFFICES } from "@/src/types/appointment";
import { useAuth } from "@/src/context/AuthContext";

const SPECIALTIES = [
  {
    id: "credito",
    name: "Crédito & Financiación",
    shortName: "Crédito",
    description: "Tasas preferenciales y libre inversión",
    duration: "30 min",
    icon: Coins,
    color: "emerald",
    activeClass: "border-emerald-600 bg-emerald-50/70 text-emerald-950 ring-1 ring-emerald-600",
    iconColor: "text-emerald-700 bg-emerald-100/80",
    badge: "Desde 1.2% M.V.",
  },
  {
    id: "inversiones",
    name: "Inversiones & Rentabilidad",
    shortName: "Inversiones",
    description: "Portafolios de alta rentabilidad",
    duration: "45 min",
    icon: TrendingUp,
    color: "indigo",
    activeClass: "border-indigo-600 bg-indigo-50/70 text-indigo-950 ring-1 ring-indigo-600",
    iconColor: "text-indigo-700 bg-indigo-100/80",
    badge: "Hasta 17.8% E.A.",
  },
  {
    id: "seguros",
    name: "Seguros & Coberturas 360°",
    shortName: "Seguros",
    description: "Salud, vida, vehículos y empresas",
    duration: "30 min",
    icon: ShieldCheck,
    color: "sky",
    activeClass: "border-sky-600 bg-sky-50/70 text-sky-950 ring-1 ring-sky-600",
    iconColor: "text-sky-700 bg-sky-100/80",
    badge: "Protección 24/7",
  },
  {
    id: "fit",
    name: "Nutrición & Productos Fit",
    shortName: "Nutrición Fit",
    description: "Proteínas y asesoría deportiva",
    duration: "20 min",
    icon: Dumbbell,
    color: "amber",
    activeClass: "border-amber-600 bg-amber-50/70 text-amber-950 ring-1 ring-amber-600",
    iconColor: "text-amber-700 bg-amber-100/80",
    badge: "Certificado",
  },
  {
    id: "ecosistema",
    name: "Asesoría Integral Grupo Next",
    shortName: "Integral",
    description: "Orientación personalizada global",
    duration: "30 min",
    icon: Layers,
    color: "teal",
    activeClass: "border-teal-600 bg-teal-50/70 text-teal-950 ring-1 ring-teal-600",
    iconColor: "text-teal-700 bg-teal-100/80",
    badge: "Ecosistema",
  },
];

export default function InteractiveAppointmentCenter() {
  const { user } = useAuth();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Selections
  const [selectedSpecialty, setSelectedSpecialty] = useState(SPECIALTIES[0]);
  const [modality, setModality] = useState<"virtual" | "presencial">("virtual");
  const [selectedBranch, setSelectedBranch] = useState(BRANCH_OFFICES[0].name);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  // Customer Contact Fields
  const [clientName, setClientName] = useState(user?.displayName || "");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState(user?.email || "");
  const [notes, setNotes] = useState("");

  // Submission Status
  const [loading, setLoading] = useState(false);
  const [confirmedAppt, setConfirmedAppt] = useState<any>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Dynamic Agenda Config from Firestore
  const [agendaConfig, setAgendaConfig] = useState({
    startHour: "08:00",
    endHour: "18:00",
    slotDuration: 30,
    allowWeekdays: true,
    allowSaturdays: false,
    allowSundays: false,
  });

  // Real-time occupied slots for selectedDate (status !== "cancelada")
  const [occupiedSlots, setOccupiedSlots] = useState<Set<string>>(new Set());

  // Subscribe to config_general/agenda_config in real time
  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, "config_general", "agenda_config"),
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setAgendaConfig({
            startHour: data.startHour || "08:00",
            endHour: data.endHour || "18:00",
            slotDuration: data.slotDuration || 30,
            allowWeekdays: data.allowWeekdays !== false,
            allowSaturdays: Boolean(data.allowSaturdays),
            allowSundays: Boolean(data.allowSundays),
          });
        }
      },
      (err) => {
        console.error("Error subscribing to agenda_config:", err);
      }
    );
    return () => unsub();
  }, []);

  // Listen to ?specialty= URL parameter & custom window event
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const specParam = params.get("specialty");
      if (specParam) {
        const found = SPECIALTIES.find((s) => s.id === specParam);
        if (found) setSelectedSpecialty(found);
      }
    }

    const handleSetSpecialty = (e: any) => {
      const specKey = e.detail?.specialty;
      if (specKey) {
        const found = SPECIALTIES.find((s) => s.id === specKey);
        if (found) {
          setSelectedSpecialty(found);
          setStep(2); // Ir directo a elegir fecha y hora
          const el = document.getElementById("agendar-cita");
          if (el) {
            el.scrollIntoView({ behavior: "smooth" });
          }
        }
      }
    };

    window.addEventListener("set-appointment-specialty", handleSetSpecialty);
    return () => window.removeEventListener("set-appointment-specialty", handleSetSpecialty);
  }, []);

  // Real-time listener for occupied slots on selectedDate
  useEffect(() => {
    if (!selectedDate) return;

    const q = query(
      collection(db, "citas"),
      where("date", "==", selectedDate)
    );

    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const busy = new Set<string>();
        snapshot.forEach((dSnap) => {
          const data = dSnap.data();
          if (data.status !== "cancelada" && data.timeSlot) {
            busy.add(data.timeSlot.trim().toUpperCase());
          }
        });
        setOccupiedSlots(busy);
      },
      (err) => {
        console.error("Error subscribing to occupied citas on date:", err);
      }
    );

    return () => unsub();
  }, [selectedDate]);

  // Generate next 14 available days based on agendaConfig
  const availableDates = useMemo(() => {
    const dates: {
      dateStr: string;
      dayOfWeek: string;
      dayNumber: string;
      monthName: string;
      isToday: boolean;
    }[] = [];
    const today = new Date();

    let count = 0;
    let daysAhead = 0;

    const daysMap = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
    const monthsMap = [
      "Ene", "Feb", "Mar", "Abr", "May", "Jun",
      "Jul", "Ago", "Sep", "Oct", "Nov", "Dic",
    ];

    while (count < 14 && daysAhead < 60) {
      const d = new Date();
      d.setDate(today.getDate() + daysAhead);

      const dayOfWeek = d.getDay();
      const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5;
      const isSaturday = dayOfWeek === 6;
      const isSunday = dayOfWeek === 0;

      const isAllowed =
        (isWeekday && agendaConfig.allowWeekdays) ||
        (isSaturday && agendaConfig.allowSaturdays) ||
        (isSunday && agendaConfig.allowSundays);

      if (isAllowed) {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        const dateStr = `${year}-${month}-${day}`;

        dates.push({
          dateStr,
          dayOfWeek: daysMap[d.getDay()],
          dayNumber: String(d.getDate()),
          monthName: monthsMap[d.getMonth()],
          isToday: daysAhead === 0,
        });
        count++;
      }
      daysAhead++;
    }

    return dates;
  }, [agendaConfig.allowWeekdays, agendaConfig.allowSaturdays, agendaConfig.allowSundays]);

  // Pre-select first date when availableDates updates
  useEffect(() => {
    if ((!selectedDate || !availableDates.some((d) => d.dateStr === selectedDate)) && availableDates.length > 0) {
      setSelectedDate(availableDates[0].dateStr);
    }
  }, [availableDates, selectedDate]);

  // Dynamic time slots generation based on agendaConfig
  const { morningSlots, afternoonSlots } = useMemo(() => {
    const morning: string[] = [];
    const afternoon: string[] = [];

    const startH = parseInt(agendaConfig.startHour.split(":")[0]) || 8;
    const startM = parseInt(agendaConfig.startHour.split(":")[1]) || 0;
    const endH = parseInt(agendaConfig.endHour.split(":")[0]) || 18;
    const endM = parseInt(agendaConfig.endHour.split(":")[1]) || 0;
    const step = agendaConfig.slotDuration || 30;

    let currentMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;

    while (currentMinutes < endMinutes) {
      const h = Math.floor(currentMinutes / 60);
      const m = currentMinutes % 60;

      const period = h >= 12 ? "PM" : "AM";
      const displayH = h % 12 === 0 ? 12 : h % 12;
      const displayM = String(m).padStart(2, "0");
      const timeStr = `${String(displayH).padStart(2, "0")}:${displayM} ${period}`;

      if (h < 12) {
        morning.push(timeStr);
      } else {
        afternoon.push(timeStr);
      }

      currentMinutes += step;
    }

    return { morningSlots: morning, afternoonSlots: afternoon };
  }, [agendaConfig.startHour, agendaConfig.endHour, agendaConfig.slotDuration]);

  // If currently selected time becomes occupied on this date, reset selection
  useEffect(() => {
    if (selectedTime && occupiedSlots.has(selectedTime.trim().toUpperCase())) {
      setSelectedTime("");
    }
  }, [occupiedSlots, selectedTime]);

  // Handle Booking
  const handleConfirmAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !phone || !email || !selectedDate || !selectedTime) {
      alert("Por favor completa los datos obligatorios.");
      return;
    }

    setLoading(true);

    try {
      const code = generateAppointmentCode();
      const fallbackMeet = generateGoogleMeetUrl();
      let finalMeetUrl = fallbackMeet.meetUrl;
      let finalMeetCode = fallbackMeet.meetCode;
      let isSyncedToCalendar = false;
      let emailSent = false;
      let calendarEventId = "";

      // Intentar crear evento con la API de Google Calendar
      try {
        const apiRes = await fetch("/api/citas/create-event", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            clientName: clientName.trim(),
            email: email.trim(),
            phone: phone.trim(),
            serviceName: selectedSpecialty.name,
            date: selectedDate,
            timeSlot: selectedTime,
            notes: notes.trim(),
            meetUrl: fallbackMeet.meetUrl,
            code,
          }),
        });

        if (apiRes.ok) {
          const apiData = await apiRes.json();
          if (apiData.configured && apiData.success) {
            isSyncedToCalendar = true;
            if (apiData.eventId) calendarEventId = apiData.eventId;
            if (apiData.emailSent) emailSent = true;
            if (apiData.meetUrl) {
              finalMeetUrl = apiData.meetUrl;
              finalMeetCode = apiData.meetUrl.replace("https://meet.google.com/", "");
            }
          }
        }
      } catch (apiErr) {
        console.warn("[Google Calendar Sync] Usando fallback:", apiErr);
      }

      const newAppointment = {
        code,
        clientName: clientName.trim(),
        documentType: "CC" as const,
        documentNumber: "No requerida",
        phone: phone.trim(),
        email: email.trim(),
        modality,
        branch: modality === "presencial" ? selectedBranch : "",
        meetUrl: modality === "virtual" ? finalMeetUrl : "",
        meetCode: modality === "virtual" ? finalMeetCode : "",
        vertical: selectedSpecialty.id as any,
        serviceName: selectedSpecialty.name,
        date: selectedDate,
        timeSlot: selectedTime,
        notes: notes.trim(),
        calendarEventId: calendarEventId || "",
        status: "pendiente" as const,
      };

      // Guardar en Firestore
      await createAppointment(newAppointment);

      // Enlace para Google Calendar
      const googleCalendarUrl = generateGoogleCalendarUrl({
        serviceName: selectedSpecialty.name,
        date: selectedDate,
        timeSlot: selectedTime,
        modality,
        branch: selectedBranch,
        meetUrl: finalMeetUrl,
        code,
        clientName,
      });

      setConfirmedAppt({
        ...newAppointment,
        googleCalendarUrl,
        isSyncedToCalendar,
        emailSent,
      });

      if (!emailSent && googleCalendarUrl) {
        window.open(googleCalendarUrl, "_blank");
      }

      setStep(4);
    } catch (err) {
      console.error("Error creating appointment:", err);
      alert("Hubo un error al registrar tu cita. Por favor intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleDownloadICS = () => {
    if (!confirmedAppt) return;
    const { serviceName, date, timeSlot, meetUrl, code } = confirmedAppt;

    let hour = 9;
    let min = 0;
    const match = timeSlot.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (match) {
      let h = parseInt(match[1], 10);
      const m = parseInt(match[2], 10);
      if (match[3].toUpperCase() === "PM" && h < 12) h += 12;
      if (match[3].toUpperCase() === "AM" && h === 12) h = 0;
      hour = h;
      min = m;
    }

    const cleanDate = date.replace(/-/g, "");
    const pad = (n: number) => String(n).padStart(2, "0");
    const startStr = `${cleanDate}T${pad(hour)}${pad(min)}00`;
    const endStr = `${cleanDate}T${pad(hour + 1)}${pad(min)}00`;

    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Next Connection Group//Citas//ES",
      "BEGIN:VEVENT",
      `UID:${code}@gruponext.com`,
      `DTSTAMP:${cleanDate}T000000Z`,
      `DTSTART:${startStr}`,
      `DTEND:${endStr}`,
      `SUMMARY:Asesoría: ${serviceName} - Next Connection Group`,
      `DESCRIPTION:Cita confirmada (Radicado: ${code}). Videollamada Google Meet: ${meetUrl || "Atención presencial"}`,
      `LOCATION:${meetUrl || "Sede Corporativa"}`,
      "STATUS:CONFIRMED",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute("download", `Cita-${code}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id="agendar-cita" className="w-full max-w-3xl mx-auto scroll-mt-20">
      {/* Main Container: Compact, Clean & Sober */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        {/* Compact Stepper Header */}
        {step < 4 && (
          <div className="px-4 py-3 sm:px-6 sm:py-4 border-b border-slate-100 bg-slate-50/60">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-xs font-bold text-slate-900">Paso {step} de 3:</span>
                <span className="text-xs text-slate-500 font-medium">
                  {step === 1 && "Servicio y modalidad"}
                  {step === 2 && "Fecha y horario"}
                  {step === 3 && "Tus datos"}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3].map((s) => (
                  <button
                    key={s}
                    type="button"
                    disabled={s > step}
                    onClick={() => {
                      if (s === 1) setStep(1);
                      if (s === 2 && selectedSpecialty) setStep(2);
                      if (s === 3 && selectedDate && selectedTime) setStep(3);
                    }}
                    className={`h-1.5 rounded-full transition-all ${
                      s === step
                        ? "w-7 bg-slate-900"
                        : s < step
                        ? "w-3 bg-emerald-600 cursor-pointer"
                        : "w-3 bg-slate-200"
                    }`}
                    aria-label={`Ir al paso ${s}`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="p-4 sm:p-6 md:p-8">
          <AnimatePresence mode="wait">
            {/* ============================================================== */}
            {/* PASO 1: SELECCIONA SERVICIO Y MODALIDAD (COMPACTO) */}
            {/* ============================================================== */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-5"
              >
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    ¿Qué asesoría necesitas?
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Selecciona el área para asignarte un asesor experto.
                  </p>
                </div>

                {/* Compact Specialty Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {SPECIALTIES.map((spec) => {
                    const Icon = spec.icon;
                    const isSelected = selectedSpecialty.id === spec.id;

                    return (
                      <button
                        key={spec.id}
                        type="button"
                        onClick={() => setSelectedSpecialty(spec)}
                        className={`p-3 rounded-xl sm:rounded-2xl text-left border transition-all flex items-start gap-3 relative ${
                          isSelected
                            ? spec.activeClass
                            : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50"
                        }`}
                      >
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                            isSelected ? "bg-slate-900 text-white" : spec.iconColor
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>

                        <div className="flex-1 min-w-0 pr-4">
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                              {spec.name}
                            </h4>
                          </div>
                          <p className="text-[11px] text-slate-500 truncate mt-0.5">
                            {spec.description}
                          </p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-600 bg-white/80 px-1.5 py-0.5 rounded border border-slate-200/60">
                              <Clock className="w-3 h-3 text-slate-400" />
                              <span>{spec.duration}</span>
                            </span>
                            <span className="text-[10px] text-slate-500 font-medium">
                              {spec.badge}
                            </span>
                          </div>
                        </div>

                        {/* Radio Check Indicator */}
                        <div className="absolute top-3 right-3">
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                              isSelected
                                ? "border-slate-900 bg-slate-900 text-white"
                                : "border-slate-300 bg-white"
                            }`}
                          >
                            {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Modality Selector: Compact Segmented Switcher */}
                <div className="pt-3 border-t border-slate-100">
                  <label className="block text-xs font-bold text-slate-800 mb-2">
                    Modalidad de atención
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setModality("virtual")}
                      className={`p-2.5 sm:p-3 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
                        modality === "virtual"
                          ? "border-slate-900 bg-slate-900 text-white shadow-2xs font-bold"
                          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                      }`}
                    >
                      <Video className={`w-4 h-4 shrink-0 ${modality === "virtual" ? "text-sky-300" : "text-slate-500"}`} />
                      <div className="min-w-0">
                        <div className="text-xs font-bold truncate">Google Meet</div>
                        <div className={`text-[10px] truncate ${modality === "virtual" ? "text-slate-300" : "text-slate-500"}`}>
                          Videollamada virtual
                        </div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setModality("presencial")}
                      className={`p-2.5 sm:p-3 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
                        modality === "presencial"
                          ? "border-slate-900 bg-slate-900 text-white shadow-2xs font-bold"
                          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                      }`}
                    >
                      <Building2 className={`w-4 h-4 shrink-0 ${modality === "presencial" ? "text-amber-300" : "text-slate-500"}`} />
                      <div className="min-w-0">
                        <div className="text-xs font-bold truncate">En Sede</div>
                        <div className={`text-[10px] truncate ${modality === "presencial" ? "text-slate-300" : "text-slate-500"}`}>
                          Bogotá, Medellín o Cali
                        </div>
                      </div>
                    </button>
                  </div>

                  {modality === "presencial" && (
                    <div className="mt-2.5">
                      <select
                        value={selectedBranch}
                        onChange={(e) => setSelectedBranch(e.target.value)}
                        className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 focus:bg-white focus:outline-none"
                      >
                        {BRANCH_OFFICES.map((b) => (
                          <option key={b.id} value={b.name}>
                            {b.name} — {b.city} ({b.address})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {/* Continue CTA */}
                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-xs transition-all flex items-center justify-center gap-2"
                  >
                    <span>Elegir fecha y hora</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* ============================================================== */}
            {/* PASO 2: SELECCIONA FECHA Y HORA (COMPACTO) */}
            {/* ============================================================== */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    Elige el día y la hora
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Disponibilidad en tiempo real sincronizada.
                  </p>
                </div>

                {/* Horizontal Date Picker Chips */}
                <div>
                  <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-0.5 no-scrollbar">
                    {availableDates.map((item) => {
                      const isSelected = selectedDate === item.dateStr;

                      return (
                        <button
                          key={item.dateStr}
                          type="button"
                          onClick={() => setSelectedDate(item.dateStr)}
                          className={`p-2 rounded-xl min-w-[56px] sm:min-w-[64px] text-center border transition-all flex flex-col items-center justify-between shrink-0 ${
                            isSelected
                              ? "border-slate-900 bg-slate-900 text-white shadow-2xs font-bold"
                              : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                          }`}
                        >
                          <span
                            className={`text-[9px] font-bold uppercase tracking-wider ${
                              isSelected ? "text-slate-300" : "text-slate-500"
                            }`}
                          >
                            {item.isToday ? "Hoy" : item.dayOfWeek}
                          </span>

                          <span className="text-base sm:text-lg font-black tracking-tight leading-tight my-0.5">
                            {item.dayNumber}
                          </span>

                          <span
                            className={`text-[9px] font-semibold ${
                              isSelected ? "text-slate-300" : "text-slate-500"
                            }`}
                          >
                            {item.monthName}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Time Slots in Compact Pills */}
                <div className="space-y-3 pt-1">
                  {morningSlots.length > 0 && (
                    <div>
                      <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                        <span>Mañana</span>
                      </div>
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                        {morningSlots.map((time) => {
                          const isOccupied = occupiedSlots.has(time.trim().toUpperCase());
                          const isSelected = selectedTime === time;

                          if (isOccupied) {
                            return (
                              <div
                                key={time}
                                className="py-2 px-1.5 rounded-lg text-xs font-medium border border-slate-200 bg-slate-100 text-slate-400 text-center cursor-not-allowed line-through opacity-60"
                                title="Horario ocupado"
                              >
                                {time}
                              </div>
                            );
                          }

                          return (
                            <button
                              key={time}
                              type="button"
                              onClick={() => setSelectedTime(time)}
                              className={`py-2 px-1.5 rounded-lg text-xs font-bold border transition-all text-center ${
                                isSelected
                                  ? "bg-slate-900 text-white border-slate-900 shadow-2xs"
                                  : "bg-white text-slate-800 border-slate-200 hover:border-slate-400 hover:bg-slate-50"
                              }`}
                            >
                              {time}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {afternoonSlots.length > 0 && (
                    <div>
                      <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                        <span>Tarde</span>
                      </div>
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                        {afternoonSlots.map((time) => {
                          const isOccupied = occupiedSlots.has(time.trim().toUpperCase());
                          const isSelected = selectedTime === time;

                          if (isOccupied) {
                            return (
                              <div
                                key={time}
                                className="py-2 px-1.5 rounded-lg text-xs font-medium border border-slate-200 bg-slate-100 text-slate-400 text-center cursor-not-allowed line-through opacity-60"
                                title="Horario ocupado"
                              >
                                {time}
                              </div>
                            );
                          }

                          return (
                            <button
                              key={time}
                              type="button"
                              onClick={() => setSelectedTime(time)}
                              className={`py-2 px-1.5 rounded-lg text-xs font-bold border transition-all text-center ${
                                isSelected
                                  ? "bg-slate-900 text-white border-slate-900 shadow-2xs"
                                  : "bg-white text-slate-800 border-slate-200 hover:border-slate-400 hover:bg-slate-50"
                              }`}
                            >
                              {time}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Back and Continue Buttons */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Atrás</span>
                  </button>

                  <button
                    type="button"
                    disabled={!selectedDate || !selectedTime}
                    onClick={() => setStep(3)}
                    className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-xs transition-all flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <span>Continuar</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* ============================================================== */}
            {/* PASO 3: TUS DATOS (COMPACTO Y SIMPLE) */}
            {/* ============================================================== */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    Confirma tus datos de contacto
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Te enviaremos los detalles de la reunión a tu correo y celular.
                  </p>
                </div>

                {/* Mini Summary Strip */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{selectedSpecialty.name}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-600">{selectedDate} a las {selectedTime}</span>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {modality === "virtual" ? "Google Meet" : selectedBranch}
                  </span>
                </div>

                {/* Compact Form */}
                <form onSubmit={handleConfirmAppointment} className="space-y-3 pt-1">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nombre completo *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        required
                        placeholder="Tu nombre y apellido"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Teléfono / WhatsApp *
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type="tel"
                          required
                          placeholder="300 123 4567"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Correo electrónico *
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type="email"
                          required
                          placeholder="tu@correo.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nota o consulta breve (opcional)
                    </label>
                    <input
                      type="text"
                      placeholder="Ej. Requisitos para crédito hipotecario o póliza..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900"
                    />
                  </div>

                  {/* Submit and Back */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 flex items-center gap-1"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Cambiar horario</span>
                    </button>

                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-xs transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                      {loading ? (
                        <span>Agendando...</span>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 text-emerald-400" />
                          <span>Confirmar Cita</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* ============================================================== */}
            {/* PASO 4: CONFIRMACIÓN EXITOSA */}
            {/* ============================================================== */}
            {step === 4 && confirmedAppt && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-2 space-y-4"
              >
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-2xs">
                  <CheckCircle2 className="w-7 h-7" />
                </div>

                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                    ¡Cita confirmada con éxito!
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto">
                    {confirmedAppt.emailSent
                      ? `Enviamos la invitación a ${confirmedAppt.email}.`
                      : "Tu cita quedó registrada y lista para sincronizarse con tu calendario."}
                  </p>
                </div>

                {/* Ticket Details */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left space-y-2.5 text-xs">
                  <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                    <span className="text-slate-500 font-medium">Radicado:</span>
                    <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-300">
                      {confirmedAppt.code}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-slate-500 block text-[11px]">Asesoría:</span>
                      <span className="font-bold text-slate-900">{confirmedAppt.serviceName}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px]">Fecha y Hora:</span>
                      <span className="font-bold text-slate-900">
                        {confirmedAppt.date} — {confirmedAppt.timeSlot}
                      </span>
                    </div>
                  </div>

                  {confirmedAppt.meetUrl && (
                    <div className="pt-2 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <Video className="w-4 h-4 text-sky-600 shrink-0" />
                        <span className="text-xs text-slate-700 truncate font-mono">
                          {confirmedAppt.meetUrl}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => copyToClipboard(confirmedAppt.meetUrl)}
                          className="px-2.5 py-1 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-white flex items-center gap-1"
                        >
                          {copiedLink ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedLink ? "Copiado" : "Copiar"}</span>
                        </button>
                        <a
                          href={confirmedAppt.meetUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 rounded-lg bg-sky-600 text-white text-xs font-bold hover:bg-sky-700 flex items-center gap-1"
                        >
                          <span>Entrar</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                {/* Calendar CTA */}
                <div className="space-y-2 pt-1">
                  {confirmedAppt.googleCalendarUrl && (
                    <a
                      href={confirmedAppt.googleCalendarUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full p-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-2xs flex items-center justify-center gap-2 transition-all"
                    >
                      <CalendarPlus className="w-4 h-4" />
                      <span>Guardar en Google Calendar</span>
                    </a>
                  )}

                  <div className="flex items-center justify-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={handleDownloadICS}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 flex items-center gap-1"
                    >
                      <Download className="w-3.5 h-3.5 text-slate-500" />
                      <span>Descargar (.ics)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setStep(1);
                        setConfirmedAppt(null);
                      }}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3 text-slate-500" />
                      <span>Nueva cita</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
