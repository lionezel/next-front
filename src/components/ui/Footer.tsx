import Link from "next/link";

export default function Footer() {
    return (
        <footer className="border-t border-zinc-200 bg-white pt-16 pb-8">
            <div className="container mx-auto px-6 lg:px-12">
                <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="space-y-6 lg:col-span-1">
                        <Link href="/" className="text-2xl font-bold tracking-tighter text-primary">
                            Priori<span className="text-secondary">Tech</span>
                        </Link>
                        <p className="text-zinc-600">
                            Soluciones innovadoras en IA y desarrollo de software a medida para impulsar tu negocio al siguiente nivel.
                        </p>
                    </div>

                    <div>
                        <h4 className="mb-6 font-bold uppercase tracking-wider text-zinc-900">
                            Servicios
                        </h4>
                        <ul className="space-y-4 text-zinc-600">
                            <li>Páginas Web</li>
                            <li>Aplicaciones Móviles</li>
                            <li>Soporte y gestión Cloud</li>
                            <li>Sistemas de información</li>
                            <li>Ciberseguridad</li>
                            <li>QA | Testeo</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="mb-6 font-bold uppercase tracking-wider text-zinc-900">
                            Proyectos
                        </h4>
                        <ul className="space-y-4 text-zinc-600">
                            <li>Restabar la bello</li>
                            <li>Impacto</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="mb-6 font-bold uppercase tracking-wider text-zinc-900">
                            Redes
                        </h4>
                        <div className="flex gap-4">
                            {/* Dummy social icons */}
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 transition-colors hover:bg-primary hover:text-white">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /></svg>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-16 border-t border-zinc-100 pt-8 text-center">
                    <p className="text-sm text-zinc-500">
                        Copyright © {new Date().getFullYear()} Prioritech. Designed by Prioritech
                    </p>
                </div>
            </div>
        </footer>
    );
}
