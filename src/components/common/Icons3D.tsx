"use client";

import React from "react";

interface Icon3DProps {
  width?: number | string;
  height?: number | string;
  className?: string;
}

// 1. Crédito Empresarial & Liquidez: Tarjetas 3D Isométricas Clay con Chip Dorado + Moneda
export function Finance3DVault({ width = 135, height = 110, className = "" }: Icon3DProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 160 130" fill="none" xmlns="http://www.w3.org/2000/svg" className={`drop-shadow-xl select-none ${className}`}>
      <defs>
        <linearGradient id="c3d-card-front-top" x1="20" y1="20" x2="130" y2="100" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7DD3FC" />
          <stop offset="0.6" stopColor="#38BDF8" />
          <stop offset="1" stopColor="#0284C7" />
        </linearGradient>
        <linearGradient id="c3d-card-front-side" x1="0" y1="0" x2="0" y2="20" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0369A1" />
          <stop offset="1" stopColor="#075985" />
        </linearGradient>
        <linearGradient id="c3d-card-back-top" x1="40" y1="0" x2="140" y2="70" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FEF08A" />
          <stop offset="0.5" stopColor="#FACC15" />
          <stop offset="1" stopColor="#EAB308" />
        </linearGradient>
        <linearGradient id="c3d-card-back-side" x1="0" y1="0" x2="0" y2="20" gradientUnits="userSpaceOnUse">
          <stop stopColor="#CA8A04" />
          <stop offset="1" stopColor="#A16207" />
        </linearGradient>
        <linearGradient id="c3d-coin-face" x1="0" y1="0" x2="30" y2="30" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FEF08A" />
          <stop offset="0.5" stopColor="#FACC15" />
          <stop offset="1" stopColor="#D97706" />
        </linearGradient>
        <filter id="c3d-clay-shadow" x="0" y="0" width="160" height="130" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="12" stdDeviation="8" floodColor="#0284C7" floodOpacity="0.28" />
        </filter>
      </defs>

      <g filter="url(#c3d-clay-shadow)">
        <g transform="translate(32, 6) rotate(-14) skewX(-12)">
          <rect x="0" y="10" width="88" height="54" rx="14" fill="url(#c3d-card-back-side)" />
          <rect x="0" y="0" width="88" height="54" rx="14" fill="url(#c3d-card-back-top)" stroke="#FEF08A" strokeWidth="1.5" />
          <rect x="0" y="12" width="88" height="10" fill="#B45309" opacity="0.85" />
        </g>

        <g transform="translate(14, 28) rotate(-10) skewX(-10)">
          <rect x="0" y="9" width="94" height="60" rx="16" fill="url(#c3d-card-front-side)" />
          <rect x="0" y="0" width="94" height="60" rx="16" fill="url(#c3d-card-front-top)" stroke="#BAE6FD" strokeWidth="2" />

          <g transform="translate(12, 12)">
            <rect x="0" y="2" width="15" height="13" rx="3.5" fill="#CA8A04" />
            <rect x="0" y="0" width="15" height="13" rx="3.5" fill="#FDE047" stroke="#FEF08A" strokeWidth="1" />
            <line x1="0" y1="6.5" x2="15" y2="6.5" stroke="#B45309" strokeWidth="1" />
            <line x1="7.5" y1="0" x2="7.5" y2="13" stroke="#B45309" strokeWidth="1" />
          </g>

          <g transform="translate(62, 12)">
            <circle cx="8" cy="8" r="7.5" fill="#FACC15" opacity="0.95" />
            <circle cx="17" cy="8" r="7.5" fill="#FFFFFF" opacity="0.85" />
          </g>

          <rect x="12" y="34" width="22" height="4" rx="2" fill="#FFFFFF" opacity="0.9" />
          <rect x="38" y="34" width="22" height="4" rx="2" fill="#FFFFFF" opacity="0.9" />
          <rect x="12" y="44" width="34" height="3.5" rx="1.75" fill="#E0F2FE" opacity="0.8" />
        </g>

        <g transform="translate(86, 68)">
          <circle cx="20" cy="24" r="19" fill="#B45309" />
          <circle cx="20" cy="20" r="19" fill="url(#c3d-coin-face)" stroke="#FEF08A" strokeWidth="2" />
          <circle cx="20" cy="20" r="14" fill="#EAB308" stroke="#CA8A04" strokeWidth="1.5" />
          <text x="14" y="27" fontSize="19" fontWeight="900" fill="#FFFFFF" className="drop-shadow-xs">$</text>
        </g>
      </g>
    </svg>
  );
}

