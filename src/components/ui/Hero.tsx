"use client";

import { motion, Variants } from "framer-motion";

export default function Hero() {
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.18, delayChildren: 0.1 }
        }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 12 } }
    };

    return (
        <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-white pt-20 pb-10">
            {/* Architectural Grid */}
            <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

            {/* Glowing Orbs */}
            <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/4 -left-20 h-[300px] w-[300px] sm:h-[500px] sm:w-[500px] rounded-full bg-primary/20 blur-[100px]"
            />
            <motion.div
                animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-0 right-0 h-[350px] w-[350px] sm:h-[600px] sm:w-[600px] rounded-full bg-secondary/20 blur-[120px]"
            />

            <div className="container relative z-10 px-6 lg:px-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">

                    {/* Content column – centered on mobile */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        className="space-y-7 text-center lg:text-left"
                    >
                        {/* Badge */}
                        <motion.div variants={itemVariants} className="inline-flex items-center rounded-full border border-zinc-200 bg-white/60 backdrop-blur-md px-4 py-2 text-xs sm:text-sm font-medium text-zinc-800 shadow-sm gap-3">
                            <span className="relative flex h-2.5 w-2.5 shrink-0">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
                            </span>
                            Fábrica de Desarrollo & IA Avanzada
                        </motion.div>

                        {/* Headline */}
                        <motion.h1 variants={itemVariants}
                            className="text-[2.6rem] font-extrabold leading-[1.1] tracking-tight text-zinc-900 sm:text-5xl md:text-6xl lg:text-7xl lg:leading-[1.05]">
                            Transformamos Ideas en{" "}
                            <span className="bg-gradient-to-r from-primary via-purple-500 to-secondary bg-clip-text text-transparent">
                                Código de Alto Valor
                            </span>
                        </motion.h1>

                        {/* Sub */}
                        <motion.p variants={itemVariants}
                            className="mx-auto max-w-lg text-base leading-relaxed text-zinc-500 sm:text-lg md:text-xl lg:mx-0">
                            Construimos plataformas digitales robustas, escalables y seguras. Somos tu socio tecnológico estratégico.
                        </motion.p>

                        {/* CTAs */}
                        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                            <a href="https://wa.me/573052165507" target="_blank" rel="noopener noreferrer"
                                className="group relative overflow-hidden rounded-full bg-zinc-950 px-7 py-4 text-sm sm:text-base font-semibold text-white shadow-xl transition-all hover:scale-105 active:scale-95 text-center">
                                <span className="absolute inset-0 bg-gradient-to-r from-primary/80 to-secondary/80 opacity-0 transition-opacity group-hover:opacity-100" />
                                <span className="relative flex items-center justify-center gap-2">
                                    Iniciar un Proyecto
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1">
                                        <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                                    </svg>
                                </span>
                            </a>
                        </motion.div>

                        {/* ── Mobile-only mini stats strip ── */}
                        <motion.div variants={itemVariants}
                            className="flex justify-center gap-6 pt-2 lg:hidden">
                            {[
                                { value: "5★", label: "Calificación" },
                                { value: "24h", label: "Respuesta" },
                            ].map((stat) => (
                                <div key={stat.label} className="flex flex-col items-center">
                                    <span className="text-xl font-extrabold text-zinc-900">{stat.value}</span>
                                    <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-medium">{stat.label}</span>
                                </div>
                            ))}
                        </motion.div>
                    </motion.div>

                    {/* Right Column - Tech Visual (desktop only) */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{ duration: 1, type: "spring", bounce: 0.4 }}
                        className="relative hidden lg:block"
                    >
                        <div className="relative w-full aspect-square max-w-[500px] ml-auto">
                            {/* Glass Panel 1 */}
                            <motion.div
                                animate={{ y: [0, -20, 0] }}
                                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute top-10 right-10 z-20 h-64 w-64 rounded-2xl border border-white/40 bg-white/20 p-6 backdrop-blur-xl shadow-2xl"
                            >
                                <div className="space-y-4">
                                    <div className="h-4 w-1/3 rounded-full bg-primary/40" />
                                    <div className="h-4 w-3/4 rounded-full bg-zinc-200" />
                                    <div className="h-4 w-1/2 rounded-full bg-zinc-200" />
                                    <div className="mt-8 flex gap-2">
                                        <div className="h-12 w-12 rounded-lg bg-secondary/20" />
                                        <div className="h-12 w-12 rounded-lg bg-primary/20" />
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                animate={{ y: [0, 20, 0] }}
                                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                className="absolute bottom-10 left-0 z-10 h-72 w-64 rounded-2xl border border-white/30 bg-gradient-to-br from-primary/10 to-secondary/10 p-6 backdrop-blur-lg shadow-xl"
                            >
                                <div className="flex flex-col h-full justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="h-3 w-3 rounded-full bg-green-400" />
                                        <div className="text-xs font-mono text-zinc-500">system_status: optimal</div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="h-2 w-full rounded-full bg-white/50" />
                                        <div className="h-2 w-full rounded-full bg-white/50 overflow-hidden">
                                            <motion.div animate={{ width: ["0%", "100%", "0%"] }} transition={{ duration: 3, repeat: Infinity }} className="h-full bg-primary" />
                                        </div>
                                        <div className="h-2 w-4/5 rounded-full bg-white/50" />
                                    </div>
                                </div>
                            </motion.div>

                            {/* Central Sphere */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                    className="h-48 w-48 rounded-full bg-gradient-to-tr from-primary to-secondary blur-md opacity-60" />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
