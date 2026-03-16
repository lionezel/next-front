"use client";

import Footer from "@/src/components/ui/Footer";
import Hero from "@/src/components/ui/Hero";
import Navbar from "@/src/components/ui/Navbar";
import Strengths from "@/src/components/ui/Strengths";
import { motion, Variants } from "framer-motion";
import { services } from "../services/skills-data";
import { partners } from "../services/partners-data";
import Image from "next/image";

const sectionVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, ease: "easeOut" }
    }
};

const servicesContainerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.12,
            delayChildren: 0.05
        }
    }
};

const serviceCardVariants: Variants = {
    hidden: { opacity: 0, scale: 0.96, y: 16 },
    show: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: { duration: 0.45, ease: "easeOut" }
    },
    hover: { 
        y: -10,
        transition: { duration: 0.4, ease: "easeOut" }
    }
};

const imageVariants: Variants = {
    show: { scale: 1, opacity: 0.9 },
    hover: { 
        scale: 1.1,
        opacity: 1,
        transition: { duration: 0.6, ease: "easeOut" }
    }
};

export default function HomeView() {
    return (
        <>
            <Navbar />
            <main className="min-h-screen">
                <Hero />

                {/* Aliados Section - Marquee */}
                <section className="border-y border-zinc-100 bg-white py-16 overflow-hidden">
                    <div className="container mx-auto px-6 text-center lg:px-12 mb-10">
                        <h3 className="text-sm font-semibold uppercase tracking-widest text-zinc-400">
                            Empresas que confían en nuestra Ingeniería
                        </h3>
                    </div>

                    <div className="relative flex overflow-hidden w-full group mask-image-linear-edges">
                        <div className="animate-marquee flex whitespace-nowrap group-hover:[animation-play-state:paused]">
                            {/* First set of logos */}
                            <div className="flex items-center gap-16 md:gap-24 px-8 md:px-12">
                                {partners.map((partner, index) => (
                                    <div
                                        key={index}
                                        className="flex flex-col items-center justify-center opacity-50 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0 min-w-[150px]"
                                    >
                                        <Image
                                            src={`/logos/${partner.id}.png`}
                                            alt={`Logo de ${partner.name}`}
                                            width={120}
                                            height={48}
                                            className="h-12 w-auto object-contain cursor-pointer"
                                        />
                                        <span className="hidden text-xl font-bold font-mono text-zinc-500 cursor-pointer">
                                            {partner.name}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            {/* Second set of logos for infinite loop */}
                            <div className="flex items-center gap-16 md:gap-24 px-8 md:px-12">
                                {partners.map((partner, index) => (
                                    <div
                                        key={`dup-${index}`}
                                        className="flex flex-col items-center justify-center opacity-50 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0 min-w-[150px]"
                                    >
                                        <Image
                                            src={`/logos/${partner.id}.png`}
                                            alt={`Logo de ${partner.name}`}
                                            width={120}
                                            height={48}
                                            className="h-12 w-auto object-contain cursor-pointer"
                                        />
                                        <span className="hidden text-xl font-bold font-mono text-zinc-500 cursor-pointer">
                                            {partner.name}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <Strengths />

                {/* Services Section - Bento Box con imágenes de fondo */}
                <motion.section
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-120px" }}
                    id="servicios"
                    className="bg-white py-24"
                >
                    <div className="container mx-auto px-6 lg:px-12">
                        <motion.div variants={sectionVariants} className="mb-16 max-w-2xl">
                            <h2 className="text-sm font-bold uppercase tracking-widest text-primary mb-4 flex items-center gap-4">
                                <span className="h-px w-10 bg-primary" />
                                Catálogo de Servicios
                            </h2>
                            <p className="text-4xl font-extrabold tracking-tight text-black">
                                Soluciones integrales de software para toda necesidad.
                            </p>
                        </motion.div>

                        <motion.div
                            variants={servicesContainerVariants}
                            className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[280px] md:auto-rows-[240px]"
                        >
                            {services.map((service, index) => (
                                <motion.article
                                    key={service.name ?? index}
                                    variants={serviceCardVariants}
                                    whileHover="hover"
                                    className={`group relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 text-white p-6 md:p-8 flex flex-col justify-between cursor-default shadow-sm transition-all duration-500 hover:shadow-[0_0_30px_-5px_rgba(105,67,203,0.3)] hover:border-primary/50 ${service.classes}`}
                                >
                                    {/* Fondo con imagen + overlay de gradiente oscuro premium */}
                                    <motion.div
                                        className="absolute inset-0 -z-10"
                                        variants={imageVariants}
                                    >
                                        <Image
                                            src={service.image}
                                            alt={service.name ?? "Servicio Prioritech"}
                                            fill
                                            priority={index < 2}
                                            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
                                            className="object-cover"
                                        />
                                        <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/40 to-transparent opacity-80 group-hover:opacity-70 group-hover:from-black/90 group-hover:via-primary/20 transition-all duration-500" />
                                    </motion.div>

                                    {/* Contenedor del ícono (Glassmorphism + Pro Gradient) */}
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-[0_0_15px_rgba(255,255,255,0.05)] transition-all duration-300 group-hover:bg-gradient-to-br group-hover:from-primary group-hover:to-purple-600 group-hover:border-transparent group-hover:shadow-[0_0_20px_rgba(105,67,203,0.5)] group-hover:text-white group-hover:scale-110 group-hover:-rotate-6">
                                            {service.icon}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-300/60 leading-none mb-1">
                                                Premium
                                            </span>
                                            <span className="text-[11px] uppercase tracking-[0.15em] font-semibold text-zinc-100/90 leading-none">
                                                Prioritech
                                            </span>
                                        </div>
                                    </div>

                                    {/* Textos con drop-shadow para legibilidad */}
                                    <div className="mt-6 space-y-3">
                                        <h3 className="text-xl md:text-2xl font-bold leading-tight drop-shadow-md group-hover:text-white group-hover:translate-x-1 transition-transform duration-300">
                                            {service.name}
                                        </h3>
                                        <p className="text-xs md:text-sm text-zinc-100/90 leading-relaxed font-medium drop-shadow-sm max-w-[90%]">
                                            {service.desc}
                                        </p>
                                    </div>
                                </motion.article>
                            ))}
                        </motion.div>
                    </div>
                </motion.section>

                {/* Call to Action - Dark Modern */}
                <motion.section
                    variants={sectionVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-50px" }}
                    className="py-24"
                >
                    <div className="container mx-auto px-6 lg:px-12">
                        <div className="relative overflow-hidden rounded-[3rem] bg-zinc-950 p-12 md:p-20 text-center shadow-2xl">
                            {/* Decorative glowing lines */}
                            <div className="absolute -top-px left-1/2 -ml-[200px] w-[400px] h-px bg-linear-to-r from-transparent via-primary to-transparent opacity-70" />
                            <div className="absolute -bottom-px left-1/2 -ml-[150px] w-[300px] h-px bg-linear-to-r from-transparent via-secondary to-transparent opacity-70" />

                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                                className="absolute -top-80 -left-40 h-160 w-160 rounded-full bg-primary/10 blur-[100px]"
                            />

                            <div className="relative z-10 max-w-3xl mx-auto">
                                <span className="inline-block rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-zinc-300 backdrop-blur-md mb-8 ring-1 ring-white/20">
                                    Empecemos a construir
                                </span>
                                <h2 className="text-4xl font-extrabold text-white md:text-6xl tracking-tight mb-8">
                                    ¿Listo para transformar tu idea en <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-purple-400">código real?</span>
                                </h2>
                                <p className="text-lg text-zinc-400 mb-12 text-balance">
                                    Conectamos ingeniería de software avanzada con metodologías ágiles para entregar productos que dominan el mercado. Déjanos ser tu partner de tecnología.
                                </p>

                                <div className="flex flex-col sm:flex-row justify-center gap-4">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="rounded-full bg-white px-8 py-4 text-lg font-bold text-black shadow-[0_0_40px_-10px_rgba(255,255,255,0.5)] transition-shadow hover:shadow-[0_0_60px_-10px_rgba(255,255,255,0.7)]"
                                    >
                                        Agendar Consultoría
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="rounded-full border border-zinc-700 bg-zinc-900/50 px-8 py-4 text-lg font-bold text-white transition-colors hover:bg-zinc-800"
                                    >
                                        Ver Casos de Éxito
                                    </motion.button>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.section>
            </main>
            <Footer />
        </>
    );
}