// 2. Seguros Todo Riesgo: Escudo 3D Clay con Borde Grueso y Checkmark Blanco en Relieve
export function Insurance3DShield({ width = 80, height = 74, className = "" }: Icon3DProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 90 84" fill="none" xmlns="http://www.w3.org/2000/svg" className={`drop-shadow-lg select-none ${className}`}>
      <defs>
        <linearGradient id="c3d-shield-clay-face" x1="10" y1="6" x2="80" y2="76" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7DD3FC" />
          <stop offset="0.5" stopColor="#38BDF8" />
          <stop offset="1" stopColor="#0284C7" />
        </linearGradient>
        <linearGradient id="c3d-shield-clay-side" x1="0" y1="0" x2="0" y2="80" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0369A1" />
          <stop offset="1" stopColor="#075985" />
        </linearGradient>
      </defs>

      <path
        d="M45 16L78 28V52C78 68 64 80 45 86C26 80 12 68 12 52V28L45 16Z"
        fill="url(#c3d-shield-clay-side)"
      />

      <path
        d="M45 8L78 20V44C78 60 64 72 45 78C26 72 12 60 12 44V20L45 8Z"
        fill="url(#c3d-shield-clay-face)"
        stroke="#BAE6FD"
        strokeWidth="3"
      />

      <path
        d="M45 14L72 24V43C72 56 60 66 45 71C30 66 18 56 18 43V24L45 14Z"
        stroke="#0284C7"
        strokeWidth="2.5"
        fill="none"
        opacity="0.4"
      />

      <path
        d="M31 43L41 53L60 33"
        stroke="#0284C7"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M31 40L41 50L60 30"
        stroke="#FFFFFF"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// 3. Inversiones: Ticket 3D con % en Relieve y Flecha de Rendimiento
export function Investment3DGrowth({ width = 84, height = 74, className = "" }: Icon3DProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 94 84" fill="none" xmlns="http://www.w3.org/2000/svg" className={`drop-shadow-lg select-none ${className}`}>
      <defs>
        <linearGradient id="c3d-ticket-face" x1="10" y1="10" x2="80" y2="70" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7DD3FC" />
          <stop offset="0.5" stopColor="#38BDF8" />
          <stop offset="1" stopColor="#0284C7" />
        </linearGradient>
        <linearGradient id="c3d-ticket-side" x1="0" y1="0" x2="0" y2="60" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0369A1" />
          <stop offset="1" stopColor="#075985" />
        </linearGradient>
        <linearGradient id="c3d-gold-tab" x1="0" y1="0" x2="20" y2="20" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FEF08A" />
          <stop offset="1" stopColor="#EAB308" />
        </linearGradient>
      </defs>

      <g transform="translate(6, 12) rotate(-8)">
        <path
          d="M6 18C6 14 10 10 14 10H64C68 10 72 14 72 18V26C69 26 66 29 66 32C66 35 69 38 72 38V48C72 52 68 56 64 56H14C10 56 6 52 6 48V38C9 38 12 35 12 32C12 29 9 26 6 26V18Z"
          fill="url(#c3d-ticket-side)"
        />
        <path
          d="M6 10C6 6 10 2 14 2H64C68 2 72 6 72 10V18C69 18 66 21 66 24C66 27 69 30 72 30V40C72 44 68 48 64 48H14C10 48 6 44 6 40V30C9 30 12 27 12 24C12 21 9 18 6 18V10Z"
          fill="url(#c3d-ticket-face)"
          stroke="#BAE6FD"
          strokeWidth="2"
        />

        <path
          d="M56 2H64C68 2 72 6 72 10V18L56 2Z"
          fill="url(#c3d-gold-tab)"
        />

        <text
          x="28"
          y="34"
          fontSize="24"
          fontWeight="900"
          fill="#0369A1"
          opacity="0.3"
        >
          %
        </text>
        <text
          x="28"
          y="31"
          fontSize="24"
          fontWeight="900"
          fill="#FFFFFF"
          className="drop-shadow-xs"
        >
          %
        </text>
      </g>

      <g transform="translate(56, 6)">
        <circle cx="16" cy="16" r="14" fill="#FACC15" stroke="#FEF08A" strokeWidth="2" />
        <path d="M11 20L21 10M21 10H14M21 10V17" stroke="#713F12" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}

// 4. Salud & Vida: Hoja 3D Clay con Corazón Dorado y Checkmark
export function Health3DHeart({ width = 60, height = 60, className = "" }: Icon3DProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 76 76" fill="none" xmlns="http://www.w3.org/2000/svg" className={`drop-shadow-md select-none ${className}`}>
      <defs>
        <linearGradient id="c3d-doc-clay-face" x1="10" y1="10" x2="60" y2="70" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7DD3FC" />
          <stop offset="0.6" stopColor="#38BDF8" />
          <stop offset="1" stopColor="#0284C7" />
        </linearGradient>
        <linearGradient id="c3d-doc-clay-side" x1="0" y1="0" x2="0" y2="70" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0369A1" />
          <stop offset="1" stopColor="#075985" />
        </linearGradient>
        <linearGradient id="c3d-heart-gold" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FEF08A" />
          <stop offset="0.5" stopColor="#FACC15" />
          <stop offset="1" stopColor="#EAB308" />
        </linearGradient>
      </defs>

      <g transform="translate(10, 6) rotate(6)">
        <rect x="0" y="8" width="46" height="58" rx="14" fill="url(#c3d-doc-clay-side)" />
        <rect x="0" y="0" width="46" height="58" rx="14" fill="url(#c3d-doc-clay-face)" stroke="#BAE6FD" strokeWidth="2" />

        <g transform="translate(13, 8)">
          <path
            d="M10 18C10 18 2 13 2 7C2 4.5 4 2.5 6.5 2.5C8 2.5 9.5 3.5 10 4.5C10.5 3.5 12 2.5 13.5 2.5C16 2.5 18 4.5 18 7C18 13 10 18 10 18Z"
            fill="#B45309"
            transform="translate(0, 2)"
          />
          <path
            d="M10 18C10 18 2 13 2 7C2 4.5 4 2.5 6.5 2.5C8 2.5 9.5 3.5 10 4.5C10.5 3.5 12 2.5 13.5 2.5C16 2.5 18 4.5 18 7C18 13 10 18 10 18Z"
            fill="url(#c3d-heart-gold)"
            stroke="#FEF08A"
            strokeWidth="1.5"
          />
        </g>

        <rect x="10" y="32" width="26" height="3" rx="1.5" fill="#FFFFFF" opacity="0.9" />
        <rect x="10" y="38" width="18" height="3" rx="1.5" fill="#E0F2FE" opacity="0.8" />

        <g transform="translate(24, 42)">
          <circle cx="8" cy="8" r="8" fill="#0369A1" />
          <circle cx="8" cy="6" r="8" fill="#38BDF8" stroke="#FFFFFF" strokeWidth="1.5" />
          <path d="M5 6L7 8L11 4" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </g>
    </svg>
  );
}

