"use client";

import React from "react";

export interface NextIndustrialGrowth3DProps {
  /** Normalized scroll progress from 0.0 to 1.0 */
  progress: number;
  /** Active scene index (0, 1, 2, 3) */
  activeScene: number;
  /** Reduced motion preference */
  reducedMotion?: boolean;
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

/**
 * Exact 30-degree Isometric Projection helper:
 * Converts 3D world coordinates (x: right-down, z: left-down, y: vertical up)
 * into 2D SVG canvas coordinates (px, py).
 */
const COS30 = 0.8660254;
const SIN30 = 0.5;

function iso(
  x: number,
  z: number,
  y: number = 0,
  originX: number = 480,
  originY: number = 320
): [number, number] {
  const px = originX + (x - z) * COS30;
  const py = originY + (x + z) * SIN30 - y;
  return [Number(px.toFixed(1)), Number(py.toFixed(1))];
}

function pts(coords: [number, number][]): string {
  return coords.map(([x, y]) => `${x},${y}`).join(" ");
}

/**
 * Renders a crisp 3D Isometric Prism (Box) with Top, Left, and Right shaded faces
 */
function IsoBox({
  x,
  z,
  y = 0,
  w,
  d,
  h,
  topColor,
  leftColor,
  rightColor,
  strokeColor,
  strokeWidth = 0.6,
  opacity = 1,
}: {
  x: number;
  z: number;
  y?: number;
  w: number;
  d: number;
  h: number;
  topColor: string;
  leftColor: string;
  rightColor: string;
  strokeColor?: string;
  strokeWidth?: number;
  opacity?: number;
}) {
  // 8 vertices of the isometric box
  const t00 = iso(x, z, y + h);
  const t10 = iso(x + w, z, y + h);
  const t11 = iso(x + w, z + d, y + h);
  const t01 = iso(x, z + d, y + h);

  const b10 = iso(x + w, z, y);
  const b11 = iso(x + w, z + d, y);
  const b01 = iso(x, z + d, y);

  return (
    <g opacity={opacity}>
      {/* Left Face (faces +z, along x from 0 to w at z+d) */}
      <polygon
        points={pts([t01, t11, b11, b01])}
        fill={leftColor}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
      {/* Right Face (faces +x, along z from 0 to d at x+w) */}
      <polygon
        points={pts([t10, t11, b11, b10])}
        fill={rightColor}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
      {/* Top Face */}
      <polygon
        points={pts([t00, t10, t11, t01])}
        fill={topColor}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
    </g>
  );
}

/**
 * Stylized Flat-Vector Isometric Person (Matches the editorial illustration reference)
 */
function IsoPerson({
  cx,
  cy,
  shirtColor = "#FFFFFF",
  pantsColor = "#1E293B",
  skinColor = "#F1C29D",
  hairColor = "#0F172A",
  facing = "right",
  hasTablet = false,
  hasLaptop = false,
  scale = 1,
}: {
  cx: number;
  cy: number;
  shirtColor?: string;
  pantsColor?: string;
  skinColor?: string;
  hairColor?: string;
  facing?: "right" | "left";
  hasTablet?: boolean;
  hasLaptop?: boolean;
  scale?: number;
}) {
  const flip = facing === "left" ? -1 : 1;
  return (
    <g transform={`translate(${cx}, ${cy}) scale(${flip * scale}, ${scale})`}>
      {/* Soft Floor Shadow under feet */}
      <ellipse cx="0" cy="2" rx="14" ry="7" fill="rgba(15, 36, 60, 0.14)" />

      {/* Shoes */}
      <ellipse cx="-5" cy="0" rx="5" ry="2.6" fill="#0F172A" />
      <ellipse cx="5" cy="2" rx="5" ry="2.6" fill="#0F172A" />

      {/* Trousers / Legs */}
      <path
        d="M-8,-36 L-2,-36 L-2,0 L-8,0 Z"
        fill={pantsColor}
      />
      <path
        d="M1,-36 L7,-36 L7,2 L1,2 Z"
        fill="#0F172A"
      />

      {/* Torso / Shirt */}
      <path
        d="M-10,-72 C-10,-75 9,-75 10,-72 L9,-35 L-9,-35 Z"
        fill={shirtColor}
        stroke="#CBD5E1"
        strokeWidth="0.8"
      />

      {/* NEXT Sky-Blue Collar / Tie Accent */}
      <path d="M-2,-72 L3,-72 L2,-54 L-1,-54 Z" fill="#0EA5E9" />

      {/* Head & Neck */}
      <rect x="-3" y="-80" width="6" height="9" rx="2" fill={skinColor} />
      <circle cx="1" cy="-86" r="8.5" fill={skinColor} />

      {/* Sculpted Flat-Vector Hair */}
      <path
        d="M-8,-88 C-8,-97 9,-98 10,-88 C10,-84 7,-83 4,-85 C0,-87 -4,-84 -7,-82 Z"
        fill={hairColor}
      />

      {/* Extended Arm + Tablet / Laptop */}
      <path
        d="M4,-67 L17,-55 L12,-49 L1,-59 Z"
        fill={skinColor}
      />
      {hasTablet && (
        <polygon
          points="15,-66 26,-60 23,-45 12,-51"
          fill="#0F243C"
          stroke="#38BDF8"
          strokeWidth="1.5"
        />
      )}
      {hasLaptop && (
        <g transform="translate(10, -54)">
          <polygon points="0,0 14,6 22,1 8,-5" fill="#CBD5E1" />
          <polygon points="14,6 16,-8 24,-13 22,1" fill="#0EA5E9" />
        </g>
      )}
    </g>
  );
}

/**
 * Upright Isometric Card / Product traveling along the diagonal conveyor belt
 * (Matches the upright cards with avatar, bars & checkmark in the reference image)
 */
function ConveyorIsoCard({
  x,
  z,
  y,
  status = "approved",
  accent = "#10B981",
}: {
  x: number;
  z: number;
  y: number;
  status?: "approved" | "processing";
  accent?: string;
}) {
  // Upright card aligned along the x-axis of the conveyor belt
  const pTopLeft = iso(x, z, y + 48);
  const pTopRight = iso(x + 28, z, y + 48);
  const pBotRight = iso(x + 28, z, y);
  const pBotLeft = iso(x, z, y);

  // Back thickness offset
  const pBackTopLeft = iso(x, z - 4, y + 48);
  const pBackTopRight = iso(x + 28, z - 4, y + 48);
  const pBackBotRight = iso(x + 28, z - 4, y);

  const badgePos = iso(x + 14, z + 2, y + 12);
  const headerTopLeft = iso(x + 4, z + 1, y + 42);
  const headerTopRight = iso(x + 24, z + 1, y + 42);
  const headerBotRight = iso(x + 24, z + 1, y + 25);
  const headerBotLeft = iso(x + 4, z + 1, y + 25);

  return (
    <g>
      {/* Card 3D Side Thickness */}
      <polygon
        points={pts([pTopLeft, pBackTopLeft, pBackTopRight, pTopRight])}
        fill="#CBD5E1"
      />
      <polygon
        points={pts([pTopRight, pBackTopRight, pBackBotRight, pBotRight])}
        fill="#94A3B8"
      />

      {/* Main Upright Card Face */}
      <polygon
        points={pts([pTopLeft, pTopRight, pBotRight, pBotLeft])}
        fill="#FFFFFF"
        stroke="#0F243C"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      {/* Inner Dark Teal/Navy Profile Window */}
      <polygon
        points={pts([
          headerTopLeft,
          headerTopRight,
          headerBotRight,
          headerBotLeft,
        ])}
        fill="#0E7490"
      />

      {/* Circular Status Badge (Green Checkmark or Gold NEXT Star) */}
      <circle
        cx={badgePos[0]}
        cy={badgePos[1]}
        r="7.5"
        fill={status === "approved" ? accent : "#F59E0B"}
        stroke="#FFFFFF"
        strokeWidth="1.5"
      />
      <path
        d={`M${badgePos[0] - 3},${badgePos[1]} L${badgePos[0] - 0.5},${
          badgePos[1] + 2.5
        } L${badgePos[0] + 3.5},${badgePos[1] - 2.5}`}
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  );
}

/**
 * Overhead Isometric Robotic Claw / Gripper mounted on the gantry rail
 */
function IsoRoboticGripper({
  x,
  z,
  y,
  dipOffset = 0,
}: {
  x: number;
  z: number;
  y: number;
  dipOffset?: number;
}) {
  const [px, py] = iso(x, z, y - dipOffset);
  return (
    <g transform={`translate(${px}, ${py})`}>
      {/* Vertical Pneumatic Cylinder */}
      <rect
        x="-3.5"
        y="-24"
        width="7"
        height={20 + dipOffset}
        rx="2"
        fill="#64748B"
      />
      {/* Gripper Housing Block */}
      <polygon
        points="-9,-4 9,-4 12,4 -12,4"
        fill="#334155"
        stroke="#E2E8F0"
        strokeWidth="0.8"
      />
      {/* Left & Right Mechanical Claws */}
      <path
        d="M-8,4 L-12,12 L-6,17"
        fill="none"
        stroke="#475569"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8,4 L12,12 L6,17"
        fill="none"
        stroke="#475569"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Glowing Cyan Indicator LED */}
      <circle cx="0" cy="0" r="2.2" fill="#38BDF8" />
    </g>
  );
}

