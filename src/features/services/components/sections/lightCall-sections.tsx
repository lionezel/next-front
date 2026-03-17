import { motion } from "framer-motion";

export default function LightCallSection() {
    return (
        <section className="py-24 relative overflow-hidden bg-white">
            <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none"></div>

            <div className="container mx-auto px-6 lg:px-12 text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="max-w-3xl mx-auto"
                >
                    <h2 className="text-3xl sm:text-4xl md:text-6xl font-extrabold mb-8 text-zinc-900">
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
    )
}