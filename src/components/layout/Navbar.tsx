"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Coins,
  TrendingUp,
  ShieldCheck,
  Dumbbell,
  Menu,
  X,
  UserCheck,
  User,
  Calendar,
  Home,
  Layers,
  MessageCircle,
} from "lucide-react";
import Image from "next/image";
import { subscribeClientAuth } from "@/src/services/firebase/creditCasesService";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const unsub = subscribeClientAuth((user) => {
      setCurrentUser(user);
    });
    return () => unsub();
  }, []);

  const navItems = [
    {
      key: "credito",
      label: "Crédito",
      href: "/credito",
      icon: Coins,
    },
    {
      key: "inversiones",
      label: "Inversiones",
      href: "/inversiones",
      icon: TrendingUp,
    },
    {
      key: "seguros",
      label: "Seguros",
      href: "/seguros",
      icon: ShieldCheck,
    },
    {
      key: "fit",
      label: "Productos Fit",
      href: "/fit",
      icon: Dumbbell,
    },
  ];

  const handleVerticalClick = (e: React.MouseEvent, key: string) => {
    e.preventDefault();
    if (mobileMenuOpen) setMobileMenuOpen(false);
    if (pathname === "/") {
      window.dispatchEvent(
        new CustomEvent("open-vertical-modal", { detail: { vertical: key } })
      );
    } else {
      window.location.href = `/?vertical=${key}`;
    }
  };

  const handleScrollToSection = (sectionId: string) => {
    if (mobileMenuOpen) setMobileMenuOpen(false);
    if (pathname === "/") {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }
    window.location.href = `/#${sectionId}`;
  };

  const handleScrollToCitas = (e: React.MouseEvent) => {
    if (mobileMenuOpen) setMobileMenuOpen(false);
    if (pathname === "/") {
      e.preventDefault();
      const el = document.getElementById("agendar-cita");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <>
      {/* ============================================================== */}
      {/* TOP INSTITUTIONAL HEADER BAR (SOBER & ELEGANT) */}
      {/* ============================================================== */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md shadow-2xs">
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 gap-3 sm:gap-4">
            {/* Brand Logo - Clean institutional line */}
            <Link href="/" className="flex items-center gap-2 sm:gap-2.5 shrink-0 group">
              <div className="h-7 sm:h-8 w-auto group-hover:opacity-90 transition-opacity">
                <Image
                  src="/logo.png"
                  alt="Next Connection"
                  width={100}
                  height={32}
                  className="h-7 sm:h-8 w-auto object-contain"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xs sm:text-sm font-black tracking-tight text-slate-900 leading-tight">
                  Next Connection
                </span>
                <span className="text-[9px] sm:text-[10px] text-slate-400 font-medium leading-none">
                  Grupo Empresarial
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;

                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={(e) => handleVerticalClick(e, item.key)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                  >
                    <Icon className="w-3.5 h-3.5 text-slate-500" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Desktop Right: Single-line User box + Sober Agendar Cita button */}
            <div className="hidden sm:flex items-center gap-2.5 shrink-0">
              {currentUser ? (
                <Link
                  href="/portal"
                  className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-xl text-slate-800 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 transition-colors whitespace-nowrap"
                >
                  <div className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                    {currentUser.displayName
                      ? currentUser.displayName.charAt(0).toUpperCase()
                      : currentUser.email?.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-bold max-w-[110px] truncate text-xs text-slate-900">
                    {currentUser.displayName?.split(" ")[0] || currentUser.email?.split("@")[0]}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium px-1.5 py-0.5 rounded bg-white border border-slate-200/60">
                    Portal
                  </span>
                </Link>
              ) : (
                <Link
                  href="/portal/login"
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors whitespace-nowrap"
                >
                  <UserCheck className="w-3.5 h-3.5 text-slate-600" />
                  <span>Mi Portal</span>
                </Link>
              )}

              {/* Sober Institutional CTA */}
              <Link
                href="/citas"
                onClick={handleScrollToCitas}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-slate-900 hover:bg-slate-800 text-white shadow-xs transition-colors whitespace-nowrap"
              >
                <Calendar className="w-3.5 h-3.5 text-slate-300" />
                <span>Agendar Cita</span>
              </Link>
            </div>

            {/* Mobile Top Actions: Direct Cita Pill + Menu Toggle */}
            <div className="flex sm:hidden items-center gap-2">
              <Link
                href="/citas"
                onClick={handleScrollToCitas}
                className="px-3 py-1.5 text-[11px] font-bold rounded-xl bg-slate-900 text-white flex items-center gap-1.5 shadow-2xs active:scale-95 transition-transform"
              >
                <Calendar className="w-3 h-3 text-slate-300" />
                <span>Agendar</span>
              </Link>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-1.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 active:scale-95 transition-transform"
                aria-label="Abrir Menú"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Top Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-xl animate-in slide-in-from-top-2 duration-200">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 p-3 rounded-xl text-xs font-bold text-slate-800 hover:bg-slate-50"
            >
              <Home className="w-4 h-4 text-slate-500" />
              <span>Inicio</span>
            </Link>
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={(e) => handleVerticalClick(e, item.key)}
                  className="w-full flex items-center justify-between p-3 rounded-xl text-xs font-bold transition-all border border-transparent text-slate-700 hover:bg-slate-50 text-left"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-slate-500" />
                    <span>{item.label}</span>
                  </div>
                </button>
              );
            })}

            <div className="pt-3 border-t border-slate-200 flex flex-col gap-2">
              <Link
                href="/citas"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-2.5 text-center text-xs font-bold rounded-xl bg-slate-900 text-white shadow-xs"
              >
                <Calendar className="w-3.5 h-3.5 text-slate-300" />
                <span>Agendar Cita en Línea</span>
              </Link>
              <Link
                href={currentUser ? "/portal" : "/portal/login"}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-2.5 text-center text-xs font-bold rounded-xl border border-slate-200 text-slate-800 bg-slate-50"
              >
                <User className="w-3.5 h-3.5 text-slate-600" />
                <span>{currentUser ? "Ir a Mi Portal" : "Iniciar Sesión"}</span>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ============================================================== */}
      {/* SOBER & CLEAN BOTTOM NAVIGATION BAR ON MOBILE */}
      {/* ============================================================== */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/98 backdrop-blur-xl border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-2 py-1.5 safe-area-bottom">
        <div className="flex items-center justify-around max-w-md mx-auto">
          {/* 1. Inicio */}
          <Link
            href="/"
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
              pathname === "/"
                ? "text-slate-950 font-bold scale-105"
                : "text-slate-400 hover:text-slate-700 font-medium"
            }`}
          >
            <div className={`p-1 rounded-lg ${pathname === "/" ? "bg-slate-100" : ""}`}>
              <Home className="w-5 h-5" />
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight">Inicio</span>
          </Link>

          {/* 2. Soluciones */}
          <button
            type="button"
            onClick={() => handleScrollToSection("pilares")}
            className="flex flex-col items-center justify-center py-1 px-3 rounded-xl text-slate-400 hover:text-slate-700 font-medium transition-all active:scale-95"
          >
            <div className="p-1 rounded-lg">
              <Layers className="w-5 h-5" />
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight">Soluciones</span>
          </button>

          {/* 3. Agendar Cita */}
          <Link
            href="/citas"
            onClick={handleScrollToCitas}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
              pathname === "/citas"
                ? "text-slate-950 font-bold scale-105"
                : "text-slate-400 hover:text-slate-700 font-medium"
            }`}
          >
            <div className={`p-1 rounded-lg ${pathname === "/citas" ? "bg-slate-100" : ""}`}>
              <Calendar className="w-5 h-5" />
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight">Citas</span>
          </Link>

          {/* 4. Mi Portal */}
          <Link
            href={currentUser ? "/portal" : "/portal/login"}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
              pathname.startsWith("/portal")
                ? "text-slate-950 font-bold scale-105"
                : "text-slate-400 hover:text-slate-700 font-medium"
            }`}
          >
            <div className={`p-1 rounded-lg ${pathname.startsWith("/portal") ? "bg-slate-100" : ""}`}>
              <User className="w-5 h-5" />
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight">Mi Portal</span>
          </Link>
        </div>
      </nav>
    </>
  );
}
