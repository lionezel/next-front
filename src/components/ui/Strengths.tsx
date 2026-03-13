const strengths = [
    {
        title: "Infraestructura sólida",
        description: "Construimos bases tecnológicas robustas y escalables para soportar el crecimiento de tu negocio.",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
        ),
    },
    {
        title: "Seguridad de los datos",
        description: "Protegemos la información más crítica con estándares de seguridad de clase mundial.",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
        ),
    },
    {
        title: "Diseño de UX/UI",
        description: "Creamos interfaces intuitivas y experiencias de usuario que cautivan desde el primer clic.",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>
        ),
    },
    {
        title: "Calidad y Testeo",
        description: "Aseguramos la excelencia mediante ambientes de prueba rigurosos y procesos de QA.",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /></svg>
        ),
    },
];

export default function Strengths() {
    return (
        <section className="bg-white py-24">
            <div className="container mx-auto px-6 lg:px-12">
                <div className="mb-16 text-center">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-primary">
                        Nuestras Fortalezas
                    </h2>
                    <p className="mt-4 text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 md:text-5xl">
                        Construimos bloque por bloque
                    </p>
                    <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
                        Con el Seniority de cada uno de nuestros equipos, construimos fortalezas de código para generar valor real.
                    </p>
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {strengths.map((item, index) => (
                        <div
                            key={index}
                            className="group relative overflow-hidden rounded-3xl border border-zinc-200 bg-white p-8 transition-all hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10"
                        >
                            <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                                {item.icon}
                            </div>
                            <h3 className="mb-3 text-xl font-bold text-zinc-900">
                                {item.title}
                            </h3>
                            <p className="text-zinc-600">
                                {item.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
