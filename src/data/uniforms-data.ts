export interface ProductItem {
  id: string;
  name: string;
  category: "industrial" | "corporativo" | "salud" | "gastronomia" | "calzado_epp" | "personalizacion";
  categoryLabel: string;
  shortDesc: string;
  description: string;
  fabric: string;
  composition: string;
  basePrice: number; // in COP (Colombian Pesos)
  image: string;
  availableColors: { name: string; hex: string }[];
  features: string[];
  recommendedUse: string;
  popular?: boolean;
}

export interface CategoryItem {
  id: "industrial" | "corporativo" | "salud" | "gastronomia" | "calzado_epp" | "personalizacion";
  name: string;
  tagline: string;
  description: string;
  iconName: string;
  image: string;
  itemCount: number;
}

export const CATEGORIES: CategoryItem[] = [
  {
    id: "industrial",
    name: "Línea Industrial & Operativa",
    tagline: "Resistencia máxima para trabajos pesados",
    description: "Confeccionados en dril reforzado, costuras triples, tela retardante y cintas reflectivas normadas 3M para máxima seguridad y durabilidad.",
    iconName: "HardHat",
    image: "/images/products/industrial.jpg",
    itemCount: 8,
  },
  {
    id: "corporativo",
    name: "Línea Corporativa & Ejecutiva",
    tagline: "Elegancia, presencia y confort diario",
    description: "Camisas oxford, pantalones de vestir, blusas y chaquetas ejecutivas con cortes ergonómicos que proyectan la mejor imagen institucional.",
    iconName: "Briefcase",
    image: "/images/products/corporativo.jpg",
    itemCount: 6,
  },
  {
    id: "salud",
    name: "Línea Salud & Antifluido",
    tagline: "Protección biológica y máxima ligereza",
    description: "Scrub suits médicos, batas y uniformes clínicos en tela antifluido Lafayette, resistentes al cloro, de secado rápido y tacto suave.",
    iconName: "Stethoscope",
    image: "/images/products/salud.jpg",
    itemCount: 6,
  },
  {
    id: "gastronomia",
    name: "Línea Gastronomía & Alimentos",
    tagline: "Diseño ergonómico y frescura en cocina",
    description: "Filipinas de chef, delantales resistentes a manchas y calor, gorros y uniformes de servicio pensados para el ritmo exigente de restaurantes y hoteles.",
    iconName: "UtensilsCrossed",
    image: "/images/products/gastronomia.jpg",
    itemCount: 5,
  },
  {
    id: "personalizacion",
    name: "Bordado & Personalización Textil",
    tagline: "Tu marca con acabados de alta definición",
    description: "Bordado computarizado multicabezal, estampado DTF ultra durable y parches corporativos que garantizan una fidelidad de color inigualable.",
    iconName: "Sparkles",
    image: "/images/products/bordados.jpg",
    itemCount: 4,
  },
];

