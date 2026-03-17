import { Project } from "../types/project.type";

export const projectsData: Project[] = [
    {
        id: "restabar",
        title: "Restabar la bello",
        subtitle: "Ecosistema Digital Turístico",
        description: "Restabar es un restaurante, el cual se acerco a nosotros con la necesidad de optimizar tiempo en la gestion de sus pedidos. en el transcurso de la realizacion de su software tambien vimos la necesidad de tener una mayor claridad en cuanto a el orden de su inventario y las metricas de su negocio. Por lo cual decidimos crear un software que permitiera gestionar los pedidos, el inventario y sus metricas. mas a detalle nuestro software tiene unos puntos claves: tiene conctividad inalambrica la cual permitia realizar pedidos desde un dispositivo movil y la comanda se imprimiera de forma automaticca en cocina, aparte de eso tiene un dashboard que permite ver las metricas de su negocio en tiempo real. cabe recalcar que cada parte del software fue hecho a medida milimetrica de la necesidad de nuestro cliente.    Tu comodidad es nuestra PRIORIdad.",
        heroImage: "/projects/centus-hero.jpg",
        logo: "/logos/restabar.png",
        techStack: [
            { name: "Nextjs", icon: "Nextjs", category: "Frontend" },
            { name: "Tailwind", icon: "Tailwind", category: "Styling" },
            { name: "Firebase", icon: "Firebase", category: "Database" },
        ],
        features: [
            {
                title: "Alianzas Estratégicas",
                description: "Conexión directa con los líderes del mercado para expandir el alcance de tu negocio."
            },
            {
                title: "Centralización",
                description: "Toda la gestión de tu inventario y tarifas en un solo lugar con sincronización en tiempo real."
            },
            {
                title: "Business Intelligence",
                description: "Dashboards avanzados para analizar tendencias de mercado y rendimiento interno."
            }
        ],
        overview: {
            vision: "Diseñamos una plataforma que no solo resuelve problemas técnicos, sino que potencia el modelo de negocio. Restabar se convierte en el núcleo operativo para empresas que buscan escala global.",
            highlight1: "+4 Integraciones Core",
            highlight2: "Cloud Native"
        },
        stats: {
            indicator: "🚀",
            title: "Escalabilidad",
            description: "Arquitectura pensada para manejar picos de demanda turística sin comprometer latencia.",
            statusLabel: "Producción Activa"
        },
        design: {
            description: "Un sistema de diseño impresionante que combina elegancia, funcionalidad y modernidad. Basado en Material Design con una sinergia de colores única que ofrece una experiencia de usuario humana y fluida.",
            palette: ["#6943CB", "#ae0b8e", "#205EA9", "#f3f4f6"],
            screenshots: [
                "/projects/centus-ss1.jpg",
                "/projects/centus-ss2.jpg",
                "/projects/centus-ss3.jpg"
            ]
        }
    },
    {
        id: "impacto",
        title: "Impacto",
        subtitle: "Plataforma de Medios Digitales",
        description: "IMPACTO es una perfumeria, la cual se acerco a nosotros con la necesidad principal de exponer de mejor manera su negocio en la web. Por lo cual decidimos crear un software tipo e-commerce que permitiera gestionar su inventario y ventas de forma online.",
        heroImage: "/projects/telecafe-hero.jpg",
        logo: "/logos/impacto.png",
        techStack: [
            { name: "Next.js", icon: "Next", category: "Frontend" },
            { name: "Tailwind CSS", icon: "Tailwind", category: "Styling" },
            { name: "Vercel", icon: "Vercel", category: "Infrastructure" },
            { name: "Strapi", icon: "Strapi", category: "CMS" }
        ],
        features: [
            {
                title: "Streaming 24/7",
                description: "Integración de transmisión en vivo con baja latencia y alta disponibilidad."
            },
            {
                title: "Gestión de Contenidos",
                description: "Sistema robusto para la publicación inmediata de noticias y programas."
            },
            {
                title: "Optimización SEO",
                description: "Estructura optimizada para motores de búsqueda, aumentando el tráfico orgánico en un 40%."
            }
        ],
        overview: {
            vision: "Creamos una experiencia mediática inmersiva que conecta a la audiencia regional con contenido de calidad. Impacto redefine el consumo de noticias en el Eje Cafetero.",
            highlight1: "+1M Visitas Mensuales",
            highlight2: "Streaming HQ"
        },
        stats: {
            indicator: "📺",
            title: "Rendimiento",
            description: "Optimizado para entrega de contenido ultra rápida y streaming sin interrupciones.",
            statusLabel: "Operativo"
        },
        design: {
            description: "Una interfaz vibrante que refleja la identidad cultural del Eje Cafetero. Uso de colores tierra combinados con una tipografía moderna y una disposición de elementos tipo 'Newsroom' que facilita el consumo de información.",
            palette: ["#8B4513", "#D2691E", "#F4A460", "#ffffff"],
            screenshots: [
                "/projects/telecafe-ss1.jpg",
                "/projects/telecafe-ss2.jpg"
            ]
        }
    }
];
