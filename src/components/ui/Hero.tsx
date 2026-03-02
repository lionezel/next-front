export default function Hero() {
    return (
        <section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden bg-white pt-20 dark:bg-black">
            {/* Decorative background elements */}
            <div className="absolute top-1/4 -left-20 h-96 w-96 rounded-full bg-primary/10 blur-3xl"></div>
            <div className="absolute bottom-1/4 -right-20 h-96 w-96 rounded-full bg-secondary/10 blur-3xl"></div>

            <div className="container relative z-10 px-6 text-center lg:px-12">
                <div className="mx-auto max-w-4xl space-y-8">
                    <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary shadow-sm backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-1000">
                        <span className="mr-2 inline-block h-2 w-2 animate-pulse rounded-full bg-primary"></span>
                        Expertos en IA y Software a Medida
                    </div>

                    <h1 className="text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 md:text-7xl lg:leading-[1.1] animate-in fade-in slide-in-from-bottom-8 duration-1000">
                        Ayudamos a las personas a conectar con sus <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">mentores adecuados</span>
                    </h1>

                    <p className="mx-auto max-w-2xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-400 md:text-xl animate-in fade-in slide-in-from-bottom-12 duration-1000">
                        Contamos con los mentores adecuados para cualquier trabajo. Te encontraremos el mentor correcto y te ayudaremos a conectarte con ellos de manera fácil y efectiva.
                    </p>

                    <div className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row animate-in fade-in slide-in-from-bottom-16 duration-1000">
                        <button className="group relative flex h-14 w-full items-center justify-center gap-2 rounded-full bg-zinc-900 px-8 text-lg font-semibold text-white transition-all hover:bg-zinc-800 dark:bg-zinc-50 dark:text-black sm:w-auto">
                            Empezar ahora
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="transition-transform group-hover:translate-x-1"
                            >
                                <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                            </svg>
                        </button>
                        <button className="flex h-14 w-full items-center justify-center rounded-full border border-zinc-200 px-8 text-lg font-semibold transition-all hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900 sm:w-auto">
                            Ver Servicios
                        </button>
                    </div>

                    <div className="pt-12 animate-in fade-in duration-1000 delay-500">
                        <p className="text-sm font-semibold uppercase tracking-widest text-zinc-400">
                            Con metodologías ágiles generamos valor rápidamente a tu producto
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
