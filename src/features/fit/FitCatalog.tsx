"use client";

import React, { useState } from "react";
import {
  Dumbbell,
  Star,
  ShoppingCart,
  CheckCircle,
} from "lucide-react";
import { FitProduct, FitCartItem } from "@/src/types/fit";
import FitCartModal from "./FitCartModal";

export const INITIAL_FIT_PRODUCTS: FitProduct[] = [
  {
    id: "whey-isolate-gold",
    name: "Whey Isolate Ultra Pure (2.2 lbs)",
    category: "suplementos",
    categoryLabel: "Proteína Aislada",
    tagline: "27g de Proteína Pura por Servicio",
    description: "Proteína de suero de leche 100% aislada e hidrolizada, 0g de azúcar, baja en sodio y de absorción inmediata.",
    price: 189000,
    originalPrice: 220000,
    image: "https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=600&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviewsCount: 142,
    benefits: ["Recuperación muscular rápida", "Sin lactosa ni gluten", "Sabor Chocolate Belga Premium"],
    specs: { "Proteína": "27g", "BCAA": "6.5g", "Servicios": "30" },
    inStock: true,
    featured: true,
  },
  {
    id: "creatina-creapure-300g",
    name: "Creatina Monohidrato Creapure® (300g)",
    category: "suplementos",
    categoryLabel: "Fuerza & Potencia",
    tagline: "100% Micronizada de Grado Farmacéutico",
    description: "La creatina con mayor certificación de pureza internacional para incremento de fuerza explosiva y masa magra.",
    price: 115000,
    originalPrice: 135000,
    image: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=600&auto=format&fit=crop&q=80",
    rating: 5.0,
    reviewsCount: 98,
    benefits: ["Aumento de fuerza y potencia", "Mejora síntesis de ATP", "Sin saborizantes artificiales"],
    specs: { "Pureza": "99.9%", "Porción": "5g", "Servicios": "60" },
    inStock: true,
    featured: true,
  },
  {
    id: "pre-entreno-nitro-pro",
    name: "Pre-Workout Nitro Pro Focus (30 serv)",
    category: "nutricion",
    categoryLabel: "Energía Extrema",
    tagline: "Enfoque Mental Láser & Bombeo Muscular",
    description: "Complejo con Beta-Alanina, L-Citrulina Malato y Cafeína Anhidra para entrenamientos de máxima intensidad.",
    price: 145000,
    originalPrice: 165000,
    image: "https://images.unsplash.com/photo-1546483875-ad9014c88eba?w=600&auto=format&fit=crop&q=80",
    rating: 4.8,
    reviewsCount: 76,
    benefits: ["Vasodilatación y congestión muscular", "Energía sin bajón repentino", "Sabor Frutas Silvestres"],
    specs: { "Citrulina": "6000mg", "Beta Alanina": "3200mg", "Cafeína": "250mg" },
    inStock: true,
  },
  {
    id: "multivitamin-omega3-pack",
    name: "Pack Salud Total: Multivitamínico + Omega 3",
    category: "nutricion",
    categoryLabel: "Salud Integral",
    tagline: "Vitalidad, Inmunidad y Salud Cardiovascular",
    description: "Combinación de 24 micronutrientes esenciales con ácidos grasos EPA/DHA de alta concentración.",
    price: 98000,
    originalPrice: 118000,
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviewsCount: 88,
    benefits: ["Refuerzo inmunológico diario", "Salud articular y cerebral", "Cápsulas de fácil absorción"],
    specs: { "Vitaminas": "24 tipos", "Omega 3": "1200mg", "Porciones": "60 días" },
    inStock: true,
  },
  {
    id: "colageno-hidrolizado-peptidos",
    name: "Colágeno Hidrolizado Péptidos Bioactivos (450g)",
    category: "nutricion",
    categoryLabel: "Articulaciones & Piel",
    tagline: "Regeneración de Tejidos & Elasticidad",
    description: "Péptidos de colágeno con Vitamina C y Ácido Hialurónico para tendones fuertes y luminosidad de la piel.",
    price: 125000,
    originalPrice: 145000,
    image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=600&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviewsCount: 65,
    benefits: ["Salud de rodillas y tendones", "Reducción de fatiga articular", "Disolución instantánea"],
    specs: { "Colágeno": "10g/serv", "Ác. Hialurónico": "100mg", "Vit C": "100mg" },
    inStock: true,
  },
  {
    id: "shaker-termico-acero-inoxidable",
    name: "Shaker Pro Acero Inoxidable (750ml)",
    category: "accesorios",
    categoryLabel: "Accesorios Fit",
    tagline: "Conserva Bebidas Frías por 24 Horas",
    description: "Botella mezcladora térmica con doble pared de acero grado quirúrgico y rejilla antipolvo.",
    price: 65000,
    originalPrice: 75000,
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80",
    rating: 5.0,
    reviewsCount: 52,
    benefits: ["Cero olores residuales", "Tapa a prueba de fugas", "Diseño ergonómico mate"],
    specs: { "Capacidad": "750ml", "Material": "Acero 304", "Térmico": "24h frío" },
    inStock: true,
  },
];

