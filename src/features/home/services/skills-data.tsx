import { 
    Code2, 
    Smartphone, 
    Cloud, 
    ShieldCheck, 
    GitBranch, 
    BarChart3, 
    CheckCircle2 
} from "lucide-react";
import React from "react";

export type HomeService = {
    name: string;
    icon: React.ReactNode;
    desc: string;
    classes: string;
    iconClasses: string;
    image: string;
};

export const services: HomeService[] = [
    {
        name: "Arquitectura de Software",
        icon: <Code2 strokeWidth={1.5} />,
        desc: "Diseñamos la base tecnológica estructural para sistemas complejos de alta concurrencia y escalabilidad.",
        classes: "md:col-span-2 md:row-span-2",
        iconClasses: "bg-white/10",
        image: "/images/services/arquitectura-software.jpeg"
    },
    {
        name: "Aplicaciones Móviles",
        icon: <Smartphone strokeWidth={1.5} />,
        desc: "Apps nativas e híbridas de alto rendimiento.",
        classes: "md:col-span-1 md:row-span-1",
        iconClasses: "bg-primary/10",
        image: "/images/services/aplicaciones-moviles.jpeg"
    },
    {
        name: "Soporte Cloud",
        icon: <Cloud strokeWidth={1.5} />,
        desc: "Despliegues infraestructura Serverless y Cloud.",
        classes: "md:col-span-1 md:row-span-1",
        iconClasses: "bg-white",
        image: "/images/services/soporte-cloud.jpeg"
    },
    {
        name: "Ciberseguridad",
        icon: <ShieldCheck strokeWidth={1.5} />,
        desc: "Protección estructurada de datos e infraestructura.",
        classes: "md:col-span-1 md:row-span-1",
        iconClasses: "bg-secondary/10",
        image: "/images/services/ciberseguridad.jpeg"
    },
    {
        name: "DevOps & CI/CD",
        icon: <GitBranch strokeWidth={1.5} />,
        desc: "Integración y despliegue continuo automatizado.",
        classes: "md:col-span-1 md:row-span-1",
        iconClasses: "bg-zinc-100",
        image: "/images/services/devops-ci-cd.jpeg"
    },
    {
        name: "Sistemas de Información",
        icon: <BarChart3 strokeWidth={1.5} />,
        desc: "Plataformas a medida (ERP, CRM) conectadas a tu modelo de negocio central.",
        classes: "md:col-span-2 md:row-span-1",
        iconClasses: "bg-white",
        image: "/images/services/sistemas-informacion.jpeg"
    },
    {
        name: "Calidad y QA",
        icon: <CheckCircle2 strokeWidth={1.5} />,
        desc: "Testing automatizado, pruebas de rendimiento y garantía total del código fuente.",
        classes: "md:col-span-2 md:row-span-1",
        iconClasses: "bg-white/10",
        image: "/images/services/calidad-qa.jpeg"
    }
];