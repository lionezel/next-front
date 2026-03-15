"use client";

import { motion, Variants } from "framer-motion";

const strengths = [
    {
        title: "Infraestructura sólida",
        description: "Construimos bases tecnológicas robustas y escalables para soportar el crecimiento de tu negocio bajo alta concurrencia.",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
        ),
        classes: "md:col-span-2 bg-zinc-950 text-white border-zinc-800 hover:border-primary/50",
        iconClasses: "bg-white/10 text-white group-hover:bg-primary",
        titleClasses: "text-white",
        isDark: true
    },
    {
        title: "Seguridad de Datos",
        description: "Protegemos la información crítica con estándares globales.",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
        ),
        classes: "md:col-span-1 bg-white border-zinc-200 hover:border-primary/30",
        iconClasses: "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white",
        titleClasses: "text-zinc-900",
        isDark: false
    },
    {
        title: "Calidad y Testeo Riguroso",
        description: "Aseguramos la excelencia mediante ambientes de prueba dedicados y automatizados.",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /></svg>
        ),
        classes: "md:col-span-1 bg-white border-zinc-200 hover:border-secondary/30",
        iconClasses: "bg-secondary/10 text-secondary group-hover:bg-secondary group-hover:text-white",
        titleClasses: "text-zinc-900",
        isDark: false
    },
    {
        title: "Diseño UX/UI Premium",
        description: "Creamos interfaces intuitivas y experiencias de usuario que transforman visitantes en clientes leales desde el primer clic.",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>
        ),
        classes: "md:col-span-2 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20 hover:border-primary/50",
        iconClasses: "bg-white text-primary shadow-sm group-hover:bg-primary group-hover:text-white",
        titleClasses: "text-zinc-900",
        isDark: false
    },
];

export default function Strengths() {
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2,
            }
        }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, scale: 0.95, y: 20 },
        show: { 
            opacity: 1, 
            scale: 1,
            y: 0,
            transition: { type: "spring", stiffness: 80, damping: 15 } 
        }
    };

    const headerVariants: Variants = {
        hidden: { opacity: 0, y: -20 },
        show: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" } 
        }
    };

    return (
        <section className="bg-zinc-50 py-24 overflow-hidden">
            <div className="container mx-auto px-6 lg:px-12">
                <motion.div 
                    variants={headerVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-100px" }}
                    className="mb-16 max-w-3xl"
                >
                    <div className="flex items-center gap-4 mb-4">
                        <span className="h-px w-10 bg-primary"></span>
                        <h2 className="text-sm font-bold uppercase tracking-widest text-primary">
                            Arquitectura Tecnológica
                        </h2>
                    </div>
                    <p className="text-4xl font-extrabold tracking-tight text-black md:text-5xl">
                        Construimos Sistemas,<br/>
                        <span className="text-zinc-400 font-medium">Bloque por Bloque.</span>
                    </p>
                </motion.div>

                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-50px" }}
                    className="grid gap-6 md:grid-cols-3"
                >
                    {strengths.map((item, index) => (
                        <motion.div
                            variants={itemVariants}
                            key={index}
                            whileHover={{ y: -8, scale: 1.01 }}
                            className={`group relative overflow-hidden rounded-[2rem] border p-8 transition-all duration-300 shadow-sm hover:shadow-xl cursor-default ${item.classes}`}
                        >
                            <div className="relative z-10">
                                <div className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl transition-colors duration-300 ${item.iconClasses}`}>
                                    {item.icon}
                                </div>
                                <h3 className={`mb-4 text-2xl font-bold ${item.titleClasses}`}>
                                    {item.title}
                                </h3>
                                <p className={`leading-relaxed ${item.isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                                    {item.description}
                                </p>
                            </div>
                            
                            {/* Decorative element for dark card */}
                            {index === 0 && (
                                <div className="absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl group-hover:bg-primary/30 transition-colors duration-500 pointer-events-none"></div>
                            )}
                            {/* Decorative element for gradient card */}
                            {index === 3 && (
                                <div className="absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-secondary/10 blur-2xl group-hover:bg-secondary/20 transition-colors duration-500 pointer-events-none"></div>
                            )}
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