export const PRODUCTS: ProductItem[] = [
  {
    id: "camisa-dril-industrial",
    name: "Camisa Dril Trabajo Pesado con Reflectivo",
    category: "industrial",
    categoryLabel: "Industrial & Operativo",
    shortDesc: "Camisa en dril 100% algodón con cintas reflectivas 3M y doble bolsillo superior.",
    description: "Diseñada para jornadas exigentes en construcción, logística, minería y mantenimiento. Cuenta con costuras reforzadas con doble aguja y botones de alta resistencia.",
    fabric: "Dril Vulcano / Dril 100% Algodón",
    composition: "100% Algodón 280g/m²",
    basePrice: 58000,
    image: "/images/products/industrial.jpg",
    availableColors: [
      { name: "Azul Petróleo / Navy", hex: "#162844" },
      { name: "Khaki / Arena", hex: "#1B3A6B" },
      { name: "Gris Oscuro", hex: "#374151" },
      { name: "Naranja Seguridad", hex: "#EA580C" },
    ],
    features: [
      "Cintas reflectivas de 2 pulgadas normadas",
      "Bolsillos dobles con tapa y portaesfero",
      "Tratamiento prelavado anti-encogimiento",
      "Costuras con triple puntada de seguridad",
    ],
    recommendedUse: "Minería, Construcción, Almacén, Operaciones de campo",
    popular: true,
  },
  {
    id: "pantalon-cargo-dril",
    name: "Pantalón Cargo Industrial Reforzado",
    category: "industrial",
    categoryLabel: "Industrial & Operativo",
    shortDesc: "Pantalón con 6 bolsillos utilitarios, refuerzo en rodillas y tiro reforzado.",
    description: "Confeccionado en dril pesado de alto gramaje para máxima resistencia al rasgado y fricción en labores mecánicas e industriales.",
    fabric: "Dril Pesado 7x7",
    composition: "100% Algodón 310g/m²",
    basePrice: 65000,
    image: "/images/products/industrial.jpg",
    availableColors: [
      { name: "Azul Marino", hex: "#0F1D36" },
      { name: "Khaki Arena", hex: "#1B3A6B" },
      { name: "Gris Cemento", hex: "#4B5563" },
      { name: "Negro", hex: "#111827" },
    ],
    features: [
      "Bolsillos laterales cargo con fuelle y cierre velcro",
      "Refuerzo en entrepierna y rodillas",
      "Pretina con pasadores anchos reforzados",
      "Cremallera metálica de uso rudo YKK",
    ],
    recommendedUse: "Talleres mecánicos, Construcción, Montaje industrial",
    popular: true,
  },
  {
    id: "overol-industrial-enterizo",
    name: "Overol Enterizo Industrial Bicolor",
    category: "industrial",
    categoryLabel: "Industrial & Operativo",
    shortDesc: "Overol completo con cremallera de doble vía y elástico en cintura para movilidad.",
    description: "Protección integral para el operario frente a suciedad, polvo y abrasión mecánica. Acabado ergonómico que facilita la flexión.",
    fabric: "Dril San Jacinto / Vulcano",
    composition: "65% Poliéster / 35% Algodón",
    basePrice: 89000,
    image: "/images/products/industrial.jpg",
    availableColors: [
      { name: "Azul Marino con detalles Khaki", hex: "#162844" },
      { name: "Gris con detalles Naranja", hex: "#374151" },
      { name: "Rojo Seguridad", hex: "#DC2626" },
    ],
    features: [
      "Cremallera frontal doble sentido metálica",
      "6 bolsillos estratégicos + porta metro",
      "Elástico trasero para ajuste ergonómico",
      "Opción de reflectivo en brazos, piernas y espalda",
    ],
    recommendedUse: "Plantas de producción, Minería, Metalmecánica",
  },
  {
    id: "camisa-oxford-ejecutiva",
    name: "Camisa Oxford Corporativa Manga Larga",
    category: "corporativo",
    categoryLabel: "Corporativo & Ejecutivo",
    shortDesc: "Camisa ejecutiva de textura suave, cuello fusionado indeformable y fácil planchado.",
    description: "La prenda insignia para el personal de oficina, atención al cliente y directivos. Mantiene una apariencia fresca, impecable y profesional durante toda la jornada.",
    fabric: "Tela Oxford Premium / Fil a Fil",
    composition: "60% Algodón / 40% Poliéster Easy Iron",
    basePrice: 52000,
    image: "/images/products/corporativo.jpg",
    availableColors: [
      { name: "Azul Celeste", hex: "#93C5FD" },
      { name: "Blanco Puro", hex: "#FFFFFF" },
      { name: "Azul Marino", hex: "#0F1D36" },
      { name: "Gris Plata", hex: "#CBD5E1" },
      { name: "Rosa Pastel", hex: "#FBCFE8" },
    ],
    features: [
      "Cuello y puños fusionados con entretela de alta calidad",
      "Tratamiento Easy Care (fácil planchado)",
      "Corte Regular Fit y Slim Fit disponibles",
      "Bolsillo de pecho opcional",
    ],
    recommendedUse: "Bancos, Asesores comerciales, Oficinas corporativas, Hotelería",
    popular: true,
  },
  {
    id: "blusa-ejecutiva-oxford",
    name: "Blusa Ejecutiva Entallada",
    category: "corporativo",
    categoryLabel: "Corporativo & Ejecutivo",
    shortDesc: "Corte femenino anatómico con pinzas de entalle y botones a tono.",
    description: "Diseño contemporáneo que brinda comodidad y distinción en ambientes corporativos y comerciales.",
    fabric: "Popelina Stretch / Oxford Fino",
    composition: "97% Algodón / 3% Spandex",
    basePrice: 54000,
    image: "/images/products/corporativo.jpg",
    availableColors: [
      { name: "Blanco Óptico", hex: "#FFFFFF" },
      { name: "Azul Cielo", hex: "#BAE6FD" },
      { name: "Azul Noche", hex: "#162844" },
      { name: "Marfil Suave", hex: "#FEF3C7" },
    ],
    features: [
      "Pinzas delanteras y traseras para ajuste estético",
      "Tela con ligera elasticidad para libertad de movimiento",
      "Botonadura oculta o visible",
      "Acabado anti-arrugas",
    ],
    recommendedUse: "Personal administrativo, Recepción, Ventas corporativas",
  },
  {
    id: "pantalon-formal-ejecutivo",
    name: "Pantalón de Vestir Formal Ejecutivo",
    category: "corporativo",
    categoryLabel: "Corporativo & Ejecutivo",
    shortDesc: "Pantalón en lino poliéster con pretina anatómica y caída elegante.",
    description: "Elegancia y resistencia al uso continuo sin perder la forma ni el color tras múltiples lavados.",
    fabric: "Dril Gabardina / Lino Poliéster",
    composition: "70% Poliéster / 30% Rayón Viscosa",
    basePrice: 62000,
    image: "/images/products/corporativo.jpg",
    availableColors: [
      { name: "Azul Marino Oscuro", hex: "#0F1D36" },
      { name: "Negro Clásico", hex: "#111827" },
      { name: "Gris Humo", hex: "#4B5563" },
      { name: "Beige Trigo", hex: "#D4B996" },
    ],
    features: [
      "Bolsillos tipo sastre con forro reforzado",
      "Cierre con gancho metálico y botón de seguridad",
      "Telas resistentes al pilling (anti-motas)",
    ],
    recommendedUse: "Equipos directivos, Personal de atención, Eventos",
  },
  {
    id: "scrub-medico-antifluido",
    name: "Conjunto Médico Antifluido Jogger + Filipina",
    category: "salud",
    categoryLabel: "Salud & Antifluido",
    shortDesc: "Conjunto scrub moderno con tecnología repelente de líquidos y cloro-resistente.",
    description: "Prenda de última generación para personal médico y de salud. Tela con elasticidad bidireccional, suave al tacto y de secado ultra rápido.",
    fabric: "Microfibra Antifluido Lafayette / Stretch",
    composition: "95% Poliéster / 5% Elastano",
    basePrice: 78000,
    image: "/images/products/salud.jpg",
    availableColors: [
      { name: "Azul Marino Distripako", hex: "#0F1D36" },
      { name: "Verde Quirófano", hex: "#0D9488" },
      { name: "Azul Real / Royal", hex: "#2563EB" },
      { name: "Negro Azabache", hex: "#18181B" },
      { name: "Vino Tinto / Burdeos", hex: "#881337" },
    ],
    features: [
      "Tecnología antifluido que repele gotas y salpicaduras",
      "Pantalón estilo Jogger con bota elástica y 5 bolsillos",
      "Filipina con cuello en V ergonómico y bolsillo porta credencial",
      "No requiere planchado, secado exprés",
    ],
    recommendedUse: "Clínicas, Hospitales, Odontología, Laboratorios, Veterinarias",
    popular: true,
  },
  {
    id: "bata-laboratorio-antifluido",
    name: "Bata Médica y de Laboratorio Antifluido",
    category: "salud",
    categoryLabel: "Salud & Antifluido",
    shortDesc: "Bata manga larga con puño rib o elástico, 3 bolsillos delanteros y broches rápidos.",
    description: "Barrera de protección higiénica y profesional para personal de laboratorio, farmacéutico y consultorios.",
    fabric: "Antifluido Universal 100% Poliéster",
    composition: "100% Poliéster 160g/m²",
    basePrice: 59000,
    image: "/images/products/salud.jpg",
    availableColors: [
      { name: "Blanco Clínico", hex: "#FFFFFF" },
      { name: "Azul Marino", hex: "#0F1D36" },
      { name: "Azul Quirúrgico", hex: "#0284C7" },
    ],
    features: [
      "Broches de presión de acero inoxidable o botones ocultos",
      "Puños en rib antifluido para evitar enganches",
      "Aberturas laterales para acceso a bolsillos interiores",
      "Cinturón trasero con pinzas de ajuste",
    ],
    recommendedUse: "Química, Farmacia, Microbiología, Estética y Cosmética",
  },
  {
    id: "filipina-chef-profesional",
    name: "Filipina de Chef Ejecutiva con Malla Transpirable",
    category: "gastronomia",
    categoryLabel: "Gastronomía & Alimentos",
    shortDesc: "Chaqueta de cocina con doble pechera cruzada, botones desmontables y espalda fresca.",
    description: "Diseño ergonómico para cocineros y chefs profesionales. Paneles de malla de alta tecnología en espalda y axilas para disipación de calor.",
    fabric: "Dril Liviano Polialgodón con Malla Dry-Fit",
    composition: "65% Poliéster / 35% Algodón 210g/m²",
    basePrice: 72000,
    image: "/images/products/gastronomia.jpg",
    availableColors: [
      { name: "Negro con vivo Dorado Arena", hex: "#18181B" },
      { name: "Blanco Chef Tradicional", hex: "#FFFFFF" },
      { name: "Azul Marino Chef", hex: "#0F1D36" },
      { name: "Gris Carbón", hex: "#374151" },
    ],
    features: [
      "Doble pechera reversible contra manchas y calor",
      "Panel de malla transpirable Cool-Vent en espalda",
      "Bolsillo portalápices / termómetro en manga izquierda",
      "Botones de presión reforzados",
    ],
    recommendedUse: "Restaurantes, Hoteles, Escuelas de cocina, Panaderías gourmet",
    popular: true,
  },
  {
    id: "delantal-mandil-barista-chef",
    name: "Delantal Mandil Premium con Apliques en Cuero",
    category: "gastronomia",
    categoryLabel: "Gastronomía & Alimentos",
    shortDesc: "Delantal con tirantes cruzados en espalda, bolsillo canguro y acabados en lona resistente.",
    description: "Estilo rústico-elegante para baristas, bartenders, meseros y parrilleros. Elimina la tensión del cuello gracias a sus cargaderas cruzadas.",
    fabric: "Lona Dril Pesada 100% Algodón",
    composition: "100% Algodón 340g/m²",
    basePrice: 48000,
    image: "/images/products/gastronomia.jpg",
    availableColors: [
      { name: "Negro Carbón con Correas Cuero", hex: "#1F2937" },
      { name: "Arena Khaki con detalles Bronce", hex: "#1B3A6B" },
      { name: "Azul Denim", hex: "#1E3A5F" },
      { name: "Verde Olivo Militar", hex: "#3F4F38" },
    ],
    features: [
      "Tirantes ajustables en X para comodidad dorsal",
      "Mosquetones y herrajes metálicos de alta gama",
      "Bolsillo central porta comandera y paño",
      "Ideal para bordado de marca de restaurante",
    ],
    recommendedUse: "Cafés de especialidad, Bares, Pizzerías, Asaderos",
  },
  {
    id: "servicio-bordado-computarizado",
    name: "Bordado Computarizado HD de Logotipos",
    category: "personalizacion",
    categoryLabel: "Bordado & Personalización",
    shortDesc: "Bordado industrial de alta densidad con hilos de poliéster y metalizados resistentes al cloro.",
    description: "Digitalizamos y bordamos el escudo o logotipo de tu empresa con precisión milimétrica. Hilos de colores vivos que soportan lavados industriales intensivos.",
    fabric: "Hilos Madeira / Isacord Poliéster de Alta Tenacidad",
    composition: "100% Poliéster Brillante / Hilos Metálicos",
    basePrice: 8000,
    image: "/images/products/bordados.jpg",
    availableColors: [
      { name: "Dorado Metalizado", hex: "#1B3A6B" },
      { name: "Azul Marino", hex: "#0F1D36" },
      { name: "Blanco Hielo", hex: "#FFFFFF" },
      { name: "Plata Brillante", hex: "#E2E8F0" },
    ],
    features: [
      "Hasta 12 colores simultáneos por bordado",
      "Puntadas compactas de alta definición",
      "Resistencia a blanqueadores y lavado a vapor",
      "Digitalización de matriz (matrizado) profesional",
    ],
    recommendedUse: "Toda clase de uniformes, gorras, chaquetas y delantales",
    popular: true,
  },
];

