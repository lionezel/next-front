import Link from "next/link";

export default function Footer() {
    return (
        <footer className="border-t border-zinc-200 bg-white pt-16 pb-8 dark:border-zinc-800 dark:bg-black">
            <div className="container mx-auto px-6 lg:px-12">
                <div className="grid gap-12 lg:grid-cols-4">
                    <div className="space-y-6 lg:col-span-1">
                        <Link href="/" className="text-2xl font-bold tracking-tighter text-primary">
                            OPI<span className="text-secondary">TECH</span>
                        </Link>
                        <p className="text-zinc-600 dark:text-zinc-400">
                            Soluciones innovadoras en IA y desarrollo de software a medida para impulsar tu negocio al siguiente nivel.
                        </p>
                    </div>

                    <div>
                        <h4 className="mb-6 font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-50">
                            Servicios
                        </h4>
                        <ul className="space-y-4 text-zinc-600 dark:text-zinc-400">
                            <li>Páginas Web</li>
                            <li>Aplicaciones Móviles</li>
                            <li>Soporte y gestión Cloud</li>
                            <li>Sistemas de información</li>
                            <li>Ciberseguridad</li>
                            <li>QA | Testeo</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="mb-6 font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-50">
                            Proyectos
                        </h4>
                        <ul className="space-y-4 text-zinc-600 dark:text-zinc-400">
                            <li>Telecafe</li>
                            <li>Centus</li>
                            <li>Qr Supplies</li>
                            <li>ZUM</li>
                            <li>Uriel</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="mb-6 font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-50">
                            Redes
                        </h4>
                        <div className="flex gap-4">
                            {/* Dummy social icons */}
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 transition-colors hover:bg-primary hover:text-white dark:bg-zinc-900">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /></svg>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-16 border-t border-zinc-100 pt-8 text-center dark:border-zinc-900">
                    <p className="text-sm text-zinc-500">
                        Copyright © {new Date().getFullYear()} OPITECH. Designed by Opi Technology SAS
                    </p>
                </div>
            </div>
        </footer>
    );
}
