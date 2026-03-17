import { motion, Variants } from "framer-motion";
import { Project } from "../../types/project.type";

export default function HeroSection({ containerVariants, fadeInVariants, project }: { containerVariants: Variants, fadeInVariants: Variants, project: Project }) {
    return (
        <section className="relative pt-28 sm:pt-32 pb-10 sm:pb-16 overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[60%] bg-primary/10 blur-[120px] rounded-full" />
                <div className="absolute top-[20%] right-[-10%] w-[30%] h-[50%] bg-secondary/10 blur-[100px] rounded-full" />
            </div>

            <div className="container mx-auto px-6 lg:px-12 relative z-10">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 lg:gap-12">
                    <motion.div
                        initial="hidden"
                        animate="show"
                        variants={containerVariants}
                        className="max-w-3xl"
                    >
                        {/* Breadcrumb */}
                        <motion.div variants={fadeInVariants} className="flex items-center gap-2 mb-4">
                            <span className="text-primary font-bold uppercase tracking-widest text-xs">Portafolio</span>
                            <span className="w-1 h-1 rounded-full bg-zinc-300" />
                            <span className="text-zinc-500 text-xs font-medium">{project.subtitle}</span>
                        </motion.div>

                        {/* Mobile: title + logo in one row */}
                        <motion.div variants={fadeInVariants} className="flex items-center gap-4 mb-5 lg:hidden">
                            <h1 className="flex-1 text-5xl sm:text-6xl font-black tracking-tighter text-black leading-none">
                                {project.title}
                            </h1>
                            <div className="relative flex h-[104px] w-[104px] shrink-0 items-center justify-center rounded-3xl border border-zinc-100 bg-white/80 backdrop-blur-sm p-4 shadow-xl">
                                <img src={project.logo} alt={`${project.title} logo`} className="h-full w-full object-contain" />
                                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/30 to-transparent pointer-events-none" />
                            </div>
                        </motion.div>

                        {/* Desktop: large title */}
                        <motion.h1
                            variants={fadeInVariants}
                            className="hidden lg:block text-8xl font-black tracking-tighter text-black mb-8 leading-none"
                        >
                            {project.title}
                        </motion.h1>

                        <motion.p
                            variants={fadeInVariants}
                            className="text-sm sm:text-base lg:text-xl text-zinc-600 leading-relaxed max-w-2xl"
                        >
                            {project.description}
                        </motion.p>
                    </motion.div>

                    {/* Large Logo — desktop only */}
                    <motion.div
                        initial={{ opacity: 0, x: 50, scale: 0.8 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="hidden lg:flex flex-shrink-0 w-64 h-64 xl:w-96 xl:h-96 items-center justify-center p-10 bg-white/50 backdrop-blur-sm rounded-[3rem] border border-zinc-100 shadow-2xl relative group"
                    >
                        <img
                            src={project.logo}
                            alt={`${project.title} logo`}
                            className="w-full h-full object-contain filter drop-shadow-2xl transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute -inset-4 bg-primary/10 blur-3xl rounded-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
                    </motion.div>
                </div>
            </div>
        </section>
    )
}