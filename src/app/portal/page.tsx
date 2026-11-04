"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Coins,
  TrendingUp,
  ShieldCheck,
  Dumbbell,
  CalendarCheck,
  UserCheck,
  Sparkles,
  CheckCircle2,
  Clock,
  AlertCircle,
  ExternalLink,
  LogOut,
  Phone,
  MessageSquare,
  Copy,
  Check,
  FileText,
  Upload,
  ChevronRight,
  AlertTriangle,
  Gift,
  Award,
  ArrowRight,
  Video,
  Zap,
  Trash2,
  PenTool,
  Calendar,
  User,
  Shield,
  Layers,
} from "lucide-react";
import AutoFillModal from "@/src/components/credit/AutoFillModal";
import ContractViewerModal from "@/src/components/credit/ContractViewerModal";
import {
  subscribeClientAuth,
  logoutClient,
  subscribeUserCreditCase,
  uploadCreditDocumentFile,
  deleteCreditDocumentFile,
  uploadStudyPaymentReceipt,
  updateCreditCaseStatus,
} from "@/src/services/firebase/creditCasesService";
import { CreditCase, CreditCaseStatus } from "@/src/types/credit";
import { ECOSYSTEM_INFO } from "@/src/config/verticals";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/src/firebase/config";
import { Appointment } from "@/src/types/appointment";
import { updateAppointmentStatus } from "@/src/services/firebase/appointmentService";
import {
  getUserContactProfile,
  type UserContactProfile,
} from "@/src/services/firebase/userProfileService";
import { Suspense } from "react";

function isAppointmentFinishedOrCancelled(appt: Appointment): boolean {
  if (appt.status === "cancelada" || appt.status === "completada") {
    return true;
  }
  if (!appt.date) return false;

  let hours = 9;
  let minutes = 0;
  if (appt.timeSlot) {
    const match = appt.timeSlot.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
    if (match) {
      hours = parseInt(match[1], 10);
      minutes = parseInt(match[2], 10);
      const ampm = match[3]?.toUpperCase();
      if (ampm === "PM" && hours < 12) hours += 12;
      if (ampm === "AM" && hours === 12) hours = 0;
    }
  }

  const parts = appt.date.split("-").map(Number);
  const year = parts[0];
  const month = (parts[1] || 1) - 1;
  const day = parts[2] || 1;

  const apptEndTime = new Date(year, month, day, hours, minutes + 45, 0);
  const now = new Date();

  return apptEndTime.getTime() < now.getTime();
}

function PortalContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get("tab") || "credito";

  const [activeTab, setActiveTab] = useState<"credito" | "citas" | "inversiones" | "seguros" | "fit">(
    (["credito", "citas", "inversiones", "seguros", "fit"].includes(defaultTab)
      ? defaultTab
      : "credito") as any
  );

  useEffect(() => {
    if (defaultTab && ["credito", "citas", "inversiones", "seguros", "fit"].includes(defaultTab)) {
      setActiveTab(defaultTab as any);
    }
  }, [defaultTab]);
  const [user, setUser] = useState<any>(null);
  const [creditCase, setCreditCase] = useState<CreditCase | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const activeAppointments = useMemo(
    () => appointments.filter((appt) => !isAppointmentFinishedOrCancelled(appt)),
    [appointments]
  );
  const [loading, setLoading] = useState(true);
  const [copiedCoupon, setCopiedCoupon] = useState(false);
  const [isAutoFillModalOpen, setIsAutoFillModalOpen] = useState(false);
  const [isContractModalOpen, setIsContractModalOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserContactProfile | null>(null);

  // Uploading state for documents
  const [uploadState, setUploadState] = useState<Record<string, { uploading: boolean; progress: number }>>({});

  // Study payment upload state ($250.000)
  const [studyReceiptUploading, setStudyReceiptUploading] = useState(false);
  const [studyReceiptProgress, setStudyReceiptProgress] = useState(0);

  const handleStudyPaymentUpload = async (file: File) => {
    if (!creditCase?.id) return;
    setStudyReceiptUploading(true);
    setStudyReceiptProgress(0);

    try {
      await uploadStudyPaymentReceipt(creditCase.id, file, (progress) => {
        setStudyReceiptProgress(progress);
      });
    } catch (err) {
      console.error("Error uploading study receipt:", err);
      alert("Error al subir el comprobante de pago. Intenta nuevamente.");
    } finally {
      setStudyReceiptUploading(false);
      setStudyReceiptProgress(100);
    }
  };

  // Sync tab with URL param if present
  useEffect(() => {
    if (defaultTab && ["credito", "inversiones", "seguros", "fit", "citas"].includes(defaultTab)) {
      setActiveTab(defaultTab as any);
    }
  }, [defaultTab]);

  // Auth Subscription
  useEffect(() => {
    const unsubAuth = subscribeClientAuth((currentUser) => {
      if (!currentUser) {
        router.replace("/portal/login");
      } else {
        setUser(currentUser);
      }
    });
    return () => unsubAuth();
  }, [router]);

  // Credit Case Subscription
  useEffect(() => {
    if (!user?.uid) return;

    const unsubCase = subscribeUserCreditCase(user.uid, (data) => {
      setCreditCase(data);
      setLoading(false);
    });

    getUserContactProfile(user.uid)
      .then((profile) => setUserProfile(profile))
      .catch(console.error);

    return () => unsubCase();
  }, [user]);

  // Appointments Subscription
  useEffect(() => {
    if (!user?.email || !db) return;

    const q = query(
      collection(db, "citas"),
      where("email", "==", user.email)
    );

    const unsubAppts = onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as Appointment[];
        setAppointments(list);
      },
      (err) => console.error("Error fetching client appointments:", err)
    );

    return () => unsubAppts();
  }, [user]);

  const handleLogout = async () => {
    await logoutClient();
    router.replace("/portal/login");
  };

  const [cancellingApptId, setCancellingApptId] = useState<string | null>(null);

  const handleCancelAppointment = async (appt: Appointment) => {
    const confirmMsg = `¿Estás seguro de cancelar tu cita para "${appt.serviceName}" del día ${appt.date} a las ${appt.timeSlot}?\n\nEsta acción eliminará el evento de Google Calendar y liberará el horario.`;
    if (!window.confirm(confirmMsg)) return;

    const targetId = appt.id || appt.code;
    setCancellingApptId(targetId);

    try {
      await fetch("/api/citas/cancel-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appointmentId: appt.id,
          calendarEventId: (appt as any).calendarEventId,
          code: appt.code,
          clientName: appt.clientName,
          email: appt.email,
          serviceName: appt.serviceName,
          date: appt.date,
          timeSlot: appt.timeSlot,
          reason: "Cancelada por el cliente desde el portal de usuario",
        }),
      });

      if (appt.id) {
        await updateAppointmentStatus(appt.id, "cancelada");
      }

      alert("Tu cita ha sido cancelada exitosamente y liberada en la agenda.");
    } catch (err) {
      console.error("Error cancelando la cita:", err);
      alert("Hubo un error al cancelar la cita. Por favor intenta de nuevo.");
    } finally {
      setCancellingApptId(null);
    }
  };

  const handleCopyCoupon = () => {
    navigator.clipboard.writeText("NEXTFIT20");
    setCopiedCoupon(true);
    setTimeout(() => setCopiedCoupon(false), 2500);
  };

  const handleFileUpload = async (documentId: string, file: File) => {
    if (!creditCase?.id) return;

    setUploadState((prev) => ({
      ...prev,
      [documentId]: { uploading: true, progress: 0 },
    }));

    try {
      await uploadCreditDocumentFile(
        creditCase.id,
        documentId,
        file,
        creditCase.documents,
        (progress) => {
          setUploadState((prev) => ({
            ...prev,
            [documentId]: { uploading: true, progress },
          }));
        }
      );
    } catch (err) {
      console.error("Error uploading document:", err);
      alert("Error al subir el archivo. Intenta nuevamente.");
    } finally {
      setUploadState((prev) => ({
        ...prev,
        [documentId]: { uploading: false, progress: 100 },
      }));
    }
  };

  const handleDeleteFile = async (documentId: string) => {
    if (!creditCase?.id) return;
    if (!confirm("¿Estás seguro de que deseas eliminar este documento adjunto?")) return;

    try {
      await deleteCreditDocumentFile(creditCase.id, documentId, creditCase.documents);
    } catch (err) {
      console.error("Error deleting document:", err);
      alert("Error al eliminar el documento. Intenta nuevamente.");
    }
  };

  const STEPS: { key: CreditCaseStatus; label: string; desc: string }[] = [
    { key: "estudio_inicial", label: "Estudio Inicial", desc: "Revisión básica" },
    { key: "documentos_solicitados", label: "Documentos", desc: "Carga de soportes" },
    { key: "en_revision", label: "En Revisión", desc: "Auditoría financiera" },
    { key: "aprobado", label: "Aprobado", desc: "Cupo otorgado" },
    { key: "desembolsado", label: "Desembolsado", desc: "Transferido" },
  ];

  const getStepIndex = (status?: CreditCaseStatus): number => {
    switch (status) {
      case "estudio_inicial": return 0;
      case "documentos_solicitados": return 1;
      case "en_revision": return 2;
      case "aprobado": return 3;
      case "en_desembolso": return 3.5;
      case "desembolsado": return 4;
      default: return 0;
    }
  };

  const currentStepIdx = getStepIndex(creditCase?.status);
  const totalRequired = creditCase?.documents.filter((d) => d.required).length || 0;
  const uploadedRequired =
    creditCase?.documents.filter(
      (d) => d.required && (Boolean(d.fileUrl) || d.status === "en_revision" || d.status === "aprobado")
    ).length || 0;
  const completedRequired =
    creditCase?.documents.filter(
      (d) => d.required && (d.status === "en_revision" || d.status === "aprobado")
    ).length || 0;

  const [submittingReview, setSubmittingReview] = useState(false);

  const handleStartReviewProcess = async () => {
    if (!creditCase?.id) return;
    setSubmittingReview(true);
    try {
      await updateCreditCaseStatus(
        creditCase.id,
        "en_revision",
        "El cliente cargó la totalidad de los documentos e inició el proceso de revisión. Expediente en auditoría financiera."
      );
      setCreditCase((prev) =>
        prev
          ? {
              ...prev,
              status: "en_revision",
              statusNote: "Expediente radicado con éxito. Nuestro equipo de análisis financiero está revisando tus documentos.",
            }
          : null
      );
      alert("✅ ¡Excelente! Tu expediente ha sido enviado y el proceso de revisión ha comenzado.");
    } catch (err) {
      console.error("Error al iniciar proceso de revisión:", err);
      alert("Ocurrió un error al iniciar el proceso de revisión. Intenta nuevamente.");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold text-slate-500">Cargando tu portal...</p>
        </div>
      </div>
    );
  }

  const clientDisplayName = creditCase?.clientName || user?.displayName || user?.email?.split("@")[0] || "Cliente";

  const tabs = [
    { id: "credito", label: "Mi Crédito", icon: Coins, count: creditCase ? 1 : 0 },
    { id: "citas", label: "Mis Citas", icon: CalendarCheck, count: activeAppointments.length },
    { id: "inversiones", label: "Inversiones", icon: TrendingUp },
    { id: "seguros", label: "Seguros", icon: ShieldCheck },
    { id: "fit", label: "Beneficios Fit", icon: Dumbbell, badge: "20% OFF" },
  ];

  return (
    <main className="min-h-screen bg-[#F8FAFC] pb-24">
      {/* Top Navbar: Sober, Clean & Refined */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-2xs group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-xs sm:text-sm font-black text-slate-900 tracking-tight leading-tight">
                Mi Portal Ecosistema
              </h1>
              <span className="text-[10px] text-slate-400 block font-medium leading-none">
                Next Connection Group
              </span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/portal/perfil"
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors text-xs text-slate-700"
          >
            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center font-bold text-[10px] text-slate-900">
              {clientDisplayName.charAt(0).toUpperCase()}
            </div>
            <span className="hidden sm:inline font-bold truncate max-w-[120px]">
              {clientDisplayName.split(" ")[0]}
            </span>
          </Link>

          <button
            onClick={handleLogout}
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 transition-colors"
            title="Cerrar Sesión"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Salir</span>
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-3.5 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* User Digital Welcome Card: Clean White & Sober */}
        <div className="rounded-3xl bg-white border border-slate-200/90 p-5 sm:p-7 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-[10px] font-bold text-slate-700">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Cuenta Verificada</span>
                <span className="w-1 h-1 rounded-full bg-slate-300" />
                <span className="text-emerald-700 font-bold">Cliente Activo</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                ¡Hola, {clientDisplayName}!
              </h2>

              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-xl">
                Gestiona tus solicitudes de crédito, revisa tus citas programadas y accede a beneficios exclusivos del ecosistema.
              </p>
            </div>

            {/* Quick Identification Badge */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs space-y-1 shrink-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Titular Registrado
              </span>
              <span className="font-extrabold text-slate-900 block truncate">
                {(userProfile?.documentType || creditCase?.documentType || "CC")}{" "}
                {(userProfile?.documentNumber || creditCase?.documentNumber || "Sin cédula")}
              </span>
              <span className="text-[11px] text-slate-500 block truncate">
                {user?.email}
              </span>
            </div>
          </div>
        </div>

        {/* Unified Navigation Tabs (Clean Animated Pills) */}
        <div className="flex overflow-x-auto no-scrollbar gap-1.5 p-1.5 bg-white border border-slate-200/90 rounded-2xl shadow-2xs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`relative flex items-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-slate-900 text-white shadow-2xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-emerald-400" : "text-slate-400"}`} />
                <span>{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                      isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
                {tab.badge && (
                  <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ============================================================== */}
        {/* TAB 1: MI CRÉDITO */}
        {/* ============================================================== */}
        {activeTab === "credito" && (
          <div className="space-y-5 animate-in fade-in duration-200">
            {!creditCase ? (
              <div className="p-8 rounded-3xl bg-white border border-slate-200/90 text-center space-y-3 shadow-xs">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto border border-emerald-100">
                  <Coins className="w-6 h-6" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  No tienes solicitudes de crédito activas aún
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Agenda tu cita de asesoría financiera o simula tu cuota para radicar tu crédito de libre inversión o empresarial.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab("citas")}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 shadow-xs transition-all"
                  >
                    <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Pedir Cita con Asesor de Crédito</span>
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Credit Progress Card */}
                <div className="p-5 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                    <div>
                      <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">
                        Radicado Oficial: {creditCase.code}
                      </span>
                      <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight mt-0.5">
                        Estado de tu Solicitud
                      </h3>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setIsAutoFillModalOpen(true)}
                        className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-2xs"
                      >
                        <Zap className="w-3.5 h-3.5 fill-slate-950" />
                        <span>Auto-Fill Bancario</span>
                      </button>

                      <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200">
                        {creditCase.creditType?.toUpperCase() || "LIBRE INVERSIÓN"}
                      </span>
                    </div>
                  </div>

                  {/* 5-Step Progress Bar */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                    {STEPS.map((s, idx) => {
                      const isPast = currentStepIdx > idx;
                      const isCurrent = Math.floor(currentStepIdx) === idx;

                      return (
                        <div
                          key={s.key}
                          className={`p-3 rounded-xl border transition-all ${
                            isCurrent
                              ? "border-slate-900 bg-slate-50 shadow-2xs ring-1 ring-slate-900"
                              : isPast
                              ? "border-emerald-200 bg-emerald-50/50 text-emerald-950"
                              : "border-slate-200 bg-slate-50/40 opacity-50"
                          }`}
                        >
                          <div className="flex items-center gap-1.5 mb-1">
                            <span
                              className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black ${
                                isPast
                                  ? "bg-emerald-600 text-white"
                                  : isCurrent
                                  ? "bg-slate-900 text-white"
                                  : "bg-slate-200 text-slate-600"
                              }`}
                            >
                              {isPast ? "✓" : idx + 1}
                            </span>
                            <span className="text-xs font-bold text-slate-900 truncate">
                              {s.label}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-500 block truncate">
                            {s.desc}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {creditCase.statusNote && (
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-start gap-2.5">
                      <MessageSquare className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-slate-900 block">Nota del Asesor:</span>
                        <p className="mt-0.5 text-slate-600 leading-snug">{creditCase.statusNote}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Financial KPIs */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-0.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Monto Solicitado
                    </span>
                    <span className="text-lg sm:text-xl font-black text-slate-900 block truncate">
                      ${(creditCase.amount || 0).toLocaleString("es-CO")}
                    </span>
                    <span className="text-[10px] text-emerald-700 font-semibold block">
                      {creditCase.monthlyInterestRate ? `Tasa: ${creditCase.monthlyInterestRate}% M.V.` : "Tasa: Por definir en estudio"}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-0.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Plazo
                    </span>
                    <span className="text-lg sm:text-xl font-black text-slate-900 block">
                      {creditCase.termMonths} Meses
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium block">
                      Plazo solicitado
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-0.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Cuota Mensual
                    </span>
                    <span className="text-lg sm:text-xl font-black text-slate-900 block truncate">
                      {creditCase.estimatedMonthlyPayment && creditCase.estimatedMonthlyPayment > 0
                        ? `$${creditCase.estimatedMonthlyPayment.toLocaleString("es-CO")}`
                        : "Por liquidar"}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium block">
                      {creditCase.estimatedMonthlyPayment && creditCase.estimatedMonthlyPayment > 0
                        ? "Con seguro incluido"
                        : "Pendiente de aprobación"}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1.5 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Documentos Cargados
                      </span>
                      <span className="text-lg sm:text-xl font-black text-slate-900 block">
                        {completedRequired} / {totalRequired}
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-emerald-600 h-1.5 transition-all"
                        style={{
                          width: totalRequired > 0 ? `${(completedRequired / totalRequired) * 100}%` : "0%",
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Contract & Study Payment Quick Strip */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {/* Contract Card */}
                  <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-between gap-3">
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <PenTool className="w-3.5 h-3.5 text-slate-600" />
                        <span className="font-extrabold text-slate-900">Contrato de Comisión</span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate">
                        {creditCase.contract?.signed ? "Documento firmado digitalmente" : "Pendiente por firma digital"}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsContractModalOpen(true)}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs shrink-0 transition-all ${
                        creditCase.contract?.signed
                          ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                          : "bg-slate-900 hover:bg-slate-800 text-white shadow-2xs"
                      }`}
                    >
                      {creditCase.contract?.signed ? "Ver Contrato" : "Firmar Contrato"}
                    </button>
                  </div>

                  {/* Study Payment Receipt */}
                  <div className={`p-4 rounded-2xl border shadow-2xs flex items-center justify-between gap-3 transition-all ${
                    creditCase.studyPayment?.fileUrl
                      ? "bg-emerald-50/40 border-emerald-300"
                      : "bg-white border-slate-200/90"
                  }`}>
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-1.5">
                        {creditCase.studyPayment?.fileUrl ? (
                          <div className="w-5 h-5 rounded-full bg-emerald-100 border border-emerald-400 flex items-center justify-center shrink-0">
                            <Check className="w-3.5 h-3.5 text-emerald-700 stroke-[3]" />
                          </div>
                        ) : (
                          <FileText className="w-3.5 h-3.5 text-slate-600" />
                        )}
                        <span className="font-extrabold text-slate-900">Estudio ($250.000 COP)</span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate">
                        {creditCase.studyPayment?.status === "verificado"
                          ? "✓ Comprobante verificado con éxito"
                          : creditCase.studyPayment?.fileUrl
                          ? "✓ Comprobante subido (en revisión)"
                          : "Pendiente por adjuntar"}
                      </p>
                    </div>

                    {creditCase.studyPayment?.fileUrl ? (
                      <div className="flex items-center gap-1.5 shrink-0">
                        <a
                          href={creditCase.studyPayment.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors flex items-center gap-1 shadow-2xs"
                        >
                          <span>Ver</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                        <label className="cursor-pointer px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors flex items-center gap-1">
                          <Upload className="w-3 h-3 text-slate-600" />
                          <span>Cambiar</span>
                          <input
                            type="file"
                            accept=".pdf,image/png,image/jpeg,image/jpg"
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                handleStudyPaymentUpload(e.target.files[0]);
                              }
                            }}
                          />
                        </label>
                      </div>
                    ) : (
                      <label className="cursor-pointer px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shrink-0 transition-colors shadow-2xs flex items-center gap-1">
                        <Upload className="w-3 h-3" />
                        <span>Subir</span>
                        <input
                          type="file"
                          accept=".pdf,image/png,image/jpeg,image/jpg"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              handleStudyPaymentUpload(e.target.files[0]);
                            }
                          }}
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* Documents Checklist */}
                <div className="p-5 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <h4 className="font-bold text-sm sm:text-base text-slate-900">
                        Documentos Solicitados
                      </h4>
                      <p className="text-xs text-slate-500">
                        Sube tus archivos en formato PDF o fotografía legible.
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-slate-500">
                      {completedRequired} de {totalRequired} listos
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {creditCase.documents.map((docItem) => {
                      const state = uploadState[docItem.id] || { uploading: false, progress: 0 };
                      const isUploaded = Boolean(docItem.fileUrl);
                      const isApproved = docItem.status === "aprobado";

                      return (
                        <div
                          key={docItem.id}
                          className={`p-4 rounded-2xl transition-all flex flex-col justify-between ${
                            isApproved
                              ? "bg-emerald-50/50 border-2 border-emerald-500/50 shadow-2xs"
                              : isUploaded
                              ? "bg-emerald-50/30 border-2 border-emerald-400/40 shadow-2xs"
                              : "bg-white border border-slate-200/90 hover:border-slate-300 shadow-2xs"
                          }`}
                        >
                          <div>
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <div className="flex items-center gap-2">
                                {isUploaded ? (
                                  <div className="w-5 h-5 rounded-full bg-emerald-100 border border-emerald-400 flex items-center justify-center shrink-0">
                                    <Check className="w-3.5 h-3.5 text-emerald-700 stroke-[3]" />
                                  </div>
                                ) : (
                                  <div className="w-5 h-5 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                                    <FileText className="w-3 h-3 text-slate-400" />
                                  </div>
                                )}
                                <span className="font-bold text-xs text-slate-900 leading-tight">
                                  {docItem.title || (docItem as any).name || "Documento"} {docItem.required && <span className="text-rose-500">*</span>}
                                </span>
                              </div>

                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 flex items-center gap-1 ${
                                  isApproved
                                    ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                                    : isUploaded
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                    : docItem.status === "rechazado"
                                    ? "bg-red-50 text-red-800 border-red-200"
                                    : "bg-amber-50 text-amber-700 border-amber-200"
                                }`}
                              >
                                {isApproved ? (
                                  <>
                                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                    <span>Validado</span>
                                  </>
                                ) : isUploaded ? (
                                  <>
                                    <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />
                                    <span>Subido con Éxito</span>
                                  </>
                                ) : docItem.status === "rechazado" ? (
                                  <span>Rechazado</span>
                                ) : (
                                  <span>Pendiente</span>
                                )}
                              </span>
                            </div>

                            {docItem.fileUrl && (
                              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-emerald-200/80 text-xs text-slate-700 mb-2.5 shadow-2xs">
                                <div className="flex items-center gap-1.5 min-w-0">
                                  <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3] shrink-0" />
                                  <span className="truncate max-w-[150px] font-semibold text-[11px] text-slate-800">
                                    {docItem.fileName || "Archivo adjuntado"}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1.5 ml-2 shrink-0">
                                  <a
                                    href={docItem.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-slate-700 hover:text-slate-900 font-bold text-xs px-2 py-0.5 rounded-lg hover:bg-slate-100 transition-colors"
                                  >
                                    Ver
                                  </a>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteFile(docItem.id)}
                                    className="text-red-500 hover:text-red-700 p-1 rounded-lg hover:bg-red-50 transition-colors"
                                    title="Eliminar archivo"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="pt-2 border-t border-slate-200/60">
                            {state.uploading ? (
                              <div className="space-y-1">
                                <div className="flex justify-between text-[10px] text-slate-600 font-bold">
                                  <span>Subiendo documento...</span>
                                  <span>{state.progress}%</span>
                                </div>
                                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                                  <div
                                    className="bg-emerald-600 h-1.5 transition-all"
                                    style={{ width: `${state.progress}%` }}
                                  />
                                </div>
                              </div>
                            ) : (
                              <label className={`cursor-pointer inline-flex items-center gap-1.5 py-1.5 px-3 rounded-xl border text-xs font-bold transition-all shadow-2xs ${
                                isUploaded
                                  ? "bg-white hover:bg-slate-50 border-slate-200 text-slate-700"
                                  : "bg-slate-900 hover:bg-slate-800 text-white border-transparent"
                              }`}>
                                <Upload className="w-3 h-3" />
                                <span>{docItem.fileUrl ? "Reemplazar Archivo" : "Adjuntar Documento"}</span>
                                <input
                                  type="file"
                                  accept=".pdf,image/png,image/jpeg,image/jpg"
                                  className="hidden"
                                  onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                      handleFileUpload(docItem.id, e.target.files[0]);
                                    }
                                  }}
                                />
                              </label>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Botón de Empezar Proceso de Revisión (visible cuando todos los documentos requeridos están subidos) */}
                  {totalRequired > 0 && uploadedRequired >= totalRequired && (creditCase.status === "estudio_inicial" || creditCase.status === "documentos_solicitados") && (
                    <div className="mt-5 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-emerald-500/10 border-2 border-emerald-500 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-2">
                      <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                          <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                              ✓ 100% Documentación Completa
                            </span>
                          </div>
                          <h5 className="font-black text-sm sm:text-base text-slate-900 mt-1">
                            ¡Todos tus documentos han sido cargados con éxito!
                          </h5>
                          <p className="text-xs text-slate-600 mt-0.5">
                            Ya tienes todos los soportes obligatorios adjuntos. Haz clic en el botón para radicar tu expediente y empezar el proceso de revisión formal.
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleStartReviewProcess}
                        disabled={submittingReview}
                        className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-extrabold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
                      >
                        <Zap className="w-4 h-4 fill-emerald-400 text-emerald-400" />
                        <span>{submittingReview ? "Iniciando Proceso..." : "Empezar Proceso de Revisión"}</span>
                      </button>
                    </div>
                  )}

                  {/* Estado cuando ya está en revisión */}
                  {creditCase.status === "en_revision" && (
                    <div className="mt-5 p-4 rounded-2xl bg-purple-50/70 border border-purple-200 text-purple-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="font-extrabold text-purple-900 block text-sm">
                            Tu expediente se encuentra en Proceso de Revisión
                          </span>
                          <span className="text-purple-700 block text-xs mt-0.5">
                            Nuestro equipo administrativo y financiero está analizando tus soportes con las matrices bancarias aliadas.
                          </span>
                        </div>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-purple-100 font-bold text-purple-800 border border-purple-200 text-xs shrink-0 self-start sm:self-auto">
                        🔍 En Auditoría
                      </span>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: MIS CITAS AGENDADAS */}
        {/* ============================================================== */}
        {activeTab === "citas" && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="p-5 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                    Tus Citas y Turnos Agendados
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Revisa las sesiones virtuales por Google Meet o visitas en sedes físicas.
                  </p>
                </div>

                <Link
                  href="/citas"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 shadow-xs flex items-center gap-1.5 self-start sm:self-auto transition-all"
                >
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Agendar Nueva Cita</span>
                </Link>
              </div>

              {activeAppointments.length === 0 ? (
                <div className="p-8 rounded-2xl bg-slate-50/60 border border-slate-200/80 text-center space-y-3">
                  <Clock className="w-9 h-9 text-slate-400 mx-auto" />
                  <h4 className="text-sm font-bold text-slate-800">
                    No tienes citas activas en este momento
                  </h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Cuando reserves una asesoría, aparecerá aquí con su enlace oficial de Google Meet y detalles de acceso.
                  </p>
                  <div className="pt-2">
                    <Link
                      href="/citas"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-900 bg-white border border-slate-300 hover:bg-slate-50 shadow-2xs transition-colors"
                    >
                      <Calendar className="w-3.5 h-3.5 text-slate-700" />
                      <span>Agendar una Cita Ahora</span>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {activeAppointments.map((appt) => (
                    <div
                      key={appt.id || appt.code}
                      className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="font-mono text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                            {appt.code}
                          </span>
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            ✓ Confirmada
                          </span>
                        </div>

                        <h4 className="font-extrabold text-sm text-slate-900">
                          {appt.serviceName}
                        </h4>

                        <div className="mt-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-800">📅 {appt.date}</span>
                          <span className="font-bold text-slate-900">⏰ {appt.timeSlot}</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                        {appt.status !== "cancelada" ? (
                          <>
                            {appt.modality === "virtual" && appt.meetUrl ? (
                              <a
                                href={appt.meetUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-2xs"
                              >
                                <Video className="w-3.5 h-3.5 text-emerald-400" />
                                <span>Entrar a Google Meet</span>
                                <ExternalLink className="w-3 h-3 opacity-60 ml-1" />
                              </a>
                            ) : (
                              <div className="flex-1 text-[11px] text-slate-600 font-medium">
                                Atención presencial en sede
                              </div>
                            )}

                            <button
                              type="button"
                              disabled={cancellingApptId === (appt.id || appt.code)}
                              onClick={() => handleCancelAppointment(appt)}
                              className="py-2 px-3 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold transition-colors disabled:opacity-50"
                            >
                              {cancellingApptId === (appt.id || appt.code) ? "..." : "Cancelar"}
                            </button>
                          </>
                        ) : (
                          <span className="text-xs text-red-500 italic">Cita cancelada</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: INVERSIONES */}
        {/* ============================================================== */}
        {activeTab === "inversiones" && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="p-5 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider block">
                    Portafolios & Rentabilidad
                  </span>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight mt-0.5">
                    Tus Inversiones en Next Connection
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Rentabilidad fija y proyectada de hasta <strong>17.8% E.A.</strong> con custodia segura de capital.
                  </p>
                </div>

                <a
                  href={`https://wa.me/${ECOSYSTEM_INFO.contact.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(
                    `Hola, soy ${clientDisplayName}. Deseo asesoría sobre portafolios de inversión para miembros de Next Connection.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 shadow-xs flex items-center gap-1.5 self-start sm:self-auto transition-all"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-indigo-300" />
                  <span>Hablar con Asesor</span>
                </a>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-200/70 space-y-1.5">
                  <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider block">
                    Portafolio Dinámico
                  </span>
                  <span className="text-2xl font-black text-indigo-950 block">
                    17.8% E.A.
                  </span>
                  <p className="text-xs text-slate-600 leading-snug">
                    Plazos desde 12 meses con liquidación de intereses periódica o reinversión.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Portafolio Moderado
                  </span>
                  <span className="text-2xl font-black text-slate-900 block">
                    14.5% E.A.
                  </span>
                  <p className="text-xs text-slate-600 leading-snug">
                    Plazos desde 6 meses con bajo nivel de volatilidad y retorno constante.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Monto Mínimo de Entrada
                  </span>
                  <span className="text-2xl font-black text-slate-900 block">
                    $500,000 COP
                  </span>
                  <p className="text-xs text-slate-600 leading-snug">
                    Apertura 100% digital sin comisiones ocultas de administración.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 4: SEGUROS */}
        {/* ============================================================== */}
        {activeTab === "seguros" && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="p-5 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[11px] font-bold text-sky-700 uppercase tracking-wider block">
                    Protección & Cobertura
                  </span>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight mt-0.5">
                    Tus Pólizas y Asistencias 24/7
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Respaldo integral en salud, vida, autos y hogar con asistencia inmediata.
                  </p>
                </div>

                <a
                  href={`tel:${ECOSYSTEM_INFO.contact.phone.replace(/\D/g, "")}`}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 shadow-xs flex items-center gap-1.5 self-start sm:self-auto transition-all"
                >
                  <Phone className="w-3.5 h-3.5 text-sky-400" />
                  <span>Llamar a Asistencia</span>
                </a>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-xs font-bold text-slate-900 block">🛡️ Seguro de Deudores & Vida</span>
                  <p className="text-xs text-slate-500 leading-snug">
                    Ampara el saldo de tu crédito y garantiza respaldo económico a tu familia.
                  </p>
                  <span className="text-[10px] text-emerald-700 font-bold block pt-1">
                    ✓ Incluido en tu crédito
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-xs font-bold text-slate-900 block">🚗 Seguro Todo Riesgo Autos</span>
                  <p className="text-xs text-slate-500 leading-snug">
                    Pólizas sin sorpresas, asistencia en viaje 24/7 y carro taller a domicilio.
                  </p>
                  <span className="text-[10px] text-sky-700 font-bold block pt-1">
                    Tarifa especial socios
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-xs font-bold text-slate-900 block">🏥 Salud & Medicina Prepagada</span>
                  <p className="text-xs text-slate-500 leading-snug">
                    Acceso a especialistas, clínicas de alta complejidad y urgencias médicas.
                  </p>
                  <span className="text-[10px] text-sky-700 font-bold block pt-1">
                    Convenios preferenciales
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 5: BENEFICIOS FIT */}
        {/* ============================================================== */}
        {activeTab === "fit" && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="p-5 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-[10px] font-bold text-amber-800 mb-1">
                    <Gift className="w-3 h-3 text-amber-600" />
                    <span>Beneficio Exclusivo del Ecosistema</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                    20% OFF en Suplementación & Nutrición
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Descuento permanente en proteínas aisladas, creatinas y productos fit certificados.
                  </p>
                </div>

                {/* Coupon Code Pill */}
                <button
                  type="button"
                  onClick={handleCopyCoupon}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-all self-start sm:self-auto"
                >
                  {copiedCoupon ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>¡Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-amber-300" />
                      <span>Copiar NEXTFIT20</span>
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1">
                  <span className="text-xl font-black text-slate-900 block">100%</span>
                  <span className="text-xs font-bold text-slate-800 block">Certificación Invima</span>
                  <p className="text-[11px] text-slate-500">Materias primas puras y etiquetado transparente.</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1">
                  <span className="text-xl font-black text-slate-900 block">Gratis</span>
                  <span className="text-xs font-bold text-slate-800 block">Envío Nacional</span>
                  <p className="text-[11px] text-slate-500">En pedidos superiores a $150.000 COP.</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1">
                  <span className="text-xl font-black text-slate-900 block">Gratis</span>
                  <span className="text-xs font-bold text-slate-800 block">Asesoría Nutricional</span>
                  <p className="text-[11px] text-slate-500">Guía de toma personalizada con especialista.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modals: Auto-Fill & Contrato */}
        {isAutoFillModalOpen && creditCase && (
          <AutoFillModal
            isOpen={isAutoFillModalOpen}
            onClose={() => setIsAutoFillModalOpen(false)}
            clientData={{
              clientName: creditCase.clientName || user?.displayName || "Cliente",
              documentType: creditCase.documentType || "CC",
              documentNumber: creditCase.documentNumber || "",
              companyName: creditCase.companyName || "",
              companyNit: creditCase.companyNit || "",
              phone: creditCase.phone || "",
              email: creditCase.email || user?.email || "",
              city: creditCase.city || "",
              address: creditCase.address || "",
              amount: creditCase.amount || 0,
              termMonths: creditCase.termMonths || 12,
              code: creditCase.code,
            }}
          />
        )}

        {isContractModalOpen && creditCase && (
          <ContractViewerModal
            creditCase={creditCase}
            isOpen={isContractModalOpen}
            onClose={() => setIsContractModalOpen(false)}
            onContractSigned={() => {}}
          />
        )}
      </div>
    </main>
  );
}

export default function UnifiedClientPortalPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
          <div className="w-8 h-8 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <PortalContent />
    </Suspense>
  );
}
