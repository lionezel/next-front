import { motion } from "framer-motion";
import { Project } from "../../types/project.type";

export default function TechEcosystemSection({ project }: { project: Project }) {
    return (
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
    )
}