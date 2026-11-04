"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Coins, TrendingUp, ShieldCheck, Dumbbell, Layers } from "lucide-react";

interface VerticalSwitcherProps {
  currentVertical?: "credito" | "inversiones" | "seguros" | "fit" | "hub";
}

export default function VerticalSwitcher({ currentVertical }: VerticalSwitcherProps) {
  const pathname = usePathname();

  const verticals = [
    {
      key: "hub",
      name: "Ecosistema Hub",
      href: "/",
      icon: Layers,
      activeClass: "bg-sky-50 text-sky-900 border-sky-300 shadow-sm ring-2 ring-sky-500/20 font-bold",
      pillClass: "text-sky-600",
      comingSoon: false,
    },
    {
      key: "credito",
      name: "Crédito",
      href: "/?vertical=credito",
      icon: Coins,
      activeClass: "bg-emerald-50 text-emerald-900 border-emerald-300 shadow-sm ring-2 ring-emerald-500/20 font-bold",
      pillClass: "text-emerald-600",
      comingSoon: false,
    },
    {
      key: "inversiones",
      name: "Inversiones",
      href: "/?vertical=inversiones",
      icon: TrendingUp,
      activeClass: "bg-indigo-50 text-indigo-900 border-indigo-300 shadow-sm ring-2 ring-indigo-500/20 font-bold",
      pillClass: "text-indigo-600",
      comingSoon: false,
    },
    {
      key: "seguros",
      name: "Seguros",
      href: "/?vertical=seguros",
      icon: ShieldCheck,
      activeClass: "bg-sky-50 text-sky-900 border-sky-300 shadow-sm ring-2 ring-sky-500/20 font-bold",
      pillClass: "text-sky-600",
      comingSoon: false,
    },
    {
      key: "fit",
      name: "Productos Fit",
      href: "/?vertical=fit",
      icon: Dumbbell,
      activeClass: "bg-amber-50 text-amber-950 border-amber-300 shadow-sm ring-2 ring-amber-500/20 font-bold",
      pillClass: "text-amber-600",
      comingSoon: false,
    },
  ];

  return (
    <div className="w-full flex items-center justify-center my-4">
      <div className="inline-flex items-center gap-1.5 p-1.5 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-lg shadow-slate-200/50 overflow-x-auto max-w-full no-scrollbar">
        {verticals.map((v) => {
          const isActive =
            currentVertical === v.key ||
            (currentVertical === undefined && (v.key === "hub" ? pathname === "/" : pathname?.startsWith(v.href)));
          const Icon = v.icon;

          return (
            <Link
              key={v.key}
              href={v.href}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 border whitespace-nowrap ${
                isActive
                  ? `${v.activeClass} scale-[1.02]`
                  : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 hover:scale-[1.01]"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? v.pillClass : "text-slate-400"}`} />
              <span>{v.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
