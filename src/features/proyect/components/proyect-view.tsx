"use client";

import Footer from "@/src/components/ui/Footer";
import Navbar from "@/src/components/ui/Navbar";
import { motion, Variants } from "framer-motion";
import { projectsData } from "../services/proyect-data";

export default function ProyectView({ projectId }: { projectId?: string }) {
    const project = projectsData.find(p => p.id === projectId) || projectsData[0];

    const fadeInVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        show: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" }
        }
    };

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-white selection:bg-primary selection:text-white">

                {/* Hero Section */}
                <section className="relative pt-28 sm:pt-32 pb-10 sm:pb-16 overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] pointer-events-none">
                        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[60%] bg-primary/10 blur-[120px] rounded-full" />
                        <div className="absolute top-[20%] right-[-10%] w-[30%] h-[50%] bg-secondary/10 blur-[100px] rounded-full" />
                    </div>

                    <div className="container mx-auto px-6 lg:px-12 relative z-10">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 lg:gap-12">
                            <motion.div
                                initial="hidden"
                                animate="show"
                                variants={containerVariants}
                                className="max-w-3xl"
                            >
                                {/* Breadcrumb */}
                                <motion.div variants={fadeInVariants} className="flex items-center gap-2 mb-4">
                                    <span className="text-primary font-bold uppercase tracking-widest text-xs">Portafolio</span>
                                    <span className="w-1 h-1 rounded-full bg-zinc-300" />
                                    <span className="text-zinc-500 text-xs font-medium">{project.subtitle}</span>
                                </motion.div>

                                {/* Mobile: title + logo in one row */}
                                <motion.div variants={fadeInVariants} className="flex items-center gap-4 mb-5 lg:hidden">
                                    <h1 className="flex-1 text-5xl sm:text-6xl font-black tracking-tighter text-black leading-none">
                                        {project.title}
                                    </h1>
                                    <div className="relative flex h-[104px] w-[104px] shrink-0 items-center justify-center rounded-3xl border border-zinc-100 bg-white/80 backdrop-blur-sm p-4 shadow-xl">
                                        <img src={project.logo} alt={`${project.title} logo`} className="h-full w-full object-contain" />
                                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/30 to-transparent pointer-events-none" />
                                    </div>
                                </motion.div>

                                {/* Desktop: large title */}
                                <motion.h1
                                    variants={fadeInVariants}
                                    className="hidden lg:block text-8xl font-black tracking-tighter text-black mb-8 leading-none"
                                >
                                    {project.title}
                                </motion.h1>

                                <motion.p
                                    variants={fadeInVariants}
                                    className="text-sm sm:text-base lg:text-xl text-zinc-600 leading-relaxed max-w-2xl"
                                >
                                    {project.description}
                                </motion.p>
                            </motion.div>

                            {/* Large Logo — desktop only */}
                            <motion.div
                                initial={{ opacity: 0, x: 50, scale: 0.8 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="hidden lg:flex flex-shrink-0 w-64 h-64 xl:w-96 xl:h-96 items-center justify-center p-10 bg-white/50 backdrop-blur-sm rounded-[3rem] border border-zinc-100 shadow-2xl relative group"
                            >
                                <img
                                    src={project.logo}
                                    alt={`${project.title} logo`}
                                    className="w-full h-full object-contain filter drop-shadow-2xl transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute -inset-4 bg-primary/10 blur-3xl rounded-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Bento Overview Section */}
                <section className="py-20 bg-zinc-50/50">
                    <div className="container mx-auto px-6 lg:px-12">
                        <motion.div
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true }}
                            variants={containerVariants}
                            className="grid grid-cols-1 md:grid-cols-3 gap-6"
                        >
                            {/* Main Feature Card */}
                            <motion.div
                                variants={fadeInVariants}
                                className="md:col-span-2 bg-zinc-950 rounded-[2.5rem] p-10 text-white relative overflow-hidden group shadow-2xl"
                            >
                                <div className="relative z-10">
                                    <h3 className="text-2xl font-bold mb-4">Visión General</h3>
                                    <p className="text-zinc-400 text-lg leading-relaxed">
                                        {project.overview.vision}
                                    </p>
                                    <div className="mt-8 flex gap-4">
                                        <div className="px-5 py-2 rounded-full bg-white/10 border border-white/10 text-sm font-medium backdrop-blur-md">
                                            {project.overview.highlight1}
                                        </div>
                                        <div className="px-5 py-2 rounded-full bg-primary/20 border border-primary/30 text-sm font-medium backdrop-blur-md text-primary-foreground">
                                            {project.overview.highlight2}
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-primary/20 blur-[80px] rounded-full transition-all duration-500 group-hover:bg-primary/30" />
                            </motion.div>

                            {/* Stats/Quick Info Card */}
                            <motion.div
                                variants={fadeInVariants}
                                className="bg-white border border-zinc-200 rounded-[2.5rem] p-10 flex flex-col justify-between shadow-sm"
                            >
                                <div>
                                    <span className="text-4xl">{project.stats.indicator}</span>
                                    <h4 className="text-xl font-bold mt-4 mb-2">{project.stats.title}</h4>
                                    <p className="text-zinc-500 text-sm">{project.stats.description}</p>
                                </div>
                                <div className="pt-6 border-t border-zinc-100 mt-6">
                                    <p className="text-xs font-bold uppercase tracking-tighter text-zinc-400 mb-2">Estado del Proyecto</p>
                                    <div className="flex items-center gap-2">
                                        <p className="text-lg font-bold text-black">{project.stats.statusLabel}</p>
                                        <div className="flex items-center justify-center w-5 h-5 rounded-full bg-green-500/10 border border-green-500/20">
                                            <svg
                                                viewBox="0 0 24 24"
                                                className="w-10 h-10 text-green-600 fill-none stroke-[3] stroke-current"
                                            >
                                                <polyline points="20 6 9 17 4 12" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </section>

                {/* Tech Ecosystem Section */}
                <section className="py-24 overflow-hidden">
                    <div className="container mx-auto px-6 lg:px-12">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="mb-16"
                        >
                            <h2 className="text-sm font-bold uppercase tracking-widest text-primary mb-4 flex items-center gap-4">
                                <span className="h-px w-10 bg-primary"></span>
                                Ecosistema Tecnológico
                            </h2>
                            <p className="text-4xl font-extrabold tracking-tight text-black">
                                Ingeniería de vanguardia.
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            {project.techStack.map((tech, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: idx * 0.05 }}
                                    viewport={{ once: true }}
                                    whileHover={{ y: -5 }}
                                    className="bg-white border border-zinc-100 rounded-3xl p-6 text-center group hover:border-primary/20 hover:shadow-xl transition-all duration-300"
                                >
                                    <div className="w-12 h-12 bg-zinc-50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/5 transition-colors">
                                        <span className="text-2xl grayscale group-hover:grayscale-0 transition-all">{idx % 2 === 0 ? "⚡" : "💎"}</span>
                                    </div>
                                    <h5 className="font-bold text-sm text-black">{tech.name}</h5>
                                    <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-medium">{tech.category}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Design & UI Section */}
                <section className="py-24 bg-zinc-950 text-white overflow-hidden relative">
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_120%,rgba(105,67,203,0.3),transparent)]" />
                    </div>

                    <div className="container mx-auto px-6 lg:px-12 relative z-10">
                        <div className="flex flex-col md:flex-row gap-16 items-center">
                            <div className="w-full md:w-1/2">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                >
                                    <h2 className="text-4xl font-extrabold tracking-tight mb-8">
                                        Diseño con Propósito & <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">UI/UX Humana.</span>
                                    </h2>
                                    <p className="text-zinc-400 text-lg leading-relaxed mb-10">
                                        {project.design.description}
                                    </p>

                                    <div className="flex flex-wrap gap-8">
                                        {project.design.palette.map((color, colorIdx) => (
                                            <div key={colorIdx} className="flex flex-col items-center gap-3">
                                                <div
                                                    className="w-12 h-12 rounded-full border border-white/10 shadow-lg"
                                                    style={{ backgroundColor: color }}
                                                />
                                                <span className="text-[10px] font-mono text-zinc-500 uppercase">{color}</span>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            </div>

                            <div className="w-full md:w-1/2 relative group">
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                    className="relative z-10 rounded-[2.5rem] overflow-hidden border border-white/10 shadow-[0_0_80px_-20px_rgba(105,67,203,0.3)] bg-zinc-900 aspect-video flex items-center justify-center p-12"
                                >
                                    {/* Mockup Placeholder */}
                                    <div className="text-center">
                                        <div className="inline-block p-4 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 mb-6">
                                            <div className="grid grid-cols-3 gap-2">
                                                <div className="w-12 h-2 rounded bg-primary/50" />
                                                <div className="w-8 h-2 rounded bg-zinc-700" />
                                                <div className="w-16 h-2 rounded bg-secondary/50" />
                                            </div>
                                        </div>
                                        <p className="text-sm font-medium text-zinc-500">Visual Capture System Active</p>
                                    </div>
                                </motion.div>

                                <div className="absolute -inset-4 bg-primary/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Call to Action - Modern Dark */}
                <section className="py-24">
                    <div className="container mx-auto px-6 lg:px-12">
                        {projectsData.filter(p => p.id !== project.id).map((nextProject) => (
                            <div key={nextProject.id} className="relative overflow-hidden rounded-[2rem] md:rounded-[3rem] bg-zinc-50 border border-zinc-100 p-8 sm:p-12 md:p-20 text-center mb-8">
                                <h2 className="text-2xl sm:text-3xl font-extrabold text-black md:text-5xl tracking-tight mb-8">
                                    Próximo Proyecto: <span className="text-primary italic">{nextProject.title}</span>
                                </h2>
                                <p className="text-lg text-zinc-500 mb-12 max-w-2xl mx-auto">
                                    {nextProject.subtitle} - Descubre cómo transformamos esta idea en realidad.
                                </p>
                                <a
                                    href={`/proyect/${nextProject.id}`}
                                    className="inline-block rounded-full bg-zinc-950 px-10 py-5 text-lg font-bold text-white shadow-xl hover:shadow-primary/20 transition-all hover:scale-105 active:scale-95"
                                >
                                    Ver {nextProject.title} ➔
                                </a>
                            </div>
                        ))}
                    </div>
                </section>

            </main>

            {/* Floating WhatsApp FAB – mobile only */}
            <a href="https://wa.me/573053617422" target="_blank" rel="noopener noreferrer"
                className="fixed bottom-6 right-6 z-40 flex md:hidden h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary shadow-[0_0_30px_-4px_rgba(105,67,203,0.7)] transition-all hover:scale-110 active:scale-95"
                aria-label="Contactar por WhatsApp">
                <span className="absolute inline-flex h-full w-full rounded-full bg-primary/40 animate-ping opacity-60" />
                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="white">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
            </a>

            <Footer />
        </>
    );
}
