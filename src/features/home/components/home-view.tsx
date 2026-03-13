import Footer from "@/src/components/ui/Footer";
import Hero from "@/src/components/ui/Hero";
import Navbar from "@/src/components/ui/Navbar";
import Strengths from "@/src/components/ui/Strengths";

export default function HomeView() {
    const services = [
        { name: "Páginas Web", icon: "🌐" },
        { name: "Aplicaciones Móviles", icon: "📱" },
        { name: "Soporte Cloud", icon: "☁️" },
        { name: "Ciberseguridad", icon: "🛡️" },
        { name: "DevOps", icon: "🚀" },
        { name: "Calidad | QA", icon: "✅" },
        { name: "Arquitectura", icon: "🏗️" },
        { name: "Sistemas de Información", icon: "📊" },
    ];

    return (
        <>
            <Navbar />
            <main className="min-h-screen">
                <Hero />

                {/* Aliados Section */}
                <section className="border-y border-zinc-100 bg-white py-12">
                    <div className="container mx-auto px-6 text-center">
                        <h3 className="text-sm font-semibold uppercase tracking-widest text-zinc-400">
                            Nuestros Aliados y Clientes Que Han Confiado en Nosotros
                        </h3>
                        <div className="mt-8 flex flex-wrap justify-center gap-12 opacity-50 grayscale transition-all hover:opacity-100 hover:grayscale-0">
                            {/* Placeholders for logos */}
                            <span className="text-xl font-bold italic">Telecafé</span>
                            <span className="text-xl font-bold italic">Centus</span>
                            <span className="text-xl font-bold italic">QR Supplies</span>
                            <span className="text-xl font-bold italic">ZUM</span>
                            <span className="text-xl font-bold italic">Banco de Proyectos</span>
                        </div>
                    </div>
                </section>

                <Strengths />

                {/* Services Section */}
                <section id="servicios" className="bg-white py-24">
                    <div className="container mx-auto px-6 lg:px-12">
                        <div className="mb-16">
                            <h2 className="text-sm font-bold uppercase tracking-widest text-primary">
                                Nuestros Servicios
                            </h2>
                            <p className="mt-4 text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                                Soluciones integrales de software
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                            {services.map((service, index) => (
                                <div
                                    key={index}
                                    className="flex flex-col items-center justify-center rounded-2xl border border-zinc-200 bg-white p-8 text-center transition-all hover:scale-105 hover:border-primary/20 hover:shadow-xl"
                                >
                                    <span className="mb-4 text-4xl">{service.icon}</span>
                                    <span className="font-semibold text-zinc-900">{service.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Call to Action */}
                <section className="bg-gradient-to-br from-primary to-secondary py-20 text-white">
                    <div className="container mx-auto px-6 text-center lg:px-12">
                        <h2 className="text-4xl font-bold md:text-5xl">¿Listo para transformar tu idea en realidad?</h2>
                        <p className="mx-auto mt-6 max-w-2xl text-lg opacity-90">
                            Llevemos tu proyecto al siguiente nivel con tecnología de punta y metodologías ágiles.
                        </p>
                        <button className="mt-10 rounded-full bg-white px-10 py-4 text-lg font-bold text-primary transition-transform hover:scale-105 active:scale-95">
                            Contáctanos hoy
                        </button>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}