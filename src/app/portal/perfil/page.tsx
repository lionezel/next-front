"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User,
  Mail,
  Shield,
  Calendar,
  ArrowLeft,
  LogOut,
  Coins,
  Phone,
  FileText,
  Save,
  CheckCircle2,
  Sparkles,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/src/context/AuthContext";
import {
  getUserContactProfile,
  saveUserContactProfile,
  type UserContactProfile,
} from "@/src/services/firebase/userProfileService";

export default function PerfilPage() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();

  // Contact profile state
  const [profile, setProfile] = useState<UserContactProfile>({
    documentType: "CC",
    documentNumber: "",
    clientName: "",
    phone: "",
    email: "",
  });
  const [profileLoading, setProfileLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/portal/login");
    }
  }, [user, loading, router]);

  // Load profile from Firestore
  useEffect(() => {
    if (!user?.uid) return;
    setProfileLoading(true);
    getUserContactProfile(user.uid)
      .then((data) => {
        if (data) {
          setProfile((prev) => ({ ...prev, ...data, email: data.email || user.email || "" }));
        } else {
          setProfile((prev) => ({ ...prev, email: user.email || "" }));
        }
      })
      .catch(console.error)
      .finally(() => setProfileLoading(false));
  }, [user]);

  const handleLogout = async () => {
    await logout();
    router.replace("/portal/login");
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.uid) return;
    setSaving(true);
    try {
      await saveUserContactProfile(user.uid, profile);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error("Error saving profile:", err);
      alert("Hubo un error al guardar. Intenta de nuevo.");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !user) {
    return (
      <main className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-slate-900 border-t-transparent animate-spin" />
          <p className="text-xs text-slate-500 font-semibold">Cargando perfil...</p>
        </div>
      </main>
    );
  }

  const initials = (profile.clientName || user.email || "U").substring(0, 2).toUpperCase();
  const createdDate = user.metadata?.creationTime
    ? new Date(user.metadata.creationTime).toLocaleDateString("es-CO", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "—";

  return (
    <main className="min-h-screen bg-[#F8FAFC] pb-20">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-2xs">
        <Link href="/portal" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-2xs group-hover:scale-105 transition-transform">
            <Sparkles className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-xs sm:text-sm font-black text-slate-900 tracking-tight leading-tight">
              Mi Perfil
            </h1>
            <span className="text-[10px] text-slate-400 block font-medium leading-none">
              Next Connection Group
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/portal"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors text-xs font-semibold text-slate-700"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver a Mi Portal</span>
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

      <div className="max-w-lg mx-auto px-4 pt-6 space-y-5">
        {/* Avatar Profile Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-5 sm:p-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-lg font-black shadow-xs shrink-0">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-base sm:text-lg font-black text-slate-900 truncate">
                {profile.clientName || user.displayName || "Titular de Cuenta"}
              </h2>
              <p className="text-xs text-slate-500 truncate">{user.email}</p>
              <div className="mt-2 flex items-center gap-1.5">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-[10px] font-bold text-slate-700">
                  <Shield className="w-3 h-3 text-emerald-600" />
                  <span>Cuenta Verificada</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Profile Form */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                Datos de Contacto
              </p>
              <p className="text-[11px] text-slate-500">
                Se pre-llenan automáticamente en tus solicitudes y citas
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="p-5 sm:p-6 space-y-3.5">
            {profileLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 text-slate-600 animate-spin" />
              </div>
            ) : (
              <>
                {/* Name */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                    Nombre Completo
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="Ej. Andrés Felipe Restrepo Gómez"
                      value={profile.clientName || ""}
                      onChange={(e) => setProfile((p) => ({ ...p, clientName: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900 transition-colors"
                    />
                  </div>
                </div>

                {/* Document Type + Number */}
                <div className="grid grid-cols-3 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                      Tipo Doc.
                    </label>
                    <select
                      value={profile.documentType || "CC"}
                      onChange={(e) => setProfile((p) => ({ ...p, documentType: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2.5 text-xs sm:text-sm text-slate-900 font-semibold focus:outline-none focus:bg-white focus:border-slate-900 transition-colors"
                    >
                      <option value="CC">C.C.</option>
                      <option value="CE">C.E.</option>
                      <option value="NIT">NIT</option>
                      <option value="PASAPORTE">Pasaporte</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                      Número de Documento
                    </label>
                    <div className="relative">
                      <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        placeholder="Ej. 1020304050"
                        value={profile.documentNumber || ""}
                        onChange={(e) => setProfile((p) => ({ ...p, documentNumber: e.target.value }))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                    Teléfono / WhatsApp
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      placeholder="Ej. 300 123 4567"
                      value={profile.phone || ""}
                      onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900 transition-colors"
                    />
                  </div>
                </div>

                {/* Email (read only) */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                    Correo Electrónico (Registrado)
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      value={user.email || ""}
                      readOnly
                      className="w-full bg-slate-100 border border-slate-200 rounded-xl pl-9 pr-3.5 py-2.5 text-xs sm:text-sm text-slate-500 cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Save Button */}
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full mt-2 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs sm:text-sm text-white bg-slate-900 hover:bg-slate-800 shadow-xs transition-all disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Guardando...</span>
                    </>
                  ) : saved ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>¡Datos guardados con éxito!</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Guardar Datos de Contacto</span>
                    </>
                  )}
                </button>
              </>
            )}
          </form>
        </div>

        {/* Account Details Box */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-5 space-y-3">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Detalles de la Cuenta
          </p>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Miembro Desde</span>
              <span className="font-semibold text-slate-800 block mt-0.5 truncate">{createdDate}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Estado</span>
              <span className="font-semibold text-emerald-700 block mt-0.5">Activo & Seguro</span>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <button
          id="profile-logout-btn"
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-200 bg-white hover:bg-rose-50 hover:border-rose-200 text-slate-600 hover:text-rose-600 font-bold text-xs transition-colors shadow-2xs"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </main>
  );
}
