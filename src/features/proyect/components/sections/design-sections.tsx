import { motion } from "framer-motion";
import { Project } from "../../types/project.type";

export default function DesignSection({ project }: { project: Project }) {
    return (
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
                            <p className="text-zinc-400 text-lg leading-relaxed mb-12 max-w-xl">
                                {project.design.description}
                            </p>

                            <div className="flex flex-wrap gap-12">
                                {project.design.palette.map((color, colorIdx) => (
                                    <motion.div 
                                        key={colorIdx} 
                                        className="flex flex-col items-center gap-4 group/color"
                                        whileHover={{ y: -5 }}
                                    >
                                        <div
                                            className="w-16 h-16 rounded-full border-4 border-white/5 shadow-2xl transition-transform duration-300 group-hover/color:scale-110"
                                            style={{ backgroundColor: color, boxShadow: `0 10px 30px -10px ${color}80` }}
                                        />
                                        <div className="flex flex-col items-center">
                                            <span className="text-[10px] font-bold font-mono text-zinc-400 tracking-tighter mb-1 uppercase">Primary Tone</span>
                                            <span className="text-xs font-mono text-white/60 uppercase">{color}</span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    <div className="w-full md:w-1/2 relative">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="relative z-10 rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl bg-zinc-900/50 backdrop-blur-3xl aspect-square flex items-center justify-center p-16"
                        >
                            {/* Branding Focus */}
                            <motion.div 
                                animate={{ 
                                    y: [0, -10, 0],
                                    rotate: [0, 2, 0]
                                }}
                                transition={{ 
                                    duration: 6,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                className="relative w-full h-full flex items-center justify-center"
                            >
                                <img 
                                    src={project.logo} 
                                    alt={project.title} 
                                    className="max-w-[70%] max-h-[70%] object-contain filter drop-shadow-[0_0_50px_rgba(255,255,255,0.2)]"
                                />
                            </motion.div>
                            
                            {/* Decorative Elements */}
                            <div className="absolute top-10 right-10 w-20 h-20 bg-primary/20 blur-3xl rounded-full"></div>
                            <div className="absolute bottom-10 left-10 w-32 h-32 bg-secondary/10 blur-3xl rounded-full"></div>
                        </motion.div>

                        <div className="absolute -inset-4 bg-primary/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    </div>
                </div>
            </div>
        </section>
    )
}