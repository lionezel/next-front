import Link from "next/link";
import { motion } from "framer-motion";

export default function HeroSection() {
    return (
        <section className="relative min-h-[80vh] flex items-center pt-24 pb-12 overflow-hidden">
            {/* Light/Cybernetic Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:14px_24px]"></div>
                <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary opacity-[0.08] blur-[100px]"></div>
            </div>

            {/* "Volver al inicio" — pegado al top, justo debajo del navbar */}
            <div className="absolute top-20 left-0 right-0 z-10 container mx-auto px-6 lg:px-12">
                <Link href="/home" className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="m15 18-6-6 6-6" /></svg>
                    Volver al inicio
                </Link>
            </div>

            <div className="container relative z-10 mx-auto px-6 lg:px-12">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-4xl"
                >
                    <div className="inline-flex items-center rounded-full border border-zinc-200 bg-white/50 px-4 py-1.5 text-sm font-medium text-zinc-600 backdrop-blur-md mb-6 shadow-sm">
                        <span className="mr-2 inline-block h-2 w-2 rounded-full bg-primary shadow-[0_0_10px_rgba(105,67,203,0.3)]"></span>
                        Servicio Especializado
                    </div>

                    <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-5xl md:text-7xl lg:leading-[1.1] mb-8">
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
    )
}