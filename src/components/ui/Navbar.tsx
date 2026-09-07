"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Phone,
  Calculator,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  Clock,
  MapPin,
} from "lucide-react";
import DistripakoLogo from "./DistripakoLogo";
import { COMPANY_INFO } from "@/src/data/uniforms-data";

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "#simulador-3d", label: "Simulador 3D" },
  { href: "#catalogo", label: "Catálogo" },
  { href: "#cotizador", label: "Cotizador en Línea" },
  { href: "#servicios", label: "Personalización" },
  { href: "#contacto", label: "Contacto" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 25);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <>
      {/* Top Notification / Info Bar (Clean White / Light Slate) */}
      <div className="hidden lg:block bg-slate-50 text-slate-700 text-xs py-2 border-b border-slate-200">
        <div className="container mx-auto px-6 lg:px-12 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-slate-700 font-medium">
              <MapPin size={13} className="text-[#1B3A6B]" />
              Envíos y Muestras Físicas a Nivel Nacional (Colombia)
            </span>
            <span className="flex items-center gap-1.5 text-slate-600">
              <Clock size={13} className="text-[#1B3A6B]" />
              Atención Empresas: Lun - Vie 8:00 AM - 6:00 PM
            </span>
          </div>

          <div className="flex items-center gap-5">
            <a
              href={`https://wa.me/${COMPANY_INFO.whatsappNumber}?text=Hola%20Distripako,%20deseo%20asesoría%20sobre%20dotaciones`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-slate-900 hover:text-[#1B3A6B] font-bold transition-colors"
            >
              <Phone size={13} className="text-[#1B3A6B]" />
              Línea Directa: {COMPANY_INFO.phone}
            </a>
            <span className="text-slate-300">|</span>
            <span className="text-slate-700 font-semibold flex items-center gap-1">
              <ShieldCheck size={14} className="text-emerald-600" />
              Garantía Textil Certificada
            </span>
          </div>
        </div>
      </div>

      {/* Main Nav Bar */}
      <nav
        className={`fixed top-0 lg:top-[37px] z-50 w-full transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 py-3 shadow-md backdrop-blur-md border-b border-slate-200/80 lg:top-0"
            : "bg-white py-4 lg:py-5 border-b border-slate-100 shadow-xs"
        }`}
      >
        <div className="container mx-auto flex items-center justify-between px-6 lg:px-12">
          {/* Brand Logo */}
          <Link href="/" className="group" onClick={() => setIsMenuOpen(false)}>
            <DistripakoLogo size="md" />
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium transition-colors hover:text-slate-950 text-slate-600 hover:font-bold relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#1B3A6B] hover:after:w-full after:transition-all after:duration-200"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Actions CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="#cotizador"
              className="relative inline-flex items-center gap-2.5 rounded-full bg-[#1B3A6B] hover:bg-[#2557A7] px-5 py-2.5 text-sm font-extrabold text-white shadow-md shadow-[#1B3A6B]/20 transition-all hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
            >
              <Calculator size={16} />
              <span>Cotizar en Línea</span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
            </a>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Abrir menú"
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-50 border border-slate-200 text-slate-900 lg:hidden hover:bg-slate-100 transition-colors"
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setIsMenuOpen(false)}
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 280, damping: 28 }}
              className="fixed right-0 top-0 z-50 h-full w-[85vw] max-w-[340px] lg:hidden flex flex-col overflow-y-auto bg-white shadow-2xl"
            >
              {/* Drawer Header */}
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <DistripakoLogo size="sm" />
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-slate-800"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Navigation Items */}
              <div className="p-5 space-y-1">
                <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Navegación Principal
                </p>
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-between px-3.5 py-3 rounded-xl text-slate-700 font-medium hover:bg-slate-100 hover:text-slate-950 transition-colors"
                  >
                    <span>{link.label}</span>
                    <ChevronRight size={16} className="text-slate-400" />
                  </a>
                ))}
              </div>

              {/* Quick Quote Highlight */}
              <div className="mx-5 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-[#1B3A6B]">
                  <Sparkles size={14} />
                  <span>Cotizador Inmediato</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Configura cantidades, tallas y bordado de tu empresa para obtener una estimación al instante.
                </p>
                <a
                  href="#cotizador"
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-center py-2.5 px-4 rounded-xl bg-[#1B3A6B] hover:bg-[#2557A7] text-white font-bold text-xs transition-colors shadow-sm"
                >
                  Iniciar Cotización
                </a>
              </div>

              {/* Footer Info */}
              <div className="mt-auto p-5 border-t border-slate-100 space-y-3 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Phone size={14} className="text-[#1B3A6B]" />
                  <span>{COMPANY_INFO.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-[#1B3A6B]" />
                  <span>{COMPANY_INFO.schedule}</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
