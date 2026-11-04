"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  Lock,
  FileText,
  Calendar,
} from "lucide-react";
import { ECOSYSTEM_INFO } from "@/src/config/verticals";
import { VerticalKey } from "@/src/types/common";

export default function Footer() {
  const openModal = (vertical: VerticalKey) => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("open-vertical-modal", { detail: { vertical } })
      );
    }
  };

  return (
    <footer className="w-full bg-slate-50 border-t border-slate-200 text-slate-600 text-sm">
      {/* Top Banner / Institutional Trust */}
      <div className="border-b border-slate-200 py-6 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Seguridad & Encriptación Institucional
              </p>
              <p className="text-xs text-slate-500">
                Tus datos financieros y transacciones se protegen bajo protocolos TLS 1.3 y reglas de seguridad en la nube.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs text-slate-600 font-medium">
            <span className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-slate-500" />
              <span>Protección de Datos (Habeas Data)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              <span>Cumplimiento Normativo Vigente</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Corporate Info */}
          <div className="lg:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="Next Connection Group"
                width={100}
                height={34}
                className="h-8 w-auto object-contain"
              />
              <span className="font-extrabold text-slate-900 text-sm tracking-wide">
                Next Connection
              </span>
            </div>
            <p className="text-xs leading-relaxed text-slate-500">
              Ecosistema empresarial de servicios financieros y de bienestar. Líneas de crédito, fondos de inversión, pólizas y nutrición deportiva en una sola plataforma.
            </p>

            <div className="space-y-2 text-xs text-slate-600 font-medium">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{ECOSYSTEM_INFO.contact.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{ECOSYSTEM_INFO.contact.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{ECOSYSTEM_INFO.contact.address}</span>
              </div>
            </div>
          </div>

          {/* Soluciones: Crédito */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" />
              Crédito
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <button
                  type="button"
                  onClick={() => openModal("credito")}
                  className="hover:text-slate-900 transition-colors text-left"
                >
                  Libre Inversión y Personal
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => openModal("credito")}
                  className="hover:text-slate-900 transition-colors text-left"
                >
                  Crédito Comercial y PyME
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => openModal("credito")}
                  className="hover:text-slate-900 transition-colors text-left"
                >
                  Libranza Institucional
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => openModal("credito")}
                  className="hover:text-slate-900 transition-colors text-left"
                >
                  Financiación con Respaldo
                </button>
              </li>
            </ul>
          </div>

          {/* Soluciones: Inversiones */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-600 inline-block" />
              Inversiones
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <button
                  type="button"
                  onClick={() => openModal("inversiones")}
                  className="hover:text-slate-900 transition-colors text-left"
                >
                  Fondo Renta Conservadora
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => openModal("inversiones")}
                  className="hover:text-slate-900 transition-colors text-left"
                >
                  Fondo Crecimiento Moderado
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => openModal("inversiones")}
                  className="hover:text-slate-900 transition-colors text-left"
                >
                  Portafolio Dinámico & Alto Rendimiento
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => openModal("inversiones")}
                  className="hover:text-slate-900 transition-colors text-left"
                >
                  Estrategia de Interés Compuesto
                </button>
              </li>
            </ul>
          </div>

          {/* Soluciones: Seguros */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-sky-600 inline-block" />
              Seguros
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <button
                  type="button"
                  onClick={() => openModal("seguros")}
                  className="hover:text-slate-900 transition-colors text-left"
                >
                  Póliza de Salud Integral
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => openModal("seguros")}
                  className="hover:text-slate-900 transition-colors text-left"
                >
                  Seguro de Vida & Familia
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => openModal("seguros")}
                  className="hover:text-slate-900 transition-colors text-left"
                >
                  Póliza Vehicular Todo Riesgo
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => openModal("seguros")}
                  className="hover:text-slate-900 transition-colors text-left"
                >
                  Protección Integral Hogar
                </button>
              </li>
            </ul>
          </div>

          {/* Soluciones: Bienestar & Citas */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
              Bienestar & Citas
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <button
                  type="button"
                  onClick={() => openModal("fit")}
                  className="hover:text-slate-900 transition-colors text-left"
                >
                  Proteínas, Creatinas & Suplementación
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => openModal("fit")}
                  className="hover:text-slate-900 transition-colors text-left"
                >
                  Descuento Exclusivo (20% OFF)
                </button>
              </li>
              <li className="pt-2">
                <Link
                  href="/citas"
                  className="inline-flex items-center gap-1.5 font-bold text-slate-900 hover:text-slate-700 transition-colors"
                >
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span>Agendar Asesoría en Vivo</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Next Connection Group. Todos los derechos reservados.</p>
          <div className="flex items-center gap-6">
            <a
              href={ECOSYSTEM_INFO.adminPortalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-600 hover:text-slate-900 flex items-center gap-1 transition-colors font-semibold"
            >
              <span>Acceso Administrador</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span className="text-slate-300">•</span>
            <span className="hover:text-slate-800 cursor-pointer">Términos y Condiciones</span>
            <span className="text-slate-300">•</span>
            <span className="hover:text-slate-800 cursor-pointer">Política de Privacidad</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
