import { motion, useScroll, useTransform } from "framer-motion";
import { features } from "../../services/feature-data";
import { useRef } from "react";

export default function FeatureSection() {
    const targetRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start start", "end start"]
    });

    // Background opacity based on scroll
    const backgroundOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.5]);

    return (
        <section ref={targetRef} className="relative w-full bg-zinc-50 border-y border-zinc-100">
            {/* Container for sticky layout */}
            <div className="container mx-auto px-6 lg:px-12 flex flex-col md:flex-row relative">

                {/* Sticky Left Column */}
                <div className="md:w-1/3 md:sticky md:top-32 h-fit pb-12 md:pb-0 pt-6 md:pt-12 md:pr-12">
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
                            viewport={{ once: true, margin: "-10%" }}
                            transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
                            className="relative group"
                        >
                            <div className={`absolute -inset-4 rounded-3xl bg-gradient-to-br ${feature.color} opacity-0 blur-2xl transition-all duration-700 group-hover:opacity-100 group-hover:scale-105`}></div>
                            <div className="relative flex flex-col md:flex-row gap-8 items-start rounded-3xl border border-zinc-200 bg-white/80 backdrop-blur-sm p-8 shadow-sm hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/20 transition-all duration-500">
                                <div className="relative shrink-0">
                                    <div className={`flex h-20 w-20 items-center justify-center rounded-2xl bg-zinc-50 border border-zinc-100 transition-all duration-500 group-hover:border-primary/30 group-hover:bg-white shadow-inner`}>
                                        <motion.div
                                            className={`${feature.iconColor}`}
                                            variants={{
                                                initial: { scale: 1, rotate: 0 },
                                                hover: { 
                                                    scale: 1.3, 
                                                    rotate: [0, -10, 10, 0],
                                                    filter: `drop-shadow(0 0 12px ${feature.hoverShadow})`,
                                                    transition: { 
                                                        rotate: { repeat: Infinity, duration: 2, ease: "easeInOut" },
                                                        scale: { duration: 0.3 }
                                                    }
                                                }
                                            }}
                                            whileHover="hover"
                                        >
                                            <feature.icon size={36} strokeWidth={2.2} />
                                        </motion.div>
                                    </div>
                                    
                                    {/* Subtly animated pulse behind icon */}
                                    <motion.div 
                                        className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.color} -z-10`}
                                        animate={{
                                            scale: [1, 1.15, 1],
                                            opacity: [0.3, 0.6, 0.3],
                                        }}
                                        transition={{
                                            duration: 4,
                                            repeat: Infinity,
                                            ease: "easeInOut"
                                        }}
                                    />
                                </div>
                                
                                <div className="flex-1 pt-2">
                                    <h3 className="text-2xl font-bold text-zinc-900 mb-4 group-hover:text-primary transition-colors duration-300">
                                        {feature.title}
                                    </h3>
                                    <p className="text-zinc-600 leading-relaxed text-lg group-hover:text-zinc-700 transition-colors duration-300">
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

    )
}