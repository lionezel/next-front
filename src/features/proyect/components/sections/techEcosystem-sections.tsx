import { motion } from "framer-motion";
import { Project } from "../../types/project.type";
import Image from "next/image";

export default function TechEcosystemSection({ project }: { project: Project }) {
    return (
        <section className="py-24 overflow-hidden bg-zinc-50/50">
            <div className="container mx-auto px-6 lg:px-12">
                <div className="flex flex-col lg:flex-row gap-16 items-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="lg:w-1/2"
                    >
                        <h2 className="text-sm font-bold uppercase tracking-widest text-primary mb-4 flex items-center gap-4">
                            <span className="h-px w-10 bg-primary"></span>
                            Ecosistema Tecnológico
                        </h2>
                        <p className="text-4xl md:text-5xl font-extrabold tracking-tight text-black mb-6">
                            Ingeniería de vanguardia.
                        </p>
                        <p className="text-zinc-600 text-lg leading-relaxed max-w-xl">
                            Implementamos arquitecturas robustas y escalables utilizando lo último en tecnología para garantizar que {project.title} sea líder en su categoría.
                        </p>
                    </motion.div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {project.techStack.map((tech, idx) => {
                        const techLogos: Record<string, string> = {
                            "Nextjs": "/logos/tech/nextjs.png",
                            "Next.js": "/logos/tech/nextjs.png",
                            "Tailwind": "/logos/tech/tailwind.png",
                            "Tailwind CSS": "/logos/tech/tailwind.png",
                            "Firebase": "/logos/tech/firebase.png",
                            "Vercel": "/logos/tech/vercel.png",
                            "Strapi": "https://static.cdnlogo.com/logos/s/41/strapi.svg"
                        };

                        const logoSrc = techLogos[tech.name] || techLogos[tech.icon];

                        return (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 + 0.5 }}
                                viewport={{ once: true }}
                                whileHover={{ y: -5 }}
                                className="bg-white border border-zinc-100 rounded-3xl p-6 text-center group hover:border-primary/20 hover:shadow-xl transition-all duration-300"
                            >
                                <div className="w-14 h-14 bg-zinc-50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/5 transition-colors overflow-hidden border border-zinc-100 group-hover:border-primary/10">
                                    {logoSrc ? (
                                        <Image
                                            src={logoSrc}
                                            alt={tech.name}
                                            width={40}
                                            height={40}
                                            className="object-contain transition-transform duration-500 group-hover:scale-110"
                                        />
                                    ) : (
                                        <span className="text-2xl grayscale group-hover:grayscale-0 transition-all">
                                            {idx % 2 === 0 ? "⚡" : "💎"}
                                        </span>
                                    )}
                                </div>
                                <h5 className="font-bold text-sm text-black">{tech.name}</h5>
                                <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-medium">{tech.category}</span>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    )
}
