import { projectsData } from "../../services/proyect-data";
import { Project } from "../../types/project.type";
import Link from "next/link";
import Image from "next/image";

export default function DarkCallSection({ project }: { project: Project }) {
    const otherProjects = projectsData.filter(p => p.id !== project.id);

    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-6 lg:px-12">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-zinc-900 mb-4">
                        Explora más <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Proyectos</span>
                    </h2>
                    <p className="text-zinc-500 text-lg max-w-2xl mx-auto">
                        Conoce otras historias de éxito donde la tecnología y el diseño se unen para crear soluciones extraordinarias.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {otherProjects.map((nextProject) => (
                        <Link key={nextProject.id} href={`/proyect/${nextProject.id}`} className="group">
                            <div className="relative flex flex-col h-full bg-zinc-50 rounded-[2rem] p-6 lg:p-8 border border-zinc-100 hover:border-primary/20 hover:shadow-xl transition-all duration-300">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="relative h-14 w-14 rounded-2xl bg-white shadow-sm border border-zinc-100 overflow-hidden flex-shrink-0 p-2 group-hover:scale-105 transition-transform">
                                        <Image src={nextProject.logo} alt={nextProject.title} fill className="object-contain p-2" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-zinc-900 group-hover:text-primary transition-colors text-lg leading-tight mb-1">{nextProject.title}</h3>
                                        <p className="text-[10px] sm:text-xs font-semibold text-secondary uppercase tracking-wider">{nextProject.subtitle}</p>
                                    </div>
                                </div>
                                
                                <p className="text-sm text-zinc-600 line-clamp-3 mb-6 grow">
                                    {nextProject.description}
                                </p>

                                <div className="mt-auto flex items-center text-sm font-bold text-zinc-900 group-hover:text-primary transition-colors">
                                    Ver caso de estudio <span className="ml-2 group-hover:translate-x-1 transition-transform">➔</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}