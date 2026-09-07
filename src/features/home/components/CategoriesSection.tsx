"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  HardHat,
  Briefcase,
  Stethoscope,
  UtensilsCrossed,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Tag,
} from "lucide-react";
import {
  subscribeCategories,
  subscribeProducts,
} from "@/src/services/firebase/products.service";
import { Category, Product } from "@/src/types/firebase";

export default function CategoriesSection() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("industrial");

  useEffect(() => {
    const unsubCats = subscribeCategories((data) => {
      setCategories(data);
      if (data.length > 0 && !data.some((c) => c.id === selectedCategory)) {
        setSelectedCategory(data[0].id);
      }
    });

    const unsubProds = subscribeProducts((data) => {
      setProducts(data);
    });

    return () => {
      if (typeof unsubCats === "function") unsubCats();
      if (typeof unsubProds === "function") unsubProds();
    };
  }, []);

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case "HardHat":
        return <HardHat className="text-[#1B3A6B]" size={22} />;
      case "Briefcase":
        return <Briefcase className="text-[#1B3A6B]" size={22} />;
      case "Stethoscope":
        return <Stethoscope className="text-[#1B3A6B]" size={22} />;
      case "UtensilsCrossed":
        return <UtensilsCrossed className="text-[#1B3A6B]" size={22} />;
      case "Sparkles":
        return <Sparkles className="text-[#1B3A6B]" size={22} />;
      default:
        return <HardHat className="text-[#1B3A6B]" size={22} />;
    }
  };

  const currentProducts = products.filter(
    (p) => p.category === selectedCategory
  );


  return (
    <section id="catalogo" className="py-24 bg-white scroll-mt-20 border-b border-slate-100">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold uppercase tracking-wider">
            <Tag size={13} className="text-[#1B3A6B]" />
            <span>Portafolio Completo de Dotaciones</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Líneas de Uniformes Especializadas por Sector
          </h2>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            Prendas diseñadas con los estándares ergonómicos y normativos que cada industria exige. Durabilidad comprobada y confección impecable.
          </p>
        </div>

        {/* Category Navigation Pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-3 px-5 py-3 rounded-2xl font-bold text-sm transition-all ${
                  isActive
                    ? "bg-slate-900 text-white shadow-md scale-105"
                    : "bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100"
                }`}
              >
                {getCategoryIcon(cat.iconName)}
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Category Highlight Card (Clean White) */}
        {(() => {
          const currentCatInfo =
            categories.find((c) => c.id === selectedCategory) || categories[0];
          if (!currentCatInfo) return null;
          return (
            <div className="rounded-3xl bg-slate-50/80 text-slate-900 border-2 border-slate-200 p-6 sm:p-10 mb-12 shadow-sm relative overflow-hidden">
              <div className="relative z-10 max-w-2xl space-y-4">
                <span className="text-xs uppercase font-extrabold tracking-widest text-[#1B3A6B]">
                  {currentCatInfo.tagline}
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  {currentCatInfo.name}
                </h3>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  {currentCatInfo.description}
                </p>
                <div className="pt-2 flex flex-wrap gap-4">
                  <a
                    href="#cotizador"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1B3A6B] hover:bg-[#2557A7] text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-md"
                  >
                    <span>Cotizar esta línea</span>
                    <ArrowRight size={14} />
                  </a>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentProducts.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 flex flex-col group"
            >
              {/* Product Image Frame */}
              <div className="relative aspect-[4/3] w-full bg-slate-100 overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  unoptimized={product.image.startsWith("http")}
                />
                {product.popular && (
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#1B3A6B] text-white font-extrabold text-[11px] uppercase tracking-wider shadow-md">
                    Alta Demanda
                  </span>
                )}
                <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-white/90 backdrop-blur-md text-slate-900 border border-slate-200 text-[11px] font-semibold">
                  Tela: {product.fabric}
                </span>
              </div>

              {/* Product Details */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-[#1B3A6B] uppercase tracking-widest block">
                    {product.categoryLabel}
                  </span>
                  <h4 className="text-lg font-extrabold text-slate-900 leading-snug">
                    {product.name}
                  </h4>
                  <p className="text-slate-600 text-xs leading-relaxed line-clamp-2">
                    {product.shortDesc}
                  </p>
                </div>

                {/* Key specs */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  {product.features.slice(0, 2).map((feat, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 text-[11px] text-slate-500"
                    >
                      <CheckCircle size={12} className="text-[#1B3A6B] shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                {/* Card Footer Price & Action */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Precio Referencial
                    </span>
                    <span className="text-base font-extrabold text-slate-900">
                      ${product.basePrice.toLocaleString("es-CO")}{" "}
                      <span className="text-[10px] font-normal text-slate-400">
                        COP
                      </span>
                    </span>
                  </div>

                  <a
                    href="#cotizador"
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors shadow-sm"
                  >
                    <span>Cotizar</span>
                    <ArrowRight size={14} />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
