"use client";

import { motion } from "framer-motion";

export function CloudTopologyVisual() {
    const layers = [
        { id: "infra", label: "Infraestructura", color: "rgba(105,67,203,0.6)", yOffset: 60, delay: 0 },
        { id: "security", label: "Seguridad", color: "rgba(139,92,246,0.6)", yOffset: 20, delay: 0.2 },
        { id: "qa", label: "Calidad / QA", color: "rgba(167,139,250,0.6)", yOffset: -20, delay: 0.4 },
        { id: "ux", label: "Experiencia UX", color: "rgba(196,181,253,0.6)", yOffset: -60, delay: 0.6 }
    ];

    return (
        <div className="relative w-full h-full flex items-center justify-center p-4">
            <motion.div 
                animate={{ y: [-10, 10, -10] }}
                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                className="relative w-full max-w-[300px] aspect-square flex items-center justify-center"
            >
                <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-[0_20px_50px_rgba(105,67,203,0.2)]">
                    {/* Central Connecting Core (Vertical Line) */}
                    <motion.line 
                        x1="200" y1="80" x2="200" y2="320"
                        stroke="rgba(105,67,203,0.3)"
                        strokeWidth="2"
                        strokeDasharray="4 4"
                        initial={{ pathLength: 0 }}
                        whileInView={{ pathLength: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, delay: 0.8 }}
                    />

                    {layers.map((layer) => (
                        <motion.g 
                            key={layer.id}
                            initial={{ opacity: 0, y: 100, rotateX: 45, rotateZ: -45 }}
                            whileInView={{ opacity: 1, y: layer.yOffset, rotateX: 45, rotateZ: -45 }}
                            viewport={{ once: true }}
                            transition={{ 
                                duration: 1, 
                                delay: layer.delay, 
                                ease: [0.23, 1, 0.32, 1], 
                                type: "spring",
                                stiffness: 50
                            }}
                        >
                            {/* Layer Base (Rhombus/Isometric Square) */}
                            <motion.rect 
                                x="100" y="100" width="200" height="200"
                                rx="24"
                                fill="transparent"
                                stroke={layer.color}
                                strokeWidth="2"
                                className="backdrop-blur-md"
                                style={{ fill: "rgba(255,255,255,0.03)" }}
                            />
                            
                            {/* Inner Grid / Patterns */}
                            <path 
                                d="M120 100 v200 M140 100 v200 M160 100 v200 M180 100 v200 M200 100 v200 M220 100 v200 M240 100 v200 M260 100 v200 M280 100 v200"
                                stroke={layer.color}
                                strokeWidth="0.5"
                                opacity="0.2"
                            />
                            <path 
                                d="M100 120 h200 M100 140 h200 M100 160 h200 M100 180 h200 M100 200 h200 M100 220 h200 M100 240 h200 M100 260 h200 M100 280 h200"
                                stroke={layer.color}
                                strokeWidth="0.5"
                                opacity="0.2"
                            />

                            {/* Center Node (Glow) */}
                            <circle cx="200" cy="200" r="6" fill="#6943cb" />
                            <circle cx="200" cy="200" r="12" fill="rgba(105,67,203,0.2)" />
                        </motion.g>
                    ))}
                </svg>

                {/* Pulsing Light Effect behind the whole stack */}
                <div className="absolute inset-0 bg-primary/5 blur-[80px] rounded-full -z-10 animate-pulse" />
            </motion.div>
        </div>
    );
}
