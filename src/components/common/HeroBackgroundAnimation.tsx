"use client";

import React, { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  glowColor: string;
  alpha: number;
  pulseSpeed: number;
  pulseOffset: number;
}

export type HeroTheme = "hub" | "credito" | "inversiones" | "seguros" | "fit";

interface HeroBackgroundAnimationProps {
  theme?: HeroTheme;
}

const THEME_CONFIGS: Record<
  HeroTheme,
  {
    particleColors: { core: string; glow: string }[];
    gridColor: string;
    lineColor: string;
    cursorColor: string;
    blobClasses: { blob1: string; blob2: string; blob3: string };
  }
> = {
  hub: {
    particleColors: [
      { core: "rgba(14, 165, 233, 1)", glow: "rgba(14, 165, 233, 0.7)" },
      { core: "rgba(6, 182, 212, 1)", glow: "rgba(6, 182, 212, 0.8)" },
      { core: "rgba(16, 185, 129, 1)", glow: "rgba(16, 185, 129, 0.7)" },
      { core: "rgba(99, 102, 241, 1)", glow: "rgba(99, 102, 241, 0.7)" },
    ],
    gridColor: "#0284C7",
    lineColor: "rgba(14, 165, 233,",
    cursorColor: "rgba(6, 182, 212,",
    blobClasses: {
      blob1: "from-cyan-400/25 via-sky-300/25 to-emerald-300/20",
      blob2: "from-indigo-400/25 via-sky-300/25 to-teal-300/20",
      blob3: "from-emerald-300/20 via-teal-200/25 to-cyan-300/20",
    },
  },
  credito: {
    particleColors: [
      { core: "rgba(16, 185, 129, 1)", glow: "rgba(16, 185, 129, 0.75)" },
      { core: "rgba(20, 184, 166, 1)", glow: "rgba(20, 184, 166, 0.8)" },
      { core: "rgba(5, 150, 105, 1)", glow: "rgba(5, 150, 105, 0.7)" },
      { core: "rgba(52, 211, 153, 1)", glow: "rgba(52, 211, 153, 0.7)" },
    ],
    gridColor: "#059669",
    lineColor: "rgba(16, 185, 129,",
    cursorColor: "rgba(20, 184, 166,",
    blobClasses: {
      blob1: "from-emerald-400/30 via-teal-300/25 to-green-300/20",
      blob2: "from-teal-400/25 via-emerald-300/25 to-lime-300/20",
      blob3: "from-emerald-300/25 via-green-200/25 to-teal-300/20",
    },
  },
  inversiones: {
    particleColors: [
      { core: "rgba(99, 102, 241, 1)", glow: "rgba(99, 102, 241, 0.75)" },
      { core: "rgba(139, 92, 246, 1)", glow: "rgba(139, 92, 246, 0.8)" },
      { core: "rgba(168, 85, 247, 1)", glow: "rgba(168, 85, 247, 0.7)" },
      { core: "rgba(79, 70, 229, 1)", glow: "rgba(79, 70, 229, 0.7)" },
    ],
    gridColor: "#4F46E5",
    lineColor: "rgba(99, 102, 241,",
    cursorColor: "rgba(139, 92, 246,",
    blobClasses: {
      blob1: "from-indigo-400/30 via-violet-300/25 to-purple-300/20",
      blob2: "from-purple-400/25 via-indigo-300/25 to-blue-300/20",
      blob3: "from-violet-300/25 via-fuchsia-200/20 to-indigo-300/20",
    },
  },
  seguros: {
    particleColors: [
      { core: "rgba(14, 165, 233, 1)", glow: "rgba(14, 165, 233, 0.75)" },
      { core: "rgba(2, 132, 199, 1)", glow: "rgba(2, 132, 199, 0.8)" },
      { core: "rgba(6, 182, 212, 1)", glow: "rgba(6, 182, 212, 0.7)" },
      { core: "rgba(56, 189, 248, 1)", glow: "rgba(56, 189, 248, 0.7)" },
    ],
    gridColor: "#0284C7",
    lineColor: "rgba(14, 165, 233,",
    cursorColor: "rgba(6, 182, 212,",
    blobClasses: {
      blob1: "from-sky-400/30 via-blue-300/25 to-cyan-300/20",
      blob2: "from-cyan-400/25 via-sky-300/25 to-indigo-300/20",
      blob3: "from-blue-300/25 via-sky-200/25 to-cyan-300/20",
    },
  },
  fit: {
    particleColors: [
      { core: "rgba(245, 158, 11, 1)", glow: "rgba(245, 158, 11, 0.75)" },
      { core: "rgba(249, 115, 22, 1)", glow: "rgba(249, 115, 22, 0.8)" },
      { core: "rgba(234, 88, 12, 1)", glow: "rgba(234, 88, 12, 0.7)" },
      { core: "rgba(251, 191, 36, 1)", glow: "rgba(251, 191, 36, 0.7)" },
    ],
    gridColor: "#EA580C",
    lineColor: "rgba(245, 158, 11,",
    cursorColor: "rgba(249, 115, 22,",
    blobClasses: {
      blob1: "from-amber-400/30 via-orange-300/25 to-yellow-300/20",
      blob2: "from-orange-400/25 via-amber-300/25 to-rose-300/20",
      blob3: "from-amber-300/25 via-orange-200/25 to-yellow-300/20",
    },
  },
};

