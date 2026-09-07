"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calculator,
  Send,
  Copy,
  Check,
  Sparkles,
  Layers,
  Tag,
  Building,
  User,
  Phone,
  MapPin,
  FileText,
  ShieldCheck,
  ArrowRight,
  TrendingDown,
  Info,
  CheckCircle2,
  Loader2,
  Receipt,
} from "lucide-react";
import {
  PRODUCTS,
  CUSTOMIZATION_OPTIONS,
  VOLUME_DISCOUNTS,
  COMPANY_INFO,
} from "@/src/data/uniforms-data";
import { subscribeProducts } from "@/src/services/firebase/products.service";
import { createOrderQuote } from "@/src/services/firebase/quotes.service";
import { Product } from "@/src/types/firebase";

export default function InteractiveQuoter({
  initialProductId,
}: {
  initialProductId?: string;
}) {
  const [productList, setProductList] = useState<Product[]>(PRODUCTS as Product[]);

  useEffect(() => {
    const unsubscribe = subscribeProducts((data) => {
      if (data && data.length > 0) {
        setProductList(data);
      }
    });

    return () => {
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, []);

  // Selected Product State
  const [selectedProductId, setSelectedProductId] = useState<string>(
    initialProductId || (PRODUCTS[0]?.id || "camisa-dril-industrial")
  );
  const selectedProduct = useMemo(
    () => productList.find((p) => p.id === selectedProductId) || productList[0] || PRODUCTS[0],
    [productList, selectedProductId]
  );

  // Selected Color
  const [selectedColor, setSelectedColor] = useState<string>(
    selectedProduct.availableColors[0]?.name || "Color Estándar"
  );

  // When product changes, reset color if needed
  useEffect(() => {
    if (selectedProduct.availableColors?.length > 0) {
      setSelectedColor(selectedProduct.availableColors[0].name);
    }
  }, [selectedProduct]);

  // Selected Customization
  const [selectedCustomizationId, setSelectedCustomizationId] =
    useState<string>("bordado-pecho");
  const selectedCustomization = useMemo(
    () =>
      CUSTOMIZATION_OPTIONS.find((c) => c.id === selectedCustomizationId) ||
      CUSTOMIZATION_OPTIONS[1],
    [selectedCustomizationId]
  );

  // Size Quantities Matrix
  const [quantities, setQuantities] = useState<{ [size: string]: number }>({
    S: 5,
    M: 10,
    L: 10,
    XL: 5,
    XXL: 0,
  });

  // Client Info
  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [notes, setNotes] = useState("");

  const [copied, setCopied] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedCode, setLastSavedCode] = useState<string | null>(null);
  const [activeCategoryFilter, setActiveCategoryFilter] =
    useState<string>("todos");

  // Filtered product choices
  const filteredProducts = useMemo(() => {
    if (activeCategoryFilter === "todos") return productList;
    return productList.filter((p) => p.category === activeCategoryFilter);
  }, [productList, activeCategoryFilter]);

  // Total Units
  const totalUnits = useMemo(() => {
    return Object.values(quantities).reduce((acc, qty) => acc + (qty || 0), 0);
  }, [quantities]);

  // Volume Discount Calculation
  const appliedDiscount = useMemo(() => {
    const discountTier =
      [...VOLUME_DISCOUNTS]
        .reverse()
        .find((tier) => totalUnits >= tier.min) || VOLUME_DISCOUNTS[0];
    return discountTier;
  }, [totalUnits]);

  // Pricing math
  const basePricePerUnit = selectedProduct.basePrice;
  const customizationPricePerUnit = selectedCustomization.pricePerUnit;
  const rawUnitPrice = basePricePerUnit + customizationPricePerUnit;
  const discountAmountPerUnit = rawUnitPrice * (appliedDiscount.discountPct / 100);
  const discountedUnitPrice = rawUnitPrice - discountAmountPerUnit;

  const totalBaseGarments = basePricePerUnit * totalUnits;
  const totalCustomization = customizationPricePerUnit * totalUnits;
  const totalRaw = rawUnitPrice * totalUnits;
  const totalDiscount = totalRaw * (appliedDiscount.discountPct / 100);
  const totalEstimated = totalRaw - totalDiscount;

  // Format currency COP
  const formatCOP = (val: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleQuantityChange = (size: string, value: string) => {
    const num = Math.max(0, parseInt(value, 10) || 0);
    setQuantities((prev) => ({
      ...prev,
      [size]: num,
    }));
  };

  // Build WhatsApp Quotation Message
  const buildWhatsAppMessage = (orderCode?: string) => {
    const sizesSummary = Object.entries(quantities)
      .filter(([_, qty]) => qty > 0)
      .map(([size, qty]) => `${size}: ${qty}`)
      .join(", ");

    let message = `*SOLICITUD DE COTIZACIÓN - DISTRIPAKO*\n`;
    if (orderCode) {
      message += `🔖 *Código de Pedido:* ${orderCode}\n`;
    }
    message += `───────────────────────\n`;
    message += `👔 *Prenda:* ${selectedProduct.name}\n`;
    message += `🎨 *Color:* ${selectedColor}\n`;
    message += `🧵 *Personalización:* ${selectedCustomization.name}\n`;
    message += `📦 *Total Unidades:* ${totalUnits} prendas\n`;
    message += `📐 *Desglose de Tallas:* ${sizesSummary || "Por definir"}\n`;
    if (appliedDiscount.discountPct > 0) {
      message += `🏷️ *Descuento Aplicado:* ${appliedDiscount.discountPct}% (${appliedDiscount.badge})\n`;
    }
    message += `💰 *Presupuesto Estimado:* ${formatCOP(totalEstimated)} + IVA\n`;
    message += `───────────────────────\n`;
    message += `🏢 *Empresa:* ${companyName || "No especificada"}\n`;
    message += `👤 *Contacto:* ${contactName || "Cliente Web"}\n`;
    message += `📞 *Teléfono:* ${phone || "Por WhatsApp"}\n`;
    if (email) {
      message += `✉️ *Correo:* ${email}\n`;
    }
    message += `📍 *Ciudad:* ${city || "Colombia"}\n`;
    if (notes) {
      message += `📝 *Observaciones:* ${notes}\n`;
    }
    message += `───────────────────────\n`;
    message += `_Enviado desde el cotizador web oficial de Distripako._`;

    return encodeURIComponent(message);
  };

  const handleSendWhatsApp = async () => {
    if (totalUnits <= 0) return;

    setIsSaving(true);
    let orderCode = "";

    try {
      const result = await createOrderQuote({
        clientName: contactName || "Cliente Web",
        companyName: companyName || "Empresa no especificada",
        phone: phone || "No suministrado",
        email: email || "",
        city: city || "Colombia",
        notes: notes || "",
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        selectedColor,
        customizationId: selectedCustomization.id,
        customizationName: selectedCustomization.name,
        quantities,
        totalUnits,
        unitPrice: basePricePerUnit,
        customizationPrice: customizationPricePerUnit,
        discountPct: appliedDiscount.discountPct,
        discountAmount: totalDiscount,
        totalPrice: totalEstimated,
        source: "cotizador_web",
      });

      orderCode = result.code;
      setLastSavedCode(result.code);
    } catch (error) {
      console.error("Error guardando cotización en Firestore:", error);
    } finally {
      setIsSaving(false);
      const url = `https://wa.me/${COMPANY_INFO.whatsappNumber}?text=${buildWhatsAppMessage(orderCode)}`;
      window.open(url, "_blank");
    }
  };

  const handleCopySummary = () => {
    const sizesSummary = Object.entries(quantities)
      .filter(([_, qty]) => qty > 0)
      .map(([size, qty]) => `${size}: ${qty}`)
      .join(", ");

    const text = `COTIZACIÓN DISTRIPAKO:\nPrenda: ${selectedProduct.name}\nColor: ${selectedColor}\nPersonalización: ${selectedCustomization.name}\nTallas: ${sizesSummary}\nTotal: ${totalUnits} unidades\nEstimado: ${formatCOP(totalEstimated)}\nEmpresa: ${companyName || "-"}\nContacto: ${contactName || "-"}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };


  return (
    <div id="cotizador" className="py-20 bg-white scroll-mt-20 border-b border-slate-100">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold uppercase tracking-wider">
            <Calculator size={14} className="text-[#1B3A6B]" />
            <span>Cotizador en Línea de Dotaciones</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Calcula el Presupuesto de tu Dotación al Instante
          </h2>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            Configura las prendas que tu equipo necesita, selecciona el tipo de personalización con tu logo y recibe precios con escala de descuento por volumen.
          </p>
        </div>

        {/* Main Quoter Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left / Configurator Column */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: Prenda Selection */}
            <div className="bg-slate-50/60 rounded-3xl p-6 sm:p-7 border border-slate-200 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-white font-bold text-xs">
                    1
                  </span>
                  <h3 className="text-lg font-bold text-slate-900">
                    Selecciona la Prenda a Cotizar
                  </h3>
                </div>

                {/* Quick Category Filter Pills */}
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { id: "todos", label: "Todos" },
                    { id: "industrial", label: "Industrial" },
                    { id: "corporativo", label: "Corporativo" },
                    { id: "salud", label: "Salud" },
                    { id: "gastronomia", label: "Cocina" },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategoryFilter(cat.id)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                        activeCategoryFilter === cat.id
                          ? "bg-slate-900 text-white shadow-sm"
                          : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[360px] overflow-y-auto pr-1">
                {filteredProducts.map((product) => {
                  const isSelected = product.id === selectedProductId;
                  return (
                    <div
                      key={product.id}
                      onClick={() => {
                        setSelectedProductId(product.id);
                        setSelectedColor(product.availableColors[0]?.name || "Estándar");
                      }}
                      className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex gap-3 items-center ${
                        isSelected
                          ? "border-[#1B3A6B] bg-white shadow-md ring-2 ring-[#1B3A6B]/30"
                          : "border-slate-200 hover:border-slate-300 bg-white"
                      }`}
                    >
                      <div className="relative h-16 w-16 rounded-xl overflow-hidden shrink-0 bg-slate-100 border border-slate-200">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover"
                          unoptimized={product.image.startsWith("http")}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#1B3A6B]">
                          {product.categoryLabel}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900 truncate leading-snug">
                          {product.name}
                        </h4>
                        <p className="text-xs font-extrabold text-slate-900 mt-1">
                          {formatCOP(product.basePrice)}{" "}
                          <span className="text-[10px] text-slate-400 font-normal">
                            /ud base
                          </span>
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Selected Product Color Palette */}
              <div className="pt-2 border-t border-slate-200">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Color de la Prenda:{" "}
                  <span className="text-slate-900 normal-case font-extrabold">
                    {selectedColor}
                  </span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {selectedProduct.availableColors.map((col) => (
                    <button
                      key={col.name}
                      onClick={() => setSelectedColor(col.name)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                        selectedColor === col.name
                          ? "border-slate-900 bg-slate-900 text-white shadow-sm"
                          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-black/20"
                        style={{ backgroundColor: col.hex }}
                      />
                      <span>{col.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Step 2: Personalization & Logo */}
            <div className="bg-slate-50/60 rounded-3xl p-6 sm:p-7 border border-slate-200 space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-white font-bold text-xs">
                  2
                </span>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Personalización con Logo o Marca
                  </h3>
                  <p className="text-xs text-slate-500">
                    Bordados computarizados de alta tenacidad o estampado digital
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {CUSTOMIZATION_OPTIONS.map((opt) => {
                  const isSelected = opt.id === selectedCustomizationId;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => setSelectedCustomizationId(opt.id)}
                      className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                        isSelected
                          ? "border-[#1B3A6B] bg-white shadow-md ring-1 ring-[#1B3A6B]"
                          : "border-slate-200 hover:border-slate-300 bg-white"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-xs font-bold text-slate-900">
                              {opt.name}
                            </h4>
                            {opt.badge && (
                              <span className="bg-[#1B3A6B] text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded">
                                {opt.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                            {opt.description}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="text-slate-500 font-medium">Costo por unidad:</span>
                        <span className="font-extrabold text-slate-900">
                          {opt.pricePerUnit === 0
                            ? "Incluido"
                            : `+${formatCOP(opt.pricePerUnit)}`}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Quantities and Size Matrix */}
            <div className="bg-slate-50/60 rounded-3xl p-6 sm:p-7 border border-slate-200 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-white font-bold text-xs">
                    3
                  </span>
                  <h3 className="text-lg font-bold text-slate-900">
                    Distribución de Tallas y Cantidades
                  </h3>
                </div>

                <span className="text-xs font-bold text-slate-900 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
                  Total: {totalUnits} unidades
                </span>
              </div>

              <div className="grid grid-cols-5 sm:grid-cols-5 gap-2.5 sm:gap-3 text-center">
                {["S", "M", "L", "XL", "XXL"].map((size) => (
                  <div
                    key={size}
                    className="p-3 rounded-2xl bg-white border border-slate-200 shadow-xs"
                  >
                    <label className="block text-xs font-extrabold text-slate-700 uppercase mb-1.5">
                      Talla {size}
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={quantities[size] || 0}
                      onChange={(e) => handleQuantityChange(size, e.target.value)}
                      className="w-full text-center font-bold text-base bg-slate-50 border border-slate-300 rounded-lg py-1.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]"
                    />
                  </div>
                ))}
              </div>

              {/* Volume Discount Progress */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 text-slate-800 space-y-2.5 shadow-xs">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <TrendingDown className="text-[#1B3A6B]" size={16} />
                    <span className="font-semibold text-slate-600">
                      Escala de Descuento por Volumen:
                    </span>
                  </div>
                  <span className="font-extrabold text-slate-900 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md text-[11px]">
                    {appliedDiscount.label}
                  </span>
                </div>

                {/* Progress Indicators */}
                <div className="grid grid-cols-4 gap-1.5 pt-1 text-center text-[10px]">
                  {[
                    { label: "12-24", disc: "Base" },
                    { label: "25-49", disc: "5% OFF" },
                    { label: "50-149", disc: "12% OFF" },
                    { label: "150+", disc: "18% - 25%" },
                  ].map((tier, i) => (
                    <div
                      key={i}
                      className={`py-1.5 rounded-lg px-1 font-semibold border ${
                        (i === 0 && totalUnits < 25) ||
                        (i === 1 && totalUnits >= 25 && totalUnits < 50) ||
                        (i === 2 && totalUnits >= 50 && totalUnits < 150) ||
                        (i === 3 && totalUnits >= 150)
                          ? "bg-[#1B3A6B] text-white border-[#1B3A6B]"
                          : "bg-slate-50 text-slate-500 border-slate-200"
                      }`}
                    >
                      {tier.label} ({tier.disc})
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Step 4: Company and Contact Details */}
            <div className="bg-slate-50/60 rounded-3xl p-6 sm:p-7 border border-slate-200 space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-white font-bold text-xs">
                  4
                </span>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Datos de la Empresa / Solicitante
                  </h3>
                  <p className="text-xs text-slate-500">
                    Para generar tu cotización formal con membrete y envío de muestra
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                    <Building size={13} className="text-slate-400" />
                    Nombre de Empresa o Razón Social
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Constructora del Norte S.A.S"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                    <User size={13} className="text-slate-400" />
                    Nombre de Contacto
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Ing. Carlos Mendoza"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                    <Phone size={13} className="text-slate-400" />
                    Teléfono / WhatsApp
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. 310 123 4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                    <MapPin size={13} className="text-slate-400" />
                    Ciudad de Despacho
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Medellín, Bogotá, Cali..."
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <FileText size={13} className="text-slate-400" />
                  Observaciones / Requerimientos Especiales
                </label>
                <textarea
                  rows={2}
                  placeholder="Ej. Requerimos muestra física de tela, cintas reflectivas adicionales o entrega antes del 15 del mes..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]"
                />
              </div>
            </div>
          </div>

          {/* Right / Live Quote Summary Card (Clean White) */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-5">
            <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-slate-200 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#1B3A6B]">
                    Resumen de Cotización
                  </span>
                  <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">
                    Presupuesto Estimado
                  </h3>
                </div>
                <div className="p-2.5 rounded-xl bg-amber-50 text-[#1B3A6B] border border-amber-200">
                  <Calculator size={24} />
                </div>
              </div>

              {/* Order code confirmation badge */}
              {lastSavedCode && (
                <div className="mt-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2.5">
                  <Receipt size={18} className="text-emerald-600 shrink-0" />
                  <div>
                    <p className="font-bold">Cotización registrada en sistema</p>
                    <p className="text-[11px] text-emerald-700">
                      Código de seguimiento: <span className="font-mono font-bold bg-white px-1.5 py-0.5 rounded border border-emerald-300">{lastSavedCode}</span>
                    </p>
                  </div>
                </div>
              )}

              {/* Selected Item Preview */}
              <div className="py-5 border-b border-slate-100 space-y-3">
                <div className="flex gap-3.5 items-center">
                  <div className="relative h-16 w-16 rounded-xl overflow-hidden shrink-0 border border-slate-200 bg-slate-50">
                    <Image
                      src={selectedProduct.image}
                      alt={selectedProduct.name}
                      fill
                      className="object-cover"
                      unoptimized={selectedProduct.image.startsWith("http")}
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[#1B3A6B] uppercase tracking-wider">
                      {selectedProduct.categoryLabel}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 leading-tight">
                      {selectedProduct.name}
                    </h4>
                    <p className="text-xs text-slate-600 mt-1 flex items-center gap-2">
                      <span>Color: <b>{selectedColor}</b></span>
                    </p>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-3 text-xs space-y-1.5 border border-slate-200">
                  <div className="flex justify-between text-slate-600">
                    <span>Personalización:</span>
                    <span className="font-semibold text-slate-900">
                      {selectedCustomization.name}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Tela:</span>
                    <span className="font-semibold text-slate-900">
                      {selectedProduct.fabric}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Total Pedido:</span>
                    <span className="font-bold text-slate-900">
                      {totalUnits} unidades
                    </span>
                  </div>
                </div>
              </div>

              {/* Price Calculations */}
              <div className="py-5 border-b border-slate-100 space-y-3 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal Confección ({totalUnits} uds):</span>
                  <span className="font-semibold">{formatCOP(totalBaseGarments)}</span>
                </div>

                {totalCustomization > 0 && (
                  <div className="flex justify-between text-slate-600">
                    <span>Bordado / Estampado:</span>
                    <span className="font-semibold">+{formatCOP(totalCustomization)}</span>
                  </div>
                )}

                {appliedDiscount.discountPct > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Descuento Volumen ({appliedDiscount.discountPct}%):</span>
                    <span>-{formatCOP(totalDiscount)}</span>
                  </div>
                )}

                <div className="pt-3 border-t border-slate-200 flex items-baseline justify-between">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-slate-500 font-semibold block">
                      Total Estimado (Antes de IVA)
                    </span>
                    <span className="text-xs text-slate-500">
                      Precio Unitario Promedio: <b>{formatCOP(discountedUnitPrice)} /ud</b>
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl sm:text-3xl font-black text-slate-900">
                      {formatCOP(totalEstimated)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Value Guarantees */}
              <div className="py-4 space-y-2 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                  <span>Muestra física disponible para aprobación de gerencia</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                  <span>Costuras reforzadas e hilos de alta tenacidad</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                  <span>Despacho puerta a puerta a cualquier ciudad de Colombia</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <button
                  onClick={handleSendWhatsApp}
                  disabled={totalUnits <= 0 || isSaving}
                  className="w-full flex items-center justify-center gap-2.5 py-4 px-6 rounded-xl bg-[#1B3A6B] hover:bg-[#2557A7] disabled:bg-slate-300 text-white font-extrabold text-base shadow-lg shadow-[#1B3A6B]/20 hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  {isSaving ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>Registrando cotización...</span>
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      <span>Enviar Cotización a WhatsApp</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleCopySummary}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 font-semibold text-xs transition-colors"
                >
                  {copied ? (
                    <>
                      <Check size={16} className="text-emerald-600" />
                      <span className="text-emerald-800">¡Resumen Copiado al Portapapeles!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={16} />
                      <span>Copiar Resumen para Correo o Compras</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Quick Contact Prompt Card */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  ¿Requieres un modelo a medida?
                </h4>
                <p className="text-xs text-slate-500">
                  Hablamos con tu equipo de compras y diseñamos el uniforme ideal.
                </p>
              </div>
              <a
                href={`https://wa.me/${COMPANY_INFO.whatsappNumber}?text=Hola%20Distripako,%20requiero%20asesoria%20para%20un%20diseno%20personalizado`}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors shadow-sm"
              >
                Hablar con Asesor
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