export const CUSTOMIZATION_OPTIONS = [
  {
    id: "sin-personalizar",
    name: "Sin Personalización",
    description: "Prendas lisas terminadas de fábrica sin logos adicionales.",
    pricePerUnit: 0,
    icon: "Slash",
  },
  {
    id: "bordado-pecho",
    name: "Bordado en Pecho (Logo ~9cm)",
    description: "Bordado computarizado de logotipo corporativo en pecho izquierdo o derecho.",
    pricePerUnit: 8000,
    icon: "Sparkles",
    badge: "Más Popular",
  },
  {
    id: "bordado-pecho-espalda",
    name: "Bordado Pecho + Espalda Grande",
    description: "Logo en pecho y texto/logotipo grande en la espalda (hasta 25cm).",
    pricePerUnit: 15000,
    icon: "Sparkles",
  },
  {
    id: "estampado-dtf",
    name: "Estampado DTF Textil Full Color",
    description: "Impresión digital térmica directa a film con degradados y colores vivos.",
    pricePerUnit: 9500,
    icon: "Palette",
  },
  {
    id: "reflectivo-3m",
    name: "Adición de Cintas Reflectivas 3M",
    description: "Cintas de 2 pulgadas de alta visibilidad para brazos, pecho o piernas.",
    pricePerUnit: 7000,
    icon: "Sun",
  },
];

