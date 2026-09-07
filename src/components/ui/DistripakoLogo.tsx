"use client";

import Image from "next/image";

interface DistripakoLogoProps {
  className?: string;
  variant?: "full" | "icon" | "horizontal";
  theme?: "light" | "dark";
  size?: "sm" | "md" | "lg" | "xl";
}

export default function DistripakoLogo({
  className = "",
  variant = "full",
  theme = "light",
  size = "md",
}: DistripakoLogoProps) {
  const isDark = theme === "dark";

  const sizeClasses = {
    sm: "h-8",
    md: "h-11",
    lg: "h-14",
    xl: "h-20",
  };

  if (variant === "icon") {
    return (
      <div className={`relative flex items-center justify-center ${sizeClasses[size]} aspect-square ${className}`}>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Main D Outer curve and left stem */}
          <path
            d="M 38 18 L 62 18 C 76 18 84 28 84 50 C 84 72 76 82 62 82 L 48 82 L 48 45 L 38 45 Z"
            fill={isDark ? "#FFFFFF" : "#0F1D36"}
          />
          {/* Inner D cutout */}
          <path
            d="M 52 28 L 61 28 C 70 28 74 36 74 50 C 74 64 70 72 61 72 L 52 72 Z"
            fill={isDark ? "#0F1D36" : "#FFFFFF"}
          />
          {/* Lower left vertical bar */}
          <rect x="38" y="45" width="10" height="37" fill={isDark ? "#FFFFFF" : "#0F1D36"} />
          {/* Horizontal gold accent bar */}
          <rect x="24" y="42" width="24" height="9" rx="1" fill="#1B3A6B" />
        </svg>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Distripako Vector Icon */}
      <div className={`relative flex items-center justify-center shrink-0 ${sizeClasses[size]} aspect-square`}>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
          {/* Background circle / container if needed */}
          <path
            d="M 36 18 L 62 18 C 76 18 85 28 85 50 C 85 72 76 82 62 82 L 46 82 L 46 44 L 36 44 Z"
            fill={isDark ? "#FFFFFF" : "#0F1D36"}
          />
          <path
            d="M 50 28 L 61 28 C 70 28 75 36 75 50 C 75 64 70 72 61 72 L 50 72 Z"
            fill={isDark ? "#091222" : "#FFFFFF"}
          />
          <rect x="36" y="44" width="10" height="38" fill={isDark ? "#FFFFFF" : "#0F1D36"} />
          {/* Distripako Signature Gold Bar */}
          <rect x="22" y="41" width="24" height="9" rx="1.5" fill="#1B3A6B" />
        </svg>
      </div>

      {/* Typography */}
      <div className="flex flex-col">
        <span
          className={`font-black tracking-[0.18em] leading-none ${
            size === "sm"
              ? "text-base tracking-[0.14em]"
              : size === "md"
              ? "text-xl"
              : size === "lg"
              ? "text-2xl tracking-[0.2em]"
              : "text-3xl tracking-[0.22em]"
          } ${isDark ? "text-white" : "text-[#0F1D36]"}`}
        >
          DISTRI<span className="text-[#1B3A6B]">PAKO</span>
        </span>
        <span
          className={`font-semibold uppercase tracking-[0.24em] ${
            size === "sm" ? "text-[8px]" : size === "md" ? "text-[9px]" : "text-[11px]"
          } ${isDark ? "text-slate-400" : "text-slate-500"} mt-1`}
        >
          Uniformes Industriales
        </span>
      </div>
    </div>
  );
}