// 5. Póliza Autos: Camioneta / Vehículo 3D Clay Isométrico
export function Car3DAuto({ width = 64, height = 60, className = "" }: Icon3DProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 76 70" fill="none" xmlns="http://www.w3.org/2000/svg" className={`drop-shadow-md select-none ${className}`}>
      <defs>
        <linearGradient id="c3d-van-blue" x1="0" y1="10" x2="60" y2="50" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7DD3FC" />
          <stop offset="0.6" stopColor="#38BDF8" />
          <stop offset="1" stopColor="#0284C7" />
        </linearGradient>
        <linearGradient id="c3d-van-gold" x1="0" y1="10" x2="30" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FEF08A" />
          <stop offset="0.5" stopColor="#FACC15" />
          <stop offset="1" stopColor="#EAB308" />
        </linearGradient>
      </defs>

      <g transform="translate(6, 6)">
        <ellipse cx="32" cy="52" rx="28" ry="7" fill="#0284C7" opacity="0.2" />

        <rect x="4" y="16" width="34" height="28" rx="8" fill="#0369A1" />
        <rect x="4" y="12" width="34" height="28" rx="8" fill="url(#c3d-van-blue)" stroke="#BAE6FD" strokeWidth="1.5" />

        <path
          d="M34 22C34 18 37 16 41 16H47C53 16 58 21 58 27V38C58 41 55 44 52 44H34V22Z"
          fill="#CA8A04"
          transform="translate(0, 3)"
        />
        <path
          d="M34 22C34 18 37 16 41 16H47C53 16 58 21 58 27V38C58 41 55 44 52 44H34V22Z"
          fill="url(#c3d-van-gold)"
          stroke="#FEF08A"
          strokeWidth="1.5"
        />

        <path
          d="M40 20H46C49 20 52 23 52 26V30H38V22C38 21 39 20 40 20Z"
          fill="#F0F9FF"
          stroke="#0284C7"
          strokeWidth="1.2"
        />

        <circle cx="56" cy="34" r="2.5" fill="#FFFFFF" />

        <circle cx="16" cy="44" r="7.5" fill="#0C4A6E" />
        <circle cx="16" cy="43" r="5" fill="#38BDF8" stroke="#BAE6FD" strokeWidth="1.5" />

        <circle cx="46" cy="44" r="7.5" fill="#0C4A6E" />
        <circle cx="46" cy="43" r="5" fill="#38BDF8" stroke="#BAE6FD" strokeWidth="1.5" />
      </g>
    </svg>
  );
}