export const VOLUME_DISCOUNTS = [
  { min: 1, max: 24, discountPct: 0, label: "1 a 24 unidades (Precio Base)", badge: "Pedido Mínimo 12" },
  { min: 25, max: 49, discountPct: 5, label: "25 a 49 unidades (-5%)", badge: "Ahorro Pyme" },
  { min: 50, max: 149, discountPct: 12, label: "50 a 149 unidades (-12%)", badge: "Recomendado" },
  { min: 150, max: 499, discountPct: 18, label: "150 a 499 unidades (-18%)", badge: "Mayorista" },
  { min: 500, max: 99999, discountPct: 25, label: "500+ unidades (-25%)", badge: "Gran Empresa / Fábrica" },
];

export const COMPANY_INFO = {
  name: "DISTRI PAKO",
  legalName: "Distripako Dotaciones & Uniformes Industriales",
  tagline: "Uniformes Industriales, Dotaciones Empresariales & Bordado Computarizado",
  phone: "+57 305 216 5507",
  whatsappNumber: "573052165507",
  email: "comercial@distripako.com",
  address: "Medellín / Bogotá - Despachos a toda Colombia",
  schedule: "Lunes a Viernes: 8:00 AM - 6:00 PM | Sábados: 8:00 AM - 1:00 PM",
  experienceYears: "10+",
  deliveredUniforms: "250.000+",
  satisfiedClients: "450+",
  coverage: "Nivel Nacional (Colombia)",
};
