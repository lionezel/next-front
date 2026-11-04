import { LeadStatus } from "./common";

export type FitCategory = 'suplementos' | 'nutricion' | 'accesorios' | 'planes';

export interface FitProduct {
  id: string;
  name: string;
  category: FitCategory;
  categoryLabel: string;
  tagline: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviewsCount: number;
  benefits: string[];
  specs: { [key: string]: string };
  inStock: boolean;
  featured?: boolean;
}

export interface FitCartItem {
  product: FitProduct;
  quantity: number;
}

export interface FitOrder {
  id?: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  city: string;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
  }[];
  subtotal: number;
  shippingFee: number;
  total: number;
  notes?: string;
  status: LeadStatus;
  source: string;
  createdAt?: any;
  updatedAt?: any;
}
