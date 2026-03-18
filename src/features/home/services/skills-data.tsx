import { 
    Layers3, 
    MonitorSmartphone, 
    CloudLightning, 
    ShieldCheck, 
    Infinity, 
    LayoutDashboard, 
    Zap 
} from "lucide-react";
import React from "react";

export type HomeService = {
    name: string;
    icon: React.ReactNode;
    desc: string;
    classes: string;
    iconClasses: string;
    image: string;
    hoverGradient: string;
    hoverShadow: string;
};

export const services: HomeService[] = [
    {
        name: "Arquitectura de Software",
        icon: <Layers3 strokeWidth={2.5} size={32} />,
        desc: "Diseñamos la base tecnológica estructural para sistemas complejos de alta concurrencia y escalabilidad.",
        classes: "md:col-span-2 md:row-span-2",
        iconClasses: "bg-white/10",
        image: "/images/services/arquitectura-software.jpeg",
        hoverGradient: "from-primary to-purple-600",
        hoverShadow: "rgba(105,67,203,0.8)"
    },
    {
        name: "Aplicaciones Móviles",
        icon: <MonitorSmartphone strokeWidth={2.5} size={28} />,
        desc: "Apps nativas e híbridas de alto rendimiento.",
        classes: "md:col-span-1 md:row-span-1",
        iconClasses: "bg-primary/10",
        image: "/images/services/aplicaciones-moviles.jpeg",
        hoverGradient: "from-blue-500 to-cyan-400",
        hoverShadow: "rgba(59,130,246,0.8)"
    },
    {
        name: "Soporte Cloud",
        icon: <CloudLightning strokeWidth={2.5} size={28} />,
        desc: "Despliegues infraestructura Serverless y Cloud.",
        classes: "md:col-span-1 md:row-span-1",
        iconClasses: "bg-white",
        image: "/images/services/soporte-cloud.jpeg",
        hoverGradient: "from-orange-500 to-amber-400",
        hoverShadow: "rgba(249,115,22,0.8)"
    },
    {
        name: "Ciberseguridad",
        icon: <ShieldCheck strokeWidth={2.5} size={28} />,
        desc: "Protección estructurada de datos e infraestructura.",
        classes: "md:col-span-1 md:row-span-1",
        iconClasses: "bg-secondary/10",
        image: "/images/services/ciberseguridad.jpeg",
        hoverGradient: "from-red-600 to-rose-400",
        hoverShadow: "rgba(225,29,72,0.8)"
    },
    {
        name: "DevOps & CI/CD",
        icon: <Infinity strokeWidth={2.5} size={28} />,
        desc: "Integración y despliegue continuo automatizado.",
        classes: "md:col-span-1 md:row-span-1",
        iconClasses: "bg-zinc-100",
        image: "/images/services/devops-ci-cd.jpeg",
        hoverGradient: "from-emerald-500 to-teal-400",
        hoverShadow: "rgba(16,185,129,0.8)"
    },
    {
        name: "Sistemas de Información",
        icon: <LayoutDashboard strokeWidth={2.5} size={28} />,
        desc: "Plataformas a medida (ERP, CRM) conectadas a tu modelo de negocio central.",
        classes: "md:col-span-2 md:row-span-1",
        iconClasses: "bg-white",
        image: "/images/services/sistemas-informacion.jpeg",
        hoverGradient: "from-indigo-600 to-blue-400",
        hoverShadow: "rgba(79,70,229,0.8)"
    },
    {
        name: "Calidad y QA",
        icon: <Zap strokeWidth={2.5} size={28} />,
        desc: "Testing automatizado, pruebas de rendimiento y garantía total del código fuente.",
        classes: "md:col-span-2 md:row-span-1",
        iconClasses: "bg-white/10",
        image: "/images/services/calidad-qa.jpeg",
        hoverGradient: "from-violet-600 to-fuchsia-400",
        hoverShadow: "rgba(139,92,246,0.8)"
    }
];