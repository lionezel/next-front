export interface Partner {
  id: string;
  name: string;
  logoUrl: string; // URL in Firebase Storage or local path /logos/id.png
  description?: string;
  website?: string;
  order?: number;
  active: boolean;
  createdAt?: string | number | any;
  updatedAt?: string | number | any;
}

export interface ProductColor {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  name: string;
  category: "industrial" | "corporativo" | "salud" | "gastronomia" | "calzado_epp" | "personalizacion" | string;
  categoryLabel: string;
  shortDesc: string;
  description: string;
  fabric: string;
  composition: string;
  basePrice: number; // in COP
  image: string; // Firebase Storage URL or local path
  galleryImages?: string[];
  availableColors: ProductColor[];
  availableSizes?: string[]; // e.g. ["XS", "S", "M", "L", "XL", "XXL", "3XL"]
  features: string[];
  recommendedUse: string;
  popular?: boolean;
  active: boolean;
  order?: number;
  createdAt?: string | number | any;
  updatedAt?: string | number | any;
}

export interface Category {
  id: string;
  name: string;
  tagline: string;
  description: string;
  iconName: string;
  image: string;
  itemCount: number;
  active: boolean;
  order?: number;
}

export type OrderStatus = "pendiente" | "en_proceso" | "en_confeccion" | "despachado" | "entregado" | "cancelado";

export interface OrderQuote {
  id?: string;
  code: string; // Format: DP-2026-XXXX
  clientName: string;
  companyName: string;
  phone: string;
  email?: string;
  city: string;
  notes?: string;
  productId: string;
  productName: string;
  selectedColor: string;
  customizationId: string;
  customizationName: string;
  quantities: { [size: string]: number };
  totalUnits: number;
  unitPrice: number;
  customizationPrice: number;
  discountPct: number;
  discountAmount: number;
  totalPrice: number;
  status: OrderStatus;
  source: "cotizador_web" | "contacto_web" | "admin_manual";
  createdAt?: string | number | any;
  updatedAt?: string | number | any;
}

export interface StaffMember {
  id: string;
  fullName: string;
  role: string;
  department: "ventas" | "confeccion" | "administracion" | "logistica" | "gerencia";
  email: string;
  phone: string;
  avatarUrl?: string;
  active: boolean;
  createdAt?: string | number | any;
}

export interface ProjectCase {
  id: string;
  title: string;
  subtitle: string;
  client: string;
  description: string;
  heroImage: string;
  gallery?: string[];
  techStack: { name: string }[];
  stats: {
    statusLabel: string;
    totalPieces?: string;
    deliveryTime?: string;
  };
  overview: {
    highlight1: string;
    vision: string;
    deliveryScope?: string;
  };
  active: boolean;
  order?: number;
  createdAt?: string | number | any;
}
