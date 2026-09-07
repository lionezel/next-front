import { Project } from "../types/project.type";

export const projectsData: Project[] = [
  {
    id: "consorcio-industrial",
    title: "Consorcio Minero & Vial",
    subtitle: "Dotación Industrial Pesada & Seguridad 3M",
    description: "Confección y entrega de más de 4.500 prendas de trabajo pesado en dril 100% algodón con costuras triples de seguridad y cintas reflectivas normadas de alta visibilidad para más de 900 operarios en terreno y planta.",
    heroImage: "/images/products/industrial.jpg",
    vanguardImage: "/images/products/industrial.jpg",
    logo: "/distripako-icon.png",
    techStack: [
      { name: "Dril Vulcano 7x7", icon: "Layers", category: "Textil" },
      { name: "Reflectivo 3M", icon: "Sun", category: "Seguridad" },
      { name: "Bordado HD", icon: "Sparkles", category: "Personalización" },
    ],
    features: [
      {
        title: "Alta Resistencia al Rasgado",
        description: "Gramaje superior de 310g/m² para soportar fricción mecánica constante y soldadura.",
      },
      {
        title: "Rotulado Individual por Operario",
        description: "Empaque individual con nombre, cédula y talla para entrega ágil en campamentos.",
      },
      {
        title: "Cumplimiento de Pliegos de Seguridad",
        description: "Certificados de calidad de tela y reflectividad entregados a la interventoría.",
      },
    ],
    overview: {
      vision: "Equipar a 900 operarios con dotación de máxima seguridad y confort térmico en jornadas de 12 horas.",
      highlight1: "4.500+ Prendas Entregadas",
      highlight2: "Cero Devoluciones",
    },
    stats: {
      indicator: "🏗️",
      title: "Despacho Eficiente",
      description: "Entrega completa en 18 días hábiles en 4 frentes de obra simultáneos.",
      statusLabel: "Entrega Exitosa",
    },
    design: {
      description: "Diseño ergonómico con fuelles en espalda y refuerzo en rodillas con combinación Azul Noche y Khaki.",
      palette: ["#0F1D36", "#1B3A6B", "#F8FAFC"],
      screenshots: [
        "/images/products/industrial.jpg",
        "/images/products/bordados.jpg",
      ],
    },
  },
  {
    id: "red-hospitalaria",
    title: "Red Hospitalaria & Clínicas",
    subtitle: "Dotación Médica Antifluido & Laboratorio",
    description: "Suministro de uniformes clínicos tipo jogger antifluido Lafayette y batas médicas para 1.200 profesionales de la salud. Telas repelentes al agua y resistentes al cloro con bordado de especialidad médica.",
    heroImage: "/images/products/salud.jpg",
    vanguardImage: "/images/products/salud.jpg",
    logo: "/distripako-icon.png",
    techStack: [
      { name: "Antifluido Lafayette", icon: "Layers", category: "Textil" },
      { name: "Bordado Institucional", icon: "Sparkles", category: "Personalización" },
      { name: "Corte Ergonómico Jogger", icon: "Scissors", category: "Confección" },
    ],
    features: [
      {
        title: "Protección Repelente Antifluido",
        description: "Barrera biológica que previene el paso de salpicaduras y fluidos corporales.",
      },
      {
        title: "Secado Rápido y Fácil Planchado",
        description: "Tela liviana de tacto suave que no absorbe manchas y seca en minutos.",
      },
      {
        title: "Bordado de Logo y Nombre",
        description: "Identificación bordada con alta definición del nombre y especialidad del médico.",
      },
    ],
    overview: {
      vision: "Modernizar la imagen del personal asistencial con prendas flexibles, frescas y elegantes.",
      highlight1: "1.200 Médicos y Enfermeros",
      highlight2: "Garantía de Color",
    },
    stats: {
      indicator: "🏥",
      title: "Satisfacción 100%",
      description: "Aprobación total por parte del comité de salud ocupacional de la clínica.",
      statusLabel: "Dotación Activa",
    },
    design: {
      description: "Paleta Azul Marino Distripako y Verde Quirófano con bordados en hilo blanco perla.",
      palette: ["#0F1D36", "#0D9488", "#FFFFFF"],
      screenshots: [
        "/images/products/salud.jpg",
        "/images/products/bordados.jpg",
      ],
    },
  },
  {
    id: "cadena-restaurantes",
    title: "Cadena de Restaurantes Gourmet",
    subtitle: "Uniformes Gastronómicos & Delantales en Cuero",
    description: "Diseño y confección de filipinas ejecutivas con espalda de malla transpirable y delantales mandil con herrajes metálicos y cargaderas en cuero para cocineros, bartenders y meseros.",
    heroImage: "/images/products/gastronomia.jpg",
    vanguardImage: "/images/products/gastronomia.jpg",
    logo: "/distripako-icon.png",
    techStack: [
      { name: "Dril Algodón Pesado", icon: "Layers", category: "Textil" },
      { name: "Apliques de Cuero", icon: "Sparkles", category: "Detalles" },
      { name: "Malla Cool-Vent", icon: "Sun", category: "Frescura" },
    ],
    features: [
      {
        title: "Disipación de Calor en Cocina",
        description: "Paneles transpirables que reducen la sensación térmica frente a fogones y hornos.",
      },
      {
        title: "Estilo Rústico Contemporáneo",
        description: "Refuerza la identidad visual de la marca y eleva la experiencia del comensal.",
      },
      {
        title: "Resistencia a Grasas y Lavado Continuo",
        description: "Telas tratadas que conservan su color oscuro y textura firme.",
      },
    ],
    overview: {
      vision: "Brindar una imagen premium y uniforme en las 14 sedes de la cadena restaurantera.",
      highlight1: "14 Restaurantes Equipados",
      highlight2: "Bordado Dorado",
    },
    stats: {
      indicator: "🍳",
      title: "Impacto Visual",
      description: "Mejora sustancial en la presentación del personal de cocina y servicio.",
      statusLabel: "Cliente Frecuente",
    },
    design: {
      description: "Negro carbón con vivos en tono arena tostada y correas de cuero café moka.",
      palette: ["#18181B", "#1B3A6B", "#451A03"],
      screenshots: [
        "/images/products/gastronomia.jpg",
        "/images/products/bordados.jpg",
      ],
    },
  },
  {
    id: "banca-corporativa",
    title: "Entidad Financiera & Seguros",
    subtitle: "Camisería Oxford & Vestuario Ejecutivo",
    description: "Dotación corporativa de camisas y blusas oxford de corte sastre, pantalones formales y chaquetas institucionales para 850 asesores comerciales en oficinas principales.",
    heroImage: "/images/products/corporativo.jpg",
    vanguardImage: "/images/products/corporativo.jpg",
    logo: "/distripako-icon.png",
    techStack: [
      { name: "Oxford Fil a Fil", icon: "Layers", category: "Textil" },
      { name: "Easy Iron", icon: "Sparkles", category: "Tecnología" },
      { name: "Corte Slim & Regular", icon: "Scissors", category: "Confección" },
    ],
    features: [
      {
        title: "Tratamiento Anti-Arrugas",
        description: "Las prendas mantienen su presencia lisa e impecable durante todo el día laboral.",
      },
      {
        title: "Cuellos Fusionados de Alta Durabilidad",
        description: "Estructura que no se deforma tras decenas de lavados domésticos.",
      },
      {
        title: "Bordado Discreto y Elegante",
        description: "Monograma corporativo bordado en tono sobre tono en el puño o pecho.",
      },
    ],
    overview: {
      vision: "Proyectar seriedad, confianza y modernidad en la atención a clientes bancarios.",
      highlight1: "850 Asesores Comerciales",
      highlight2: "Ajuste a Medida",
    },
    stats: {
      indicator: "💼",
      title: "Presencia Corporativa",
      description: "Estandarización del código de vestimenta en 32 agencias a nivel nacional.",
      statusLabel: "Contrato Anual",
    },
    design: {
      description: "Azul cielo ejecutivo y blanco puro combinados con pantalón azul marino noche.",
      palette: ["#93C5FD", "#0F1D36", "#FFFFFF"],
      screenshots: [
        "/images/products/corporativo.jpg",
        "/images/products/bordados.jpg",
      ],
    },
  },
];