// 6. Cumplimiento & Licitaciones: Roseta / Sello Festoneado 3D con Checkmark
export function Contract3DSeal({ width = 60, height = 60, className = "" }: Icon3DProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 76 76" fill="none" xmlns="http://www.w3.org/2000/svg" className={`drop-shadow-md select-none ${className}`}>
      <defs>
        <linearGradient id="c3d-rosette-face" x1="10" y1="10" x2="65" y2="65" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7DD3FC" />
          <stop offset="0.5" stopColor="#38BDF8" />
          <stop offset="1" stopColor="#0284C7" />
        </linearGradient>
        <linearGradient id="c3d-rosette-side" x1="0" y1="0" x2="0" y2="70" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0369A1" />
          <stop offset="1" stopColor="#075985" />
        </linearGradient>
      </defs>

      <g transform="translate(5, 5)">
        <path
          d="M33 4C35 4 37 5 38 7L41 10C42 11 44 12 46 12L50 12C52 12 54 14 55 16L56 20C57 22 58 24 60 25L63 28C64 30 65 32 64 34L63 38C62 40 62 42 63 44L64 48C65 50 64 52 63 54L60 56C58 57 57 59 56 61L55 65C54 67 52 68 50 68L46 68C44 69 42 70 41 71L38 74C37 75 35 76 33 76C31 76 29 75 28 74L25 71C24 70 22 69 20 68L16 68C14 68 12 67 11 65L10 61C9 59 8 57 6 56L3 54C2 52 1 50 2 48L3 44C4 42 4 40 3 38L2 34C1 32 2 30 3 28L6 25C8 24 9 22 10 20L11 16C12 14 14 12 16 12L20 12C22 12 24 11 25 10L28 7C29 5 31 4 33 4Z"
          fill="url(#c3d-rosette-side)"
          transform="translate(0, 5)"
        />

        <path
          d="M33 4C35 4 37 5 38 7L41 10C42 11 44 12 46 12L50 12C52 12 54 14 55 16L56 20C57 22 58 24 60 25L63 28C64 30 65 32 64 34L63 38C62 40 62 42 63 44L64 48C65 50 64 52 63 54L60 56C58 57 57 59 56 61L55 65C54 67 52 68 50 68L46 68C44 69 42 70 41 71L38 74C37 75 35 76 33 76C31 76 29 75 28 74L25 71C24 70 22 69 20 68L16 68C14 68 12 67 11 65L10 61C9 59 8 57 6 56L3 54C2 52 1 50 2 48L3 44C4 42 4 40 3 38L2 34C1 32 2 30 3 28L6 25C8 24 9 22 10 20L11 16C12 14 14 12 16 12L20 12C22 12 24 11 25 10L28 7C29 5 31 4 33 4Z"
          fill="url(#c3d-rosette-face)"
          stroke="#BAE6FD"
          strokeWidth="2.5"
        />

        <path
          d="M23 40L31 48L46 30"
          stroke="#0369A1"
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
          transform="translate(0, 3)"
        />
        <path
          d="M23 40L31 48L46 30"
          stroke="#FFFFFF"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

// 7. Viabilidad Express 24h: Estrella 3D Puffy Dorada con Insignia
export function Lightning3DExpress({ width = 60, height = 60, className = "" }: Icon3DProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 76 76" fill="none" xmlns="http://www.w3.org/2000/svg" className={`drop-shadow-md select-none ${className}`}>
      <defs>
        <linearGradient id="c3d-star-gold-face" x1="15" y1="10" x2="60" y2="65" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FEF08A" />
          <stop offset="0.4" stopColor="#FACC15" />
          <stop offset="1" stopColor="#EAB308" />
        </linearGradient>
        <linearGradient id="c3d-star-gold-side" x1="0" y1="0" x2="0" y2="70" gradientUnits="userSpaceOnUse">
          <stop stopColor="#CA8A04" />
          <stop offset="1" stopColor="#854D0E" />
        </linearGradient>
      </defs>

      <g transform="translate(6, 6)">
        <path
          d="M48 6L51 14L59 15L53 21L55 29L47 25L40 29L41 21L36 15L44 14L48 6Z"
          fill="#38BDF8"
          stroke="#BAE6FD"
          strokeWidth="1.5"
          className="drop-shadow-xs"
        />

        <path
          d="M28 8C29 6 32 6 33 8L38 18C39 19 40 20 42 20L53 22C55 22 56 25 54 27L46 35C45 36 45 38 45 39L47 50C48 52 45 54 43 53L33 48C32 47 30 47 28 48L19 53C17 54 15 52 15 50L17 39C17 38 17 36 16 35L8 27C7 25 7 22 10 22L20 20C22 20 23 19 24 18L28 8Z"
          fill="url(#c3d-star-gold-side)"
          transform="translate(0, 5)"
        />

        <path
          d="M28 8C29 6 32 6 33 8L38 18C39 19 40 20 42 20L53 22C55 22 56 25 54 27L46 35C45 36 45 38 45 39L47 50C48 52 45 54 43 53L33 48C32 47 30 47 28 48L19 53C17 54 15 52 15 50L17 39C17 38 17 36 16 35L8 27C7 25 7 22 10 22L20 20C22 20 23 19 24 18L28 8Z"
          fill="url(#c3d-star-gold-face)"
          stroke="#FEF08A"
          strokeWidth="2.5"
        />

        <g transform="translate(23, 20)">
          <polygon
            points="12,2 4,13 10,13 7,22 17,9 11,9"
            fill="#0369A1"
            transform="translate(0, 1.5)"
          />
          <polygon
            points="12,2 4,13 10,13 7,22 17,9 11,9"
            fill="#FFFFFF"
            stroke="#38BDF8"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
        </g>
      </g>
    </svg>
  );
}
