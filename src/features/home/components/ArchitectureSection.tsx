"use client";

import { motion } from "framer-motion";
import { CloudTopologyVisual } from "./CloudTopologyVisual";
import { HomeAnimations } from "../types/home.types";
import { Server, ShieldCheck, Zap, Layers } from "lucide-react";

interface ArchitectureSectionProps {
    readonly animations: HomeAnimations;
}

const pillars = [
    {
        title: "Infraestructura sólida",
        desc: "Bases tecnológicas robustas y escalables para alta concurrencia.",
        icon: <Layers className="w-5 h-5 text-primary" />,
        color: "from-primary/20"
    },
    {
        title: "Seguridad de Datos",
        desc: "Protección crítica bajo estándares globales de ciberseguridad.",
        icon: <ShieldCheck className="w-5 h-5 text-primary" />,
        color: "from-primary/20"
    },
    {
        title: "Calidad y Testeo",
        desc: "Ambientes de prueba dedicados y procesos automatizados.",
        icon: <Zap className="w-5 h-5 text-primary" />,
        color: "from-primary/20"
    },
    {
        title: "Diseño UX/UI Premium",
        desc: "Interfaces intuitivas centradas en la conversión del usuario.",
        icon: <Server className="w-5 h-5 text-primary" />,
        color: "from-primary/20"
    }
];

export function ArchitectureSection({ animations }: ArchitectureSectionProps) {
    const { sectionVariants, architectureContainer, architectureItem } = animations;

    return (
        <section className="bg-zinc-50 py-20 md:py-32 overflow-hidden">
            <div className="container mx-auto px-6 lg:px-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-16 items-center">
                    
                    {/* Contenido (Izquierda) */}
                    <motion.div 
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={sectionVariants}
                    >
                        <div className="inline-flex items-center gap-4 mb-6">
                            <span className="h-px w-10 bg-primary" />
                            <h2 className="text-sm font-bold uppercase tracking-widest text-primary">
                                Arquitectura Tecnológica
                            </h2>
                        </div>
                        
                        <h3 className="text-4xl md:text-5xl font-extrabold tracking-tight text-black mb-8 leading-tight">
                            Construimos Sistemas,<br/>
                            <span className="text-zinc-400 font-medium">Bloque por Bloque.</span>
                        </h3>

                        <motion.div 
                            variants={architectureContainer}
                            className="grid grid-cols-1 sm:grid-cols-2 gap-10 md:gap-6"
                        >
                            {pillars.map((pillar) => (
                                <motion.div
                                    key={pillar.title}
                                    variants={architectureItem}
                                    className="group relative bg-white/80 backdrop-blur-md p-6 rounded-4xl border border-zinc-100 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
                                >
                                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/5 transition-colors group-hover:bg-primary/10">
                                        {pillar.icon}
                                    </div>
                                    <h4 className="text-lg font-bold text-zinc-900 mb-2 group-hover:text-primary transition-colors">
                                        {pillar.title}
                                    </h4>
                                    <p className="text-sm text-zinc-500 leading-relaxed">
                                        {pillar.desc}
                                    </p>
                                    
                                    {/* Decoración sutil al hover */}
                                    <div className={`absolute -right-4 -bottom-4 h-24 w-24 rounded-full bg-linear-to-br ${pillar.color} to-transparent blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>

                    {/* Gráfico Animado (Derecha) */}
                    <div className="relative hidden lg:block">
                        <div className="absolute inset-0 bg-primary/20 blur-[120px] rounded-full opacity-30 transform scale-150 animate-pulse" />
                        <div className="relative z-10 w-full aspect-square border-2 border-dashed border-zinc-200 rounded-[3rem] overflow-hidden bg-white/50 backdrop-blur-sm p-4">
                            <CloudTopologyVisual />
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
