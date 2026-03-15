"use client";

import Footer from "@/src/components/ui/Footer";
import Navbar from "@/src/components/ui/Navbar";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { features } from "../services/feature-data";

export default function ServicesView() {
    const targetRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start start", "end start"]
    });

    // Background opacity based on scroll
    const backgroundOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.5]);

    return (
        <div className="bg-white text-zinc-900 min-h-screen selection:bg-primary/30">
            <Navbar />

            <main>
                {/* Hero Section */}
                <section className="relative min-h-[80vh] flex items-center pt-24 pb-12 overflow-hidden">
                    {/* Light/Cybernetic Background */}
                    <div className="absolute inset-0 z-0">
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:14px_24px]"></div>
                        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary opacity-[0.08] blur-[100px]"></div>
                    </div>

                    <div className="container relative z-10 mx-auto px-6 lg:px-12">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="max-w-4xl"
                        >
                            <Link href="/home" className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-900 mb-8 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="m15 18-6-6 6-6" /></svg>
                                Volver al inicio
                            </Link>

                            <div className="inline-flex items-center rounded-full border border-zinc-200 bg-white/50 px-4 py-1.5 text-sm font-medium text-zinc-600 backdrop-blur-md mb-6 shadow-sm">
                                <span className="mr-2 inline-block h-2 w-2 rounded-full bg-primary shadow-[0_0_10px_rgba(105,67,203,0.3)]"></span>
                                Servicio Especializado
                            </div>

                            <h1 className="text-5xl font-extrabold tracking-tight text-zinc-900 md:text-7xl lg:leading-[1.1] mb-8">
                                Sistemas de Información <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                                    A Nivel Empresarial
                                </span>
                            </h1>

                            <p className="text-xl text-zinc-600 leading-relaxed max-w-2xl border-l-2 border-primary/30 pl-6">
                                Ofrecemos soluciones robustas para empresas de cualquier tamaño. Nuestro enfoque es entender tu arquitectura actual para diseñar sistemas a medida que realmente impulsen tus objetivos.
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* Sticky Scroll Features Section */}
                <section ref={targetRef} className="relative w-full bg-zinc-50 border-y border-zinc-100">
                    {/* Container for sticky layout */}
                    <div className="container mx-auto px-6 lg:px-12 flex flex-col md:flex-row relative">

                        {/* Sticky Left Column */}
                        <div className="md:w-1/3 md:sticky md:top-32 h-fit pb-12 md:pb-0 pt-12 md:pr-12">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5 }}
                            >
                                <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 text-zinc-900">
                                    Nuestro <br />
                                    <span className="text-primary">Enfoque</span>
                                </h2>
                                <p className="text-zinc-600 text-lg">
                                    Desde la modernización de sistemas heredados (Legacy) hasta la creación de plataformas integrales desde cero.
                                </p>
                            </motion.div>
                        </div>

                        {/* Scrolling Right Column */}
                        <div className="md:w-2/3 pt-12 md:pt-32 pb-32 space-y-24 md:space-y-48">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: false, margin: "-20%" }}
                                    transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
                                    className="relative"
                                >
                                    <div className={`absolute -inset-4 rounded-3xl bg-gradient-to-br ${feature.color} opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100`}></div>
                                    <div className="relative flex flex-col md:flex-row gap-8 items-start rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm hover:shadow-xl hover:border-zinc-300 transition-all">
                                        <div className={`flex shrink-0 h-16 w-16 items-center justify-center rounded-2xl bg-zinc-50 text-3xl border border-zinc-100 ${feature.iconColor}`}>
                                            {feature.icon}
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-zinc-900 mb-4">
                                                {feature.title}
                                            </h3>
                                            <p className="text-zinc-600 leading-relaxed text-lg">
                                                {feature.description}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Connecting Line (except last) */}
                                    {index !== features.length - 1 && (
                                        <div className="hidden md:block absolute left-8 top-32 w-px h-64 bg-gradient-to-b from-zinc-200 to-transparent -z-10"></div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Light Call to Action */}
                <section className="py-24 relative overflow-hidden bg-white">
                    <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none"></div>

                    <div className="container mx-auto px-6 lg:px-12 text-center relative z-10">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="max-w-3xl mx-auto"
                        >
                            <h2 className="text-4xl md:text-6xl font-extrabold mb-8 text-zinc-900">
                                ¿Cuándo empezamos?
                            </h2>
                            <p className="text-xl text-zinc-600 mb-12">
                                Un analista de arquitectura de software está listo para evaluar el estado actual de tu ecosistema tecnológico.
                            </p>
                            <button className="group relative rounded-full bg-zinc-950 px-8 py-4 text-lg font-bold text-white transition-all hover:scale-105 shadow-xl hover:bg-zinc-800">
                                Iniciar Evaluación Gratuita
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block ml-2 transition-transform group-hover:translate-x-1"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                            </button>
                        </motion.div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