export default function NextIndustrialGrowth3D({
  progress,
}: NextIndustrialGrowth3DProps) {
  const p = clamp(progress, 0, 1);

  // Stage activation weights (0.0 -> 1.0)
  // Stage 1 (0-25%): Left Pedestal, Entrepreneur & Processing Portal Machine
  // Stage 2 (25-50%): Diagonal Conveyor Belt, Scanner Beam, Robotic Claws & NEXT Cards
  // Stage 3 (50-75%): Upper Digital Control Platform, Specialist & Giant Browser Screen
  // Stage 4 (75-100%): Right Consolidated Industry Platform, 3D Bar Charts & 6 Dashboard Screens
  const s1Weight = smoothstep(0.0, 0.15, p);
  const s2Weight = smoothstep(0.18, 0.45, p);
  const s3Weight = smoothstep(0.45, 0.72, p);
  const s4Weight = smoothstep(0.7, 0.96, p);

  // Scroll-scrubbed conveyor offset (also combined with CSS continuous flow)
  const beltCards = [0, 1, 2, 3, 4, 5];

  return (
    <div className="w-full h-full flex items-center justify-center bg-white relative overflow-hidden select-none">
      <style>{`
        @keyframes isoFloatSlow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-7px); }
        }
        @keyframes isoFloatAlt {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(6px); }
        }
        @keyframes isoClawWork {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(8px); }
        }
        @keyframes isoScanPulse {
          0%, 100% { opacity: 0.45; }
          50% { opacity: 0.88; }
        }
        @keyframes isoDashFlow {
          to { stroke-dashoffset: -48; }
        }
        .anim-iso-float {
          animation: isoFloatSlow 4.2s ease-in-out infinite;
        }
        .anim-iso-float-alt {
          animation: isoFloatAlt 3.8s ease-in-out infinite;
        }
        .anim-iso-claw-1 {
          animation: isoClawWork 2.4s ease-in-out infinite;
        }
        .anim-iso-claw-2 {
          animation: isoClawWork 2.4s ease-in-out 0.8s infinite;
        }
        .anim-iso-claw-3 {
          animation: isoClawWork 2.4s ease-in-out 1.6s infinite;
        }
        .anim-iso-scan {
          animation: isoScanPulse 2s ease-in-out infinite;
        }
        .anim-iso-wire {
          animation: isoDashFlow 2.2s linear infinite;
        }
      `}</style>

      <svg
        viewBox="0 0 960 640"
        className="w-full h-full max-h-[560px]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Vertical Warm/Sky Light Beam Gradient above Processing Machine */}
          <linearGradient id="beamGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.0" />
            <stop offset="45%" stopColor="#BAE6FD" stopOpacity="0.32" />
            <stop offset="100%" stopColor="#FDE68A" stopOpacity="0.55" />
          </linearGradient>

          {/* Scanner Golden/Cyan Laser Beam Gradient */}
          <linearGradient id="scannerBeam" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#FDE68A" stopOpacity="0.05" />
          </linearGradient>

          {/* Soft Isometric Drop Shadow Filter */}
          <filter id="isoShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow
              dx="0"
              dy="10"
              stdDeviation="8"
              floodColor="#0F243C"
              floodOpacity="0.12"
            />
          </filter>
        </defs>

        {/* ================================================================ */}
        {/* FLOOR DATA CIRCUIT WIRES CONNECTING THE 4 ISOMETRIC ZONES        */}
        {/* ================================================================ */}
        <g opacity={0.85}>
          {/* Wire 1: Left Pedestal to Processing Machine */}
          <path
            d="M 155 475 L 195 452 L 178 438 L 212 418"
            stroke="#94A3B8"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M 155 475 L 195 452 L 178 438 L 212 418"
            stroke="#0EA5E9"
            strokeWidth="2"
            strokeDasharray="6 6"
            className="anim-iso-wire"
          />

          {/* Wire 2: Conveyor Machine to Top-Center Control Pedestal */}
          <g opacity={s3Weight}>
            <path
              d="M 415 305 L 465 275 L 485 288 L 525 262"
              stroke="#94A3B8"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M 415 305 L 465 275 L 485 288 L 525 262"
              stroke="#0EA5E9"
              strokeWidth="2.2"
              strokeDasharray="6 6"
              className="anim-iso-wire"
            />
          </g>

          {/* Wire 3: Top-Center Control Pedestal to Right Consolidated Platform */}
          <g opacity={s4Weight}>
            <path
              d="M 555 278 L 605 308 L 580 325 L 650 368"
              stroke="#94A3B8"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M 555 278 L 605 308 L 580 325 L 650 368"
              stroke="#10B981"
              strokeWidth="2.2"
              strokeDasharray="6 6"
              className="anim-iso-wire"
            />
          </g>
        </g>

        {/* ================================================================ */}
        {/* ZONE 1 (0% – 25%): ENTREPRENEUR PEDESTAL & PROCESSING MACHINE    */}
        {/* ================================================================ */}
        <g opacity={Math.max(0.25, s1Weight)}>
          {/* Soft Floor Shadow under Left Pedestal */}
          <polygon
            points={pts([
              iso(-185, 115, -6),
              iso(-115, 115, -6),
              iso(-115, 185, -6),
              iso(-185, 185, -6),
            ])}
            fill="rgba(15, 36, 60, 0.1)"
          />

          {/* Left Isometric Pedestal for Entrepreneur */}
          <IsoBox
            x={-185}
            z={115}
            y={0}
            w={68}
            d={68}
            h={14}
            topColor="#F8FAFC"
            leftColor="#CBD5E1"
            rightColor="#94A3B8"
            strokeColor="#94A3B8"
          />
          <IsoBox
            x={-175}
            z={125}
            y={14}
            w={48}
            d={48}
            h={6}
            topColor="#FFFFFF"
            leftColor="#E2E8F0"
            rightColor="#CBD5E1"
          />

          {/* THE ENTREPRENEUR (Standing on Left Pedestal with Tablet) */}
          <IsoPerson
            cx={iso(-150, 150, 20)[0]}
            cy={iso(-150, 150, 20)[1]}
            shirtColor="#FFFFFF"
            pantsColor="#1E293B"
            facing="right"
            hasTablet={true}
          />

          {/* Isometric Stepped Base of Processing Portal Machine */}
          <IsoBox
            x={-155}
            z={5}
            y={0}
            w={95}
            d={95}
            h={38}
            topColor="#64748B"
            leftColor="#334155"
            rightColor="#475569"
          />
          {/* Teal/Cyan Main Processing Arch Machine (Matches reference image!) */}
          <IsoBox
            x={-135}
            z={12}
            y={38}
            w={75}
            d={78}
            h={105}
            topColor="#0F766E"
            leftColor="#0E7490"
            rightColor="#1E293B"
          />
          {/* Dark Control Console Screen & Keypad on Left Side of Machine */}
          <polygon
            points={pts([
              iso(-125, 91, 112),
              iso(-75, 91, 112),
              iso(-75, 91, 74),
              iso(-125, 91, 74),
            ])}
            fill="#1E293B"
            stroke="#38BDF8"
            strokeWidth="1.2"
          />
          {/* Control Keypad Slope */}
          <IsoBox
            x={-130}
            z={90}
            y={38}
            w={62}
            d={26}
            h={16}
            topColor="#0E7490"
            leftColor="#1E293B"
            rightColor="#0F172A"
          />

          {/* Vertical Glowing Light Column & Floating FinTech Icons Above Machine */}
          <g className="anim-iso-float">
            <polygon
              points="210,120 305,120 305,275 210,275"
              fill="url(#beamGrad)"
            />

            {/* Golden Envelope / Solicitud NEXT Card entering the Machine */}
            <g transform="translate(232, 222)">
              <rect
                x="0"
                y="0"
                width="52"
                height="34"
                rx="5"
                fill="#FBBF24"
                stroke="#F59E0B"
                strokeWidth="1.5"
              />
              <path
                d="M2,2 L26,19 L50,2"
                fill="none"
                stroke="#FEF3C7"
                strokeWidth="2.5"
              />
            </g>

            {/* Floating Social / Business Verification Bubbles (Exact match to reference!) */}
            {/* Teal Thumbs-Up Circle */}
            <g transform="translate(216, 178)">
              <circle cx="0" cy="0" r="16" fill="#0E7490" />
              <path
                d="M-4,2 L-4,-3 L0,-8 L3,-8 L2,-3 L7,-3 L6,5 L-2,5 Z"
                fill="#FFFFFF"
              />
            </g>

            {/* Orange User Profile Circle */}
            <g transform="translate(256, 148)">
              <circle cx="0" cy="0" r="18" fill="#F97316" />
              <circle cx="0" cy="-4" r="5" fill="#FFFFFF" />
              <path
                d="M-9,9 C-9,3 9,3 9,9 Z"
                fill="#FFFFFF"
              />
            </g>

            {/* Dark Slate User Circle */}
            <g transform="translate(258, 194)">
              <circle cx="0" cy="0" r="16" fill="#334155" />
              <circle cx="0" cy="-3.5" r="4.5" fill="#FFFFFF" />
              <path
                d="M-8,8 C-8,2.5 8,2.5 8,8 Z"
                fill="#FFFFFF"
              />
            </g>

            {/* Orange Speech Bubble with Heart / Approval */}
            <g transform="translate(278, 154)">
              <rect
                x="0"
                y="0"
                width="42"
                height="28"
                rx="6"
                fill="#F97316"
              />
              <polygon points="16,28 24,28 20,35" fill="#F97316" />
              <path
                d="M21,20 C21,20 13,14 13,9.5 C13,7 15,5.5 17.5,5.5 C19,5.5 20.5,6.5 21,8 C21.5,6.5 23,5.5 24.5,5.5 C27,5.5 29,7 29,9.5 C29,14 21,20 21,20 Z"
                fill="#FFFFFF"
              />
            </g>

            {/* Top Teal Badge */}
            <g transform="translate(268, 106)">
              <circle cx="0" cy="0" r="15" fill="#0284C7" />
              <path
                d="M-5,0 L-1,4 L6,-4"
                stroke="#FFFFFF"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          </g>
        </g>

        {/* ================================================================ */}
        {/* ZONE 2 (25% – 50%): DIAGONAL CONVEYOR BELT, SCANNER & CLAWS      */}
        {/* ================================================================ */}
        <g
          opacity={Math.max(0.18, s2Weight)}
          style={{
            transform: `translateY(${(1 - s2Weight) * 18}px)`,
            transition: "opacity 0.2s ease-out",
          }}
        >
          {/* Long Diagonal Isometric Conveyor Bed (x from -60 to +240, z from 20 to 80) */}
          <IsoBox
            x={-65}
            z={20}
            y={0}
            w={310}
            d={58}
            h={36}
            topColor="#F1F5F9"
            leftColor="#64748B"
            rightColor="#475569"
            strokeColor="#475569"
          />

          {/* Conveyor Belt Surface Track */}
          <IsoBox
            x={-60}
            z={27}
            y={36}
            w={300}
            d={44}
            h={4}
            topColor="#E2E8F0"
            leftColor="#94A3B8"
            rightColor="#64748B"
          />

          {/* Isometric Roller Lines along the Belt */}
          {[0, 1, 2, 3, 4, 5, 6].map((idx) => {
            const rx = -40 + idx * 42;
            const p1 = iso(rx, 27, 40.5);
            const p2 = iso(rx, 71, 40.5);
            return (
              <line
                key={idx}
                x1={p1[0]}
                y1={p1[1]}
                x2={p2[0]}
                y2={p2[1]}
                stroke="#CBD5E1"
                strokeWidth="1.5"
              />
            );
          })}

          {/* Upright NEXT Cards / Products traveling along the Conveyor Belt */}
          {beltCards.map((cIdx) => {
            // Position along belt shifted smoothly by scroll progress
            const shift = ((p * 3 + cIdx / beltCards.length) % 1) * 255;
            const cx = -45 + shift;
            const isApproved = shift > 55;
            return (
              <ConveyorIsoCard
                key={cIdx}
                x={cx}
                z={48}
                y={42}
                status={isApproved ? "approved" : "processing"}
                accent={cIdx % 2 === 0 ? "#10B981" : "#0EA5E9"}
              />
            );
          })}

          {/* Isometric Optical Scanner Camera & Overhead Gantry Rail */}
          {/* Rear Support Pillar for Scanner & Gantry */}
          <IsoBox
            x={15}
            z={-25}
            y={0}
            w={32}
            d={32}
            h={115}
            topColor="#E2E8F0"
            leftColor="#94A3B8"
            rightColor="#64748B"
          />
          {/* Scanner Camera Head pointing at the Belt */}
          <IsoBox
            x={-10}
            z={-5}
            y={98}
            w={46}
            d={26}
            h={22}
            topColor="#F8FAFC"
            leftColor="#CBD5E1"
            rightColor="#64748B"
          />

          {/* Glowing Golden/Cyan Optical Scanner Cone hitting the first Card */}
          <polygon
            points={pts([
              iso(-5, 18, 102),
              iso(18, 18, 102),
              iso(24, 52, 65),
              iso(-15, 52, 65),
            ])}
            fill="url(#scannerBeam)"
            className="anim-iso-scan"
          />

          {/* Overhead Gantry Rail Pipe carrying the 3 Robotic Claws */}
          <polyline
            points={pts([
              iso(35, -10, 106),
              iso(195, -10, 106),
              iso(195, 46, 106),
            ])}
            fill="none"
            stroke="#94A3B8"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <polyline
            points={pts([
              iso(45, 46, 106),
              iso(215, 46, 106),
            ])}
            fill="none"
            stroke="#64748B"
            strokeWidth="5"
            strokeLinecap="round"
          />

          {/* 3 Animated Robotic Grippers working over the Conveyor Belt */}
          <g className="anim-iso-claw-1">
            <IsoRoboticGripper x={65} z={46} y={102} />
          </g>
          <g className="anim-iso-claw-2">
            <IsoRoboticGripper x={125} z={46} y={102} />
          </g>
          <g className="anim-iso-claw-3">
            <IsoRoboticGripper x={185} z={46} y={102} />
          </g>

          {/* Teal Isometric Collection Crate at the Bottom-Right End of Conveyor */}
          <IsoBox
            x={235}
            z={14}
            y={0}
            w={78}
            d={72}
            h={54}
            topColor="#0F766E"
            leftColor="#0E7490"
            rightColor="#155E75"
            strokeColor="#083344"
          />
          {/* Inner Dark Recess of Collection Crate */}
          <polygon
            points={pts([
              iso(243, 22, 54),
              iso(305, 22, 54),
              iso(305, 78, 54),
              iso(243, 78, 54),
            ])}
            fill="#0F172A"
          />
          {/* Vertical Ventilation Slots on Crate Side */}
          {[0, 1, 2, 3].map((slot) => {
            const sx = 248 + slot * 14;
            const sTop = iso(sx, 86, 42);
            const sBot = iso(sx, 86, 14);
            return (
              <line
                key={slot}
                x1={sTop[0]}
                y1={sTop[1]}
                x2={sBot[0]}
                y2={sBot[1]}
                stroke="#0F172A"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            );
          })}
          {/* Processed NEXT Cards stacked neatly inside the Crate */}
          <ConveyorIsoCard x={250} z={58} y={32} status="approved" />
          <ConveyorIsoCard x={268} z={44} y={36} status="approved" />
        </g>

        {/* ================================================================ */}
        {/* ZONE 3 (50% – 75%): UPPER CONTROL PLATFORM & GIANT BROWSER UI    */}
        {/* ================================================================ */}
        <g
          opacity={Math.max(0.12, s3Weight)}
          style={{
            transform: `translateY(${(1 - s3Weight) * 24}px)`,
          }}
        >
          {/* Upper Isometric Pedestal */}
          <IsoBox
            x={-20}
            z={-185}
            y={0}
            w={76}
            d={76}
            h={16}
            topColor="#F8FAFC"
            leftColor="#CBD5E1"
            rightColor="#94A3B8"
          />

          {/* GIANT ISOMETRIC BROWSER / ERP DASHBOARD SCREEN (Matches top-center of reference!) */}
          <g className="anim-iso-float">
            {/* Screen Back Frame */}
            <polygon
              points={pts([
                iso(-15, -195, 195),
                iso(125, -195, 195),
                iso(125, -195, 35),
                iso(-15, -195, 35),
              ])}
              fill="#1E293B"
              stroke="#0F172A"
              strokeWidth="2"
            />
            {/* Screen White Canvas */}
            <polygon
              points={pts([
                iso(-10, -192, 190),
                iso(120, -192, 190),
                iso(120, -192, 40),
                iso(-10, -192, 40),
              ])}
              fill="#FFFFFF"
              stroke="#CBD5E1"
              strokeWidth="1"
            />
            {/* Browser Top Search Header Bar (Golden/Sky Accent) */}
            <polygon
              points={pts([
                iso(-10, -191, 190),
                iso(120, -191, 190),
                iso(120, -191, 168),
                iso(-10, -191, 168),
              ])}
              fill="#0284C7"
            />
            {/* Search Input Pill inside Browser Header */}
            <polygon
              points={pts([
                iso(-2, -190, 184),
                iso(95, -190, 184),
                iso(95, -190, 173),
                iso(-2, -190, 173),
              ])}
              fill="#FFFFFF"
            />
            {/* Content Skeleton Lines & Analytics Widget on Giant Screen */}
            {[0, 1, 2, 3, 4].map((ln) => (
              <line
                key={ln}
                x1={iso(0, -190, 152 - ln * 14)[0]}
                y1={iso(0, -190, 152 - ln * 14)[1]}
                x2={iso(68, -190, 152 - ln * 14)[0]}
                y2={iso(68, -190, 152 - ln * 14)[1]}
                stroke="#CBD5E1"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            ))}
            {/* Right Sidebar Widget inside Giant Screen */}
            <polygon
              points={pts([
                iso(78, -190, 156),
                iso(112, -190, 156),
                iso(112, -190, 92),
                iso(78, -190, 92),
              ])}
              fill="#E0F2FE"
              stroke="#38BDF8"
              strokeWidth="1"
            />
          </g>

          {/* Specialist with Laptop standing on the Upper Pedestal */}
          <IsoPerson
            cx={iso(18, -145, 16)[0]}
            cy={iso(18, -145, 16)[1]}
            shirtColor="#0E7490"
            pantsColor="#0F172A"
            facing="left"
            hasLaptop={true}
          />

          {/* Floating Translucent Holographic Bar-Chart Panel in front of Specialist */}
          <g className="anim-iso-float-alt">
            <polygon
              points={pts([
                iso(-55, -135, 118),
                iso(-5, -135, 118),
                iso(-5, -135, 68),
                iso(-55, -135, 68),
              ])}
              fill="rgba(251, 191, 36, 0.28)"
              stroke="#F59E0B"
              strokeWidth="1.2"
            />
            {/* 4 Mini Bars inside Hologram */}
            {[16, 26, 20, 34].map((bh, idx) => {
              const bx = -46 + idx * 10;
              const pTop = iso(bx, -134, 74 + bh);
              const pBot = iso(bx, -134, 74);
              return (
                <line
                  key={idx}
                  x1={pBot[0]}
                  y1={pBot[1]}
                  x2={pTop[0]}
                  y2={pTop[1]}
                  stroke="#FFFFFF"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              );
            })}
          </g>
        </g>

        {/* ================================================================ */}
        {/* ZONE 4 (75% – 100%): CONSOLIDATED PLATFORM, 3D BARS & DASHBOARDS */}
        {/* ================================================================ */}
        <g
          opacity={Math.max(0.1, s4Weight)}
          style={{
            transform: `translateY(${(1 - s4Weight) * 28}px)`,
          }}
        >
          {/* Large Executive Right Isometric Platform */}
          <IsoBox
            x={155}
            z={-155}
            y={0}
            w={215}
            d={145}
            h={18}
            topColor="#F8FAFC"
            leftColor="#CBD5E1"
            rightColor="#94A3B8"
            strokeColor="#94A3B8"
          />

          {/* 4 Ascending 3D Isometric Bar Charts on Left Edge of Platform */}
          {[
            { h: 52, x: 172, z: -45 },
            { h: 42, x: 194, z: -45 },
            { h: 32, x: 216, z: -45 },
            { h: 24, x: 238, z: -45 },
          ].map((bar, bIdx) => {
            const animatedH = Math.max(4, bar.h * s4Weight);
            return (
              <IsoBox
                key={bIdx}
                x={bar.x}
                z={bar.z}
                y={18}
                w={15}
                d={15}
                h={animatedH}
                topColor="#FCD34D"
                leftColor="#F59E0B"
                rightColor="#D97706"
              />
            );
          })}

          {/* Wall of 6 Floating Isometric Analytics & Approval Screens (Matches reference!) */}
          <g className="anim-iso-float">
            {/* Screen 1 (Left-Top): Verified Profile Card */}
            <polygon
              points={pts([
                iso(155, -135, 148),
                iso(215, -135, 148),
                iso(215, -135, 92),
                iso(155, -135, 92),
              ])}
              fill="#334155"
              stroke="#FFFFFF"
              strokeWidth="2"
            />
            {/* Screen 2 (Left-Bottom): Teal Metrics Card */}
            <polygon
              points={pts([
                iso(155, -135, 84),
                iso(215, -135, 84),
                iso(215, -135, 34),
                iso(155, -135, 34),
              ])}
              fill="#0E7490"
              stroke="#FFFFFF"
              strokeWidth="2"
            />

            {/* Screen 3 (Center-Top): Golden/Amber Financial Card with Green Checkmark */}
            <polygon
              points={pts([
                iso(225, -135, 148),
                iso(285, -135, 148),
                iso(285, -135, 96),
                iso(225, -135, 96),
              ])}
              fill="#F59E0B"
              stroke="#FFFFFF"
              strokeWidth="2"
            />
            <circle
              cx={iso(282, -135, 138)[0]}
              cy={iso(282, -135, 138)[1]}
              r="9"
              fill="#10B981"
              stroke="#FFFFFF"
              strokeWidth="1.5"
            />

            {/* Screen 4 (Right Wing Top): Dark Analytics & Donut Chart */}
            <polygon
              points={pts([
                iso(295, -135, 152),
                iso(295, -75, 152),
                iso(295, -75, 98),
                iso(295, -135, 98),
              ])}
              fill="#1E293B"
              stroke="#FFFFFF"
              strokeWidth="2"
            />
            <circle
              cx={iso(295, -92, 122)[0]}
              cy={iso(295, -92, 122)[1]}
              r="9"
              fill="none"
              stroke="#F59E0B"
              strokeWidth="3"
            />

            {/* Screen 5 (Right Wing Bottom-Left): Amber Summary Card */}
            <polygon
              points={pts([
                iso(295, -135, 90),
                iso(295, -75, 90),
                iso(295, -75, 42),
                iso(295, -135, 42),
              ])}
              fill="#FBBF24"
              stroke="#FFFFFF"
              strokeWidth="2"
            />

            {/* Screen 6 (Right Wing Far-Right): Sky-Teal Growth Card */}
            <polygon
              points={pts([
                iso(295, -65, 138),
                iso(295, -5, 138),
                iso(295, -5, 78),
                iso(295, -65, 78),
              ])}
              fill="#0284C7"
              stroke="#FFFFFF"
              strokeWidth="2"
            />
          </g>

          {/* Isometric Folder, Document & Magnifying Glass on Right Side of Platform */}
          <g transform={`translate(${iso(315, -35, 22)[0]}, ${iso(315, -35, 22)[1]})`}>
            {/* Golden Isometric Folder */}
            <polygon
              points="-24,-10 12,-28 24,5 -12,22"
              fill="#F59E0B"
              stroke="#FEF3C7"
              strokeWidth="1"
            />
            {/* White Document Page emerging from Folder */}
            <polygon
              points="-16,-36 16,-50 22,-8 -10,6"
              fill="#FFFFFF"
              stroke="#CBD5E1"
              strokeWidth="1"
            />
            {/* Magnifying Glass */}
            <circle
              cx="24"
              cy="-22"
              r="12"
              fill="rgba(56, 189, 248, 0.2)"
              stroke="#1E293B"
              strokeWidth="3"
            />
            <line
              x1="24"
              y1="-10"
              x2="24"
              y2="6"
              stroke="#1E293B"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          </g>

          {/* THE ENTREPRENEUR / DIRECTOR (Now directing the Consolidated Ecosystem on the Right Platform!) */}
          <IsoPerson
            cx={iso(258, -68, 18)[0]}
            cy={iso(258, -68, 18)[1]}
            shirtColor="#FFFFFF"
            pantsColor="#1E293B"
            facing="left"
            hasTablet={true}
          />
        </g>
      </svg>
    </div>
  );
}