export default function HeroBackgroundAnimation({
  theme = "hub",
}: HeroBackgroundAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const currentTheme = THEME_CONFIGS[theme] || THEME_CONFIGS.hub;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    let mouse = {
      x: -1000,
      y: -1000,
      radius: 180,
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
      initParticles();
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    let particles: Particle[] = [];

    const initParticles = () => {
      particles = [];
      const count = Math.min(Math.floor((width * height) / 8000), 75);

      for (let i = 0; i < count; i++) {
        const colorSet =
          currentTheme.particleColors[
            Math.floor(Math.random() * currentTheme.particleColors.length)
          ];
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 1.4,
          vy: (Math.random() - 0.5) * 1.4,
          radius: Math.random() * 3.5 + 2.0,
          color: colorSet.core,
          glowColor: colorSet.glow,
          alpha: Math.random() * 0.7 + 0.3,
          pulseSpeed: Math.random() * 0.03 + 0.015,
          pulseOffset: Math.random() * Math.PI * 2,
        });
      }
    };

    initParticles();

    let frame = 0;

    const render = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      // 1. Floating energy wave lines
      ctx.save();
      ctx.lineWidth = 1;
      const waveCount = 2;
      for (let w = 0; w < waveCount; w++) {
        ctx.beginPath();
        const yOffset = height * 0.45 + w * 90;
        const freq = 0.0025 + w * 0.001;
        const speed = frame * (0.015 + w * 0.008);

        ctx.moveTo(0, yOffset + Math.sin(speed) * 30);
        for (let x = 0; x < width; x += 15) {
          const y =
            yOffset +
            Math.sin(x * freq + speed) * 35 +
            Math.cos(x * 0.001 + speed * 0.5) * 20;
          ctx.lineTo(x, y);
        }

        const gradient = ctx.createLinearGradient(0, 0, width, 0);
        gradient.addColorStop(0, `${currentTheme.lineColor} 0)`);
        gradient.addColorStop(0.3, `${currentTheme.lineColor} 0.22)`);
        gradient.addColorStop(0.7, `${currentTheme.lineColor} 0.25)`);
        gradient.addColorStop(1, `${currentTheme.lineColor} 0)`);

        ctx.strokeStyle = gradient;
        ctx.stroke();
      }
      ctx.restore();

      // 2. Connect particles with constellation lines
      const maxDistance = 135;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const lineAlpha = (1 - dist / maxDistance) * 0.32;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `${currentTheme.lineColor} ${lineAlpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      // 3. Connect particles to cursor
      if (mouse.x > 0 && mouse.y > 0) {
        for (let i = 0; i < particles.length; i++) {
          const dx = particles[i].x - mouse.x;
          const dy = particles[i].y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouse.radius) {
            const cursorAlpha = (1 - dist / mouse.radius) * 0.45;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `${currentTheme.cursorColor} ${cursorAlpha})`;
            ctx.lineWidth = 1.2;
            ctx.stroke();
          }
        }
      }

      // 4. Update and draw particles with halo
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        const currentAlpha =
          p.alpha + Math.sin(frame * p.pulseSpeed + p.pulseOffset) * 0.2;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 3.5, 0, Math.PI * 2);
        ctx.fillStyle = p.glowColor;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0.1, Math.min(1, currentAlpha));
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [theme, currentTheme]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none -z-10">
      {/* Soft Ambient Aurora Gradient Blobs */}
      <div
        className={`absolute -top-20 left-1/4 w-[600px] h-[600px] bg-gradient-to-tr ${currentTheme.blobClasses.blob1} blur-[100px] rounded-full animate-float-slow`}
      />
      <div
        className={`absolute top-1/4 -right-20 w-[550px] h-[550px] bg-gradient-to-bl ${currentTheme.blobClasses.blob2} blur-[110px] rounded-full animate-float-reverse`}
      />
      <div
        className={`absolute -bottom-20 left-1/3 w-[500px] h-[500px] bg-gradient-to-tr ${currentTheme.blobClasses.blob3} blur-[95px] rounded-full animate-pulse-glow`}
      />

      {/* Tech Grid */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, ${currentTheme.gridColor} 1px, transparent 1px),
            linear-gradient(to bottom, ${currentTheme.gridColor} 1px, transparent 1px)
          `,
          backgroundSize: "44px 44px",
          maskImage: "radial-gradient(circle at center, black 40%, transparent 95%)",
          WebkitMaskImage: "radial-gradient(circle at center, black 40%, transparent 95%)",
        }}
      />

      {/* Interactive 60fps HTML5 Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ opacity: 0.88 }}
      />
    </div>
  );
}
