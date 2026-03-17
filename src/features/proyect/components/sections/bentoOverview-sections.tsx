import { motion, Variants } from "framer-motion";
import { Project } from "../../types/project.type";

export default function BentoOverviewSection({ containerVariants, fadeInVariants, project }: { containerVariants: Variants, fadeInVariants: Variants, project: Project }) {
    return (
        <section className="py-20 bg-zinc-50/50">
            <div className="container mx-auto px-6 lg:px-12">
                <motion.div
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    variants={containerVariants}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                    {/* Main Feature Card */}
                    <motion.div
                        variants={fadeInVariants}
                        className="md:col-span-2 bg-zinc-950 rounded-[2.5rem] p-10 text-white relative overflow-hidden group shadow-2xl"
                    >
                        <div className="relative z-10">
                            <h3 className="text-2xl font-bold mb-4">Visión General</h3>
                            <p className="text-zinc-400 text-lg leading-relaxed">
                                {project.overview.vision}
                            </p>
                            <div className="mt-8 flex gap-4">
                                <div className="px-5 py-2 rounded-full bg-white/10 border border-white/10 text-sm font-medium backdrop-blur-md">
                                    {project.overview.highlight1}
                                </div>
                                <div className="px-5 py-2 rounded-full bg-primary/20 border border-primary/30 text-sm font-medium backdrop-blur-md text-primary-foreground">
                                    {project.overview.highlight2}
                                </div>
                            </div>
                        </div>
                        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-primary/20 blur-[80px] rounded-full transition-all duration-500 group-hover:bg-primary/30" />
                    </motion.div>

                    {/* Stats/Quick Info Card */}
                    <motion.div
                        variants={fadeInVariants}
                        className="bg-white border border-zinc-200 rounded-[2.5rem] p-10 flex flex-col justify-between shadow-sm"
                    >
                        <div>
                            <span className="text-4xl">{project.stats.indicator}</span>
                            <h4 className="text-xl font-bold mt-4 mb-2">{project.stats.title}</h4>
                            <p className="text-zinc-500 text-sm">{project.stats.description}</p>
                        </div>
                        <div className="pt-6 border-t border-zinc-100 mt-6">
                            <p className="text-xs font-bold uppercase tracking-tighter text-zinc-400 mb-2">Estado del Proyecto</p>
                            <div className="flex items-center gap-2">
                                <p className="text-lg font-bold text-black">{project.stats.statusLabel}</p>
                                <div className="flex items-center justify-center w-5 h-5 rounded-full bg-green-500/10 border border-green-500/20">
                                    <svg
                                        viewBox="0 0 24 24"
                                        className="w-10 h-10 text-green-600 fill-none stroke-[3] stroke-current"
                                    >
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    )
}