export default function FitCatalog() {
  const [selectedCategory, setSelectedCategory] = useState<string>("todas");
  const [cart, setCart] = useState<FitCartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const categories = [
    { id: "todas", label: "Todos los Productos" },
    { id: "suplementos", label: "Proteínas & Creatinas" },
    { id: "nutricion", label: "Energía & Bienestar" },
    { id: "accesorios", label: "Accesorios & Equipamiento" },
  ];

  const filteredProducts =
    selectedCategory === "todas"
      ? INITIAL_FIT_PRODUCTS
      : INITIAL_FIT_PRODUCTS.filter((p) => p.category === selectedCategory);

  const addToCart = (product: FitProduct) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as FitCartItem[]
    );
  };

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const formatCOP = (val: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <section id="catalogo" className="py-16 bg-white border-t border-slate-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Cart Button */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs font-semibold text-amber-900">
              <Dumbbell className="w-3.5 h-3.5 text-amber-600" />
              <span>Línea Certificada de Nutrición Deportiva</span>
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900">
              Catálogo Oficial de Productos Fit
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
              Fórmulas certificadas con altos estándares de pureza, registro sanitario y efectividad comprobada para tus entrenamientos.
            </p>
          </div>

          <button
            onClick={() => setIsCartOpen(true)}
            className="self-start md:self-auto flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-md shadow-amber-600/20 transition-all hover:scale-105"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Ver Carrito / Cotizador</span>
            {totalCartItems > 0 && (
              <span className="w-5 h-5 rounded-full bg-white text-slate-900 font-black text-xs flex items-center justify-center ml-1">
                {totalCartItems}
              </span>
            )}
          </button>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                selectedCategory === c.id
                  ? "bg-amber-50 text-amber-900 border-amber-300 shadow-xs"
                  : "bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="rounded-3xl bg-white border border-slate-200/90 p-6 flex flex-col justify-between hover:border-amber-300 hover:-translate-y-1 transition-all duration-300 shadow-xs hover:shadow-xl"
            >
              <div>
                {/* Header Tag */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900">
                    {product.categoryLabel}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-amber-600 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span>{product.rating}</span>
                    <span className="text-slate-400 text-[10px]">({product.reviewsCount})</span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-1">{product.name}</h3>
                <p className="text-xs text-amber-800 font-semibold mb-2">{product.tagline}</p>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">{product.description}</p>

                {/* Specs Box */}
                <div className="grid grid-cols-3 gap-2 p-2.5 rounded-2xl bg-slate-50 border border-slate-200 mb-4 text-center">
                  {Object.entries(product.specs).map(([key, value]) => (
                    <div key={key}>
                      <span className="text-[10px] text-slate-500 block truncate">{key}</span>
                      <span className="text-xs font-bold text-slate-900 block">{value}</span>
                    </div>
                  ))}
                </div>

                {/* Key Benefits */}
                <ul className="space-y-1.5 mb-6">
                  {product.benefits.map((b, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                      <CheckCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Price & Add to Cart */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] text-slate-400 line-through block">
                    {product.originalPrice && formatCOP(product.originalPrice)}
                  </span>
                  <span className="text-xl font-black text-amber-700 block">
                    {formatCOP(product.price)}
                  </span>
                </div>

                <button
                  onClick={() => addToCart(product)}
                  className="py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 shadow-md shadow-amber-600/20 flex items-center gap-1.5 transition-all"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>Añadir</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cart Modal */}
      <FitCartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={updateQuantity}
        onClearCart={() => setCart([])}
      />
    </section>
  );
}
