"use client";

import Link from "next/link";
import { Phone, Mail, MapPin, Clock, ShieldCheck, Heart } from "lucide-react";
import DistripakoLogo from "./DistripakoLogo";
import { COMPANY_INFO, CATEGORIES } from "@/src/data/uniforms-data";

export default function Footer() {
  return (
    <footer className="bg-white text-slate-700 pt-16 pb-12 border-t border-slate-200">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4 pb-14 border-b border-slate-200">
          {/* Brand Info */}
          <div className="space-y-5">
            <DistripakoLogo theme="light" size="md" />
            <p className="text-xs text-slate-600 leading-relaxed">
              Especialistas en dotación de uniformes industriales, ejecutivos, salud y gastronomía. Confección de alta durabilidad y bordado computarizado para empresas en toda Colombia.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#1B3A6B] font-bold">
              <ShieldCheck size={16} />
              <span>Garantía de Calidad Textil</span>
            </div>
          </div>

          {/* Catalog Categories */}
          <div>
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 mb-5">
              Líneas de Dotación
            </h4>
            <ul className="space-y-3 text-xs text-slate-600">
              {CATEGORIES.map((cat) => (
                <li key={cat.id}>
                  <a
                    href="#catalogo"
                    className="hover:text-[#1B3A6B] transition-colors"
                  >
                    {cat.name}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="#cotizador"
                  className="text-[#1B3A6B] font-extrabold hover:underline"
                >
                  Cotizador en Línea →
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 mb-5">
              Navegación
            </h4>
            <ul className="space-y-3 text-xs text-slate-600">
              <li>
                <a href="/" className="hover:text-slate-950 transition-colors">
                  Inicio
                </a>
              </li>
              <li>
                <a href="#catalogo" className="hover:text-slate-950 transition-colors">
                  Catálogo de Prendas
                </a>
              </li>
              <li>
                <a href="#cotizador" className="hover:text-slate-950 transition-colors">
                  Cotizar Pedido
                </a>
              </li>
              <li>
                <a href="#servicios" className="hover:text-slate-950 transition-colors">
                  Taller de Bordado
                </a>
              </li>
              <li>
                <a href="#nosotros" className="hover:text-slate-950 transition-colors">
                  Por qué Distripako
                </a>
              </li>
              <li>
                <a href="#contacto" className="hover:text-slate-950 transition-colors">
                  Contacto & Asesoría
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 mb-5">
              Atención Comercial
            </h4>
            <ul className="space-y-3 text-xs text-slate-600">
              <li className="flex items-start gap-2.5">
                <Phone size={15} className="text-[#1B3A6B] shrink-0 mt-0.5" />
                <div>
                  <p className="text-slate-900 font-bold">{COMPANY_INFO.phone}</p>
                  <p className="text-[11px] text-slate-500">Línea directa y WhatsApp</p>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail size={15} className="text-[#1B3A6B] shrink-0 mt-0.5" />
                <span>{COMPANY_INFO.email}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin size={15} className="text-[#1B3A6B] shrink-0 mt-0.5" />
                <span>{COMPANY_INFO.address}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock size={15} className="text-[#1B3A6B] shrink-0 mt-0.5" />
                <span>{COMPANY_INFO.schedule}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>
            © {new Date().getFullYear()} {COMPANY_INFO.name}. Todos los derechos reservados.
          </p>
          <p className="flex items-center gap-1 font-medium">
            Dotaciones y Confección Textil Profesional para Empresas
          </p>
        </div>
      </div>
    </footer>
  );
}
