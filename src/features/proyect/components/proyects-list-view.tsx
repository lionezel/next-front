"use client";

import Footer from "@/src/components/ui/Footer";
import Navbar from "@/src/components/ui/Navbar";
import { motion, Variants } from "framer-motion";
import { projectsData } from "../services/proyect-data";
import { Floating } from "@/src/components/ui/Floating";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            ease: "easeOut",
        }
    }
};

const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
    hover: { y: -8, transition: { duration: 0.3, ease: "easeOut" } }
};

export default function ProyectsListView() {
    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-white selection:bg-primary selection:text-white pt-32 pb-20">
                <div className="container mx-auto px-6 lg:px-12">

                    {/* Header Section */}
                    <div className="mb-16 md:mb-24 flex flex-col items-center text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 mb-6"
                        >
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
                            </span>
                            <span className="text-sm font-semibold tracking-wide text-primary uppercase">
                                Nuestro Portafolio
                            </span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-zinc-900 mb-6 max-w-3xl"
                        >
                            Casos de <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Éxito</span> Reales
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-lg md:text-xl text-zinc-600 max-w-2xl leading-relaxed"
                        >
                            Explora algunos de los proyectos más innovadores y representativos donde hemos convertido ideas audaces en plataformas sólidas y escalables.
                        </motion.p>
                    </div>

                    {/* Bento Box Grid para Proyectos */}
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                    >
                        {projectsData.map((project, index) => {
                            // Hacemos que cada 3er item tome 2 columnas en pantallas muy grandes si queremos un layout tipo bento
                            // O simplemente un grid uniforme de 3 columnas
                            const isLarge = index === 0;

                            return (
                                <motion.div key={project.id} variants={cardVariants} whileHover="hover" className={`relative group ${isLarge ? 'md:col-span-2 lg:col-span-2' : ''}`}>
                                    <Link href={`/proyect/${project.id}`}>
                                        <div className="relative flex flex-col h-full bg-zinc-50 rounded-3xl overflow-hidden border border-zinc-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 group-hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] group-hover:border-primary/20">
                                            {/* Header del proyecto (Sin imagen, solo gradiente) */}
                                            <div className="relative shrink-0 h-48 md:h-64 w-full overflow-hidden bg-zinc-950">
                                                <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-950 flex items-center justify-center transition-transform duration-700 group-hover:scale-105">
                                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(105,67,203,0.4),transparent)]" />
                                                    <span className="text-white/10 font-black text-6xl md:text-8xl tracking-tighter mix-blend-overlay">
                                                        {project.title.substring(0, 2).toUpperCase()}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Detalles del proyecto */}
                                            <div className="flex flex-col grow p-8 z-20 bg-white relative">
                                                {/* Logo flotante (tal cual como estaba) */}
                                                <div className="absolute -top-10 right-8 h-20 w-20 rounded-2xl bg-white p-2 shadow-xl border border-zinc-100 z-30 transition-transform duration-300 group-hover:-translate-y-2">
                                                    <div className="relative w-full h-full rounded-xl overflow-hidden bg-zinc-50">
                                                        <Image
                                                            src={project.logo}
                                                            alt={`${project.title} Logo`}
                                                            fill
                                                            className="object-contain p-2"
                                                        />
                                                    </div>
                                                </div>

                                                <h3 className="text-2xl font-bold text-zinc-900 mb-2 group-hover:text-primary transition-colors pr-16 text-balance">
                                                    {project.title}
                                                </h3>
                                                <p className="text-sm font-semibold text-secondary mb-4 uppercase tracking-wider">
                                                    {project.subtitle}
                                                </p>
                                                
                                                {/* Tecnologías movidas aquí */}
                                                <div className="flex flex-wrap gap-2 mb-4">
                                                    {project.techStack.map((tech, i) => (
                                                        <span key={i} className="px-3 py-1 text-xs font-semibold text-zinc-600 bg-zinc-100 rounded-full border border-zinc-200 transition-colors group-hover:border-primary/20">
                                                            {tech.name}
                                                        </span>
                                                    ))}
                                                </div>

                                                <p className="text-zinc-600 line-clamp-3 mb-8 grow">
                                                    {project.description}
                                                </p>

                                                <div className="flex items-center text-primary font-semibold group/link mt-auto inline-flex w-fit">
                                                    Ver caso de estudio
                                                    <ArrowRight size={18} className="ml-2 transition-transform duration-300 group-hover/link:translate-x-1" />
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            )
                        })}
                    </motion.div>
                </div>
            </main>
            <Floating />
            <Footer />
        </>
    );
}
