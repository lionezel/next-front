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
    )
}