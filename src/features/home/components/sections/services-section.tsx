import { services } from "@/src/features/home/services/skills-data";
import { motion, Variants } from "framer-motion";
import Image from "next/image";

export function ServicesSection({ sectionVariants, servicesContainerVariants, serviceCardVariants }: { sectionVariants: Variants, servicesContainerVariants: Variants, serviceCardVariants: Variants }) {
    return (
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
                    <p className="text-3xl font-extrabold tracking-tight text-black sm:text-4xl">
                        Soluciones integrales de software para toda necesidad.
                    </p>
                </motion.div>

                <motion.div
                    variants={servicesContainerVariants}
                    className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-[190px] sm:auto-rows-[220px] md:auto-rows-[240px]"
                >
                    {services.map((service, index) => (
                        <motion.article
                            key={service.name ?? index}
                            variants={serviceCardVariants}
                            whileHover="hover"
                            style={{
                                '--card-shadow': service.hoverShadow
                            } as React.CSSProperties}
                            className={`group relative z-0 overflow-hidden rounded-3xl border border-white/10 bg-zinc-900 text-white p-6 md:p-8 flex flex-col justify-between cursor-default shadow-sm transition-all duration-300 hover:shadow-[0_0_30px_-5px_var(--card-shadow)] hover:border-white/40 ${service.classes}`}
                        >
                            {/* Fondo con imagen (Protagonista Total - 100% Color y Brillo) - Cambiado a z-0 */}
                            <div className="absolute inset-0 z-0 overflow-hidden">
                                <Image
                                    src={service.image}
                                    alt={service.name ?? "Servicio Prioritech"}
                                    fill
                                    priority={index < 2}
                                    sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
                                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                                />
                                {/* Overlay Ultra-Minimalista */}
                                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent pointer-events-none transition-opacity duration-300 group-hover:opacity-60" />
                            </div>

                            {/* Contenedor del ícono estructurado en capas - Agregado relative z-10 */}
                            <div className="relative z-10 flex items-center gap-4">
                                <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl text-2xl transition-all duration-300 group-hover:scale-110 group-hover:-rotate-6 group-hover:text-white">
                                    {/* Capa 1: Glassmorphism base */}
                                    <div className="absolute inset-0 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 transition-opacity duration-300 group-hover:opacity-0 shadow-[0_0_15px_rgba(255,255,255,0.05)]" />

                                    {/* Capa 2: Gradiente de color en hover */}
                                    <div className={`absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-gradient-to-br ${service.hoverGradient} shadow-[0_0_20px_var(--card-shadow)]`} />

                                    {/* Ícono de Lucide */}
                                    <div className="relative z-10 text-white">
                                        {service.icon}
                                    </div>
                                </div>

                                {/* Insignia al lado del ícono */}
                                <div className="flex flex-col">
                                    <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-300/80 leading-none mb-1 drop-shadow-md">
                                        Premium
                                    </span>
                                    <span className="text-[11px] uppercase tracking-[0.15em] font-semibold text-white leading-none drop-shadow-md">
                                        Prioritech
                                    </span>
                                </div>
                            </div>

                            {/* Textos con drop-shadow fuerte - Agregado relative z-10 */}
                            <div className="relative z-10 mt-6 space-y-3">
                                <h3 className="text-xl md:text-2xl font-bold leading-tight drop-shadow-lg group-hover:text-white group-hover:translate-x-1 transition-transform duration-300">
                                    {service.name}
                                </h3>
                                <p className="text-xs md:text-sm text-zinc-100/90 leading-relaxed font-medium drop-shadow-md max-w-[95%]">
                                    {service.desc}
                                </p>
                            </div>
                        </motion.article>
                    ))}
                </motion.div>
            </div>
        </motion.section>
    )
}