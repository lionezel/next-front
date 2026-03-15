"use client";

import Footer from "@/src/components/ui/Footer";
import Hero from "@/src/components/ui/Hero";
import Navbar from "@/src/components/ui/Navbar";
import Strengths from "@/src/components/ui/Strengths";
import { motion, Variants } from "framer-motion";
import { services } from "../services/skills-data";
import { partners } from "../services/partners-data";

export default function HomeView() {

    const sectionVariants: Variants = {
        hidden: { opacity: 0, y: 30 },
        show: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: "easeOut" }
        }
    };

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
                                    <div key={index} className="flex flex-col items-center justify-center opacity-50 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0 min-w-[150px]">
                                        <img
                                            src={`/logos/${partner.id}.png`}
                                            alt={`Logo de ${partner.name}`}
                                            className="h-12 w-auto object-contain cursor-pointer"
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                                e.currentTarget.parentElement?.querySelector('span')?.classList.remove('hidden');
                                            }}
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
                                    <div key={`dup-${index}`} className="flex flex-col items-center justify-center opacity-50 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0 min-w-[150px]">
                                        <img
                                            src={`/logos/${partner.id}.png`}
                                            alt={`Logo de ${partner.name}`}
                                            className="h-12 w-auto object-contain cursor-pointer"
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                                e.currentTarget.parentElement?.querySelector('span')?.classList.remove('hidden');
                                            }}
                                        />
                                        <span className="hidden text-xl font-bold font-mono text-zinc-500 cursor-pointer">
                                            {partner.name}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    {/* Inline CSS trick for generic mask image fade left and right edges */}
                    <style dangerouslySetInnerHTML={{
                        __html: `
                        .mask-image-linear-edges {
                            mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
                            -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
                        }
                    `}} />
                </section>

                <Strengths />

                {/* Services Section - Bento Box */}
                <motion.section
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-100px" }}
                    id="servicios"
                    className="bg-white py-24"
                >
                    <div className="container mx-auto px-6 lg:px-12">
                        <motion.div variants={sectionVariants} className="mb-16 max-w-2xl">
                            <h2 className="text-sm font-bold uppercase tracking-widest text-primary mb-4 flex items-center gap-4">
                                <span className="h-px w-10 bg-primary"></span>
                                Catálogo de Servicios
                            </h2>
                            <p className="text-4xl font-extrabold tracking-tight text-black">
                                Soluciones integrales de software para toda necesidad.
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[250px] md:auto-rows-[200px]">
                            {services.map((service, index) => (
                                <motion.div
                                    variants={{
                                        hidden: { opacity: 0, scale: 0.95 },
                                        show: { opacity: 1, scale: 1, transition: { duration: 0.5, delay: index * 0.1 } }
                                    }}
                                    key={index}
                                    className={`group flex flex-col justify-between rounded-3xl border border-zinc-200 p-8 transition-all duration-300 hover:shadow-xl cursor-default ${service.classes}`}
                                >
                                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl text-2xl transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3 ${service.iconClasses}`}>
                                        {service.icon}
                                    </div>
                                    <div className="mt-8">
                                        <h3 className="mb-2 text-xl font-bold">{service.name}</h3>
                                        <p className={`text-sm opacity-80 ${service.classes.includes('text-white') ? "text-zinc-300" : "text-zinc-600"}`}>
                                            {service.desc}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
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
                            <div className="absolute -top-px left-1/2 -ml-[200px] w-[400px] h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-70"></div>
                            <div className="absolute -bottom-px left-1/2 -ml-[150px] w-[300px] h-px bg-gradient-to-r from-transparent via-secondary to-transparent opacity-70"></div>

                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                                className="absolute -top-[20rem] -left-[10rem] h-[40rem] w-[40rem] rounded-full bg-primary/10 blur-[100px]"
                            />

                            <div className="relative z-10 max-w-3xl mx-auto">
                                <span className="inline-block rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-zinc-300 backdrop-blur-md mb-8 ring-1 ring-white/20">
                                    Empecemos a construir
                                </span>
                                <h2 className="text-4xl font-extrabold text-white md:text-6xl tracking-tight mb-8">
                                    ¿Listo para transformar tu idea en <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">código real?</span>
                                </h2>
                                <p className="text-lg text-zinc-400 mb-12">
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