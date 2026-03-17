import { projectsData } from "../../services/proyect-data";
import { Project } from "../../types/project.type";

export default function DarkCallSection({ project }: { project: Project }) {
    return (
        <section className="py-24">
            <div className="container mx-auto px-6 lg:px-12">
                {projectsData.filter(p => p.id !== project.id).map((nextProject) => (
                    <div key={nextProject.id} className="relative overflow-hidden rounded-[2rem] md:rounded-[3rem] bg-zinc-50 border border-zinc-100 p-8 sm:p-12 md:p-20 text-center mb-8">
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-black md:text-5xl tracking-tight mb-8">
                            Próximo Proyecto: <span className="text-primary italic">{nextProject.title}</span>
                        </h2>
                        <p className="text-lg text-zinc-500 mb-12 max-w-2xl mx-auto">
                            {nextProject.subtitle} - Descubre cómo transformamos esta idea en realidad.
                        </p>
                        <a
                            href={`/proyect/${nextProject.id}`}
                            className="inline-block rounded-full bg-zinc-950 px-10 py-5 text-lg font-bold text-white shadow-xl hover:shadow-primary/20 transition-all hover:scale-105 active:scale-95"
                        >
                            Ver {nextProject.title} ➔
                        </a>
                    </div>
                ))}
            </div>
        </section>

    )
}