"use client";

import React, { useState } from "react";
import {
  X,
  Plus,
  Minus,
  ShoppingCart,
  PackageCheck,
} from "lucide-react";
import { FitCartItem } from "@/src/types/fit";
import { submitFitOrder } from "@/src/services/firebase/fitService";
import SuccessModal from "@/src/components/common/SuccessModal";

interface FitCartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: FitCartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onClearCart: () => void;
}

export default function FitCartModal({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onClearCart,
}: FitCartModalProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderCode, setOrderCode] = useState("");

  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "Bogotá",
    notes: "",
  });

  if (!isOpen) return null;

  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const shippingFee = subtotal > 150000 || subtotal === 0 ? 0 : 15000;
  const total = subtotal + shippingFee;

  const formatCOP = (val: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert("Tu carrito está vacío. Agrega algún producto para continuar.");
      return;
    }

    setLoading(true);

    try {
      const code = "FIT-" + Math.floor(100000 + Math.random() * 900000);
      await submitFitOrder({
        orderNumber: code,
        customerName: customer.name,
        customerEmail: customer.email,
        customerPhone: customer.phone,
        shippingAddress: customer.address,
        city: customer.city,
        items: cart.map((i) => ({
          productId: i.product.id,
          productName: i.product.name,
          quantity: i.quantity,
          unitPrice: i.product.price,
          subtotal: i.product.price * i.quantity,
        })),
        subtotal,
        shippingFee,
        total,
        notes: customer.notes,
        status: "pendiente",
        source: "portal_fit_cart",
      });

      setOrderCode(code);
      setSuccess(true);
      onClearCart();
    } catch (err) {
      console.error(err);
      alert("Error al procesar el pedido. Por favor intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
        <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[92vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-amber-600" />
              <h3 className="text-lg font-bold text-slate-900">Carrito & Cotización Fit</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {cart.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <ShoppingCart className="w-6 h-6" />
              </div>
              <p className="text-sm text-slate-800 font-semibold">Tu carrito está vacío</p>
              <p className="text-xs text-slate-500">
                Explora el catálogo de suplementos y selecciona los productos que desees.
              </p>
            </div>
          ) : (
            <div className="space-y-6 pt-4">
              {/* Items List */}
              <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div
                    key={item.product.id}
                    className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-900 truncate">{item.product.name}</p>
                      <p className="text-amber-700 font-semibold">
                        {formatCOP(item.product.price)} c/u
                      </p>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl p-1">
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, -1)}
                        className="p-1 text-slate-500 hover:text-slate-900 rounded"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-bold text-slate-900 px-1">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, 1)}
                        className="p-1 text-slate-500 hover:text-slate-900 rounded"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="font-bold text-slate-900 w-24 text-right">
                      {formatCOP(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals Summary */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-slate-900">{formatCOP(subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Envío Nacional:</span>
                  <span className="font-semibold text-emerald-700">
                    {shippingFee === 0 ? "¡GRATIS!" : formatCOP(shippingFee)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-200">
                  <span>Total Estimado:</span>
                  <span className="text-amber-700 text-base">{formatCOP(total)}</span>
                </div>
              </div>

              {/* Checkout Customer Form */}
              <form onSubmit={handleCheckout} className="space-y-3 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Datos de Envío y Contacto
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <input
                      type="text"
                      required
                      placeholder="Nombre Completo *"
                      value={customer.name}
                      onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-amber-600"
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      required
                      placeholder="Teléfono / WhatsApp *"
                      value={customer.phone}
                      onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-amber-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <input
                      type="email"
                      required
                      placeholder="Correo Electrónico *"
                      value={customer.email}
                      onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-amber-600"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      required
                      placeholder="Ciudad / Municipio *"
                      value={customer.city}
                      onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-amber-600"
                    />
                  </div>
                </div>

                <div>
                  <input
                    type="text"
                    required
                    placeholder="Dirección Completa de Envío (Calle, Cra, Apto, Barrio) *"
                    value={customer.address}
                    onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-amber-600"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 shadow-md shadow-amber-600/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 mt-4"
                >
                  {loading ? (
                    <span>Procesando pedido...</span>
                  ) : (
                    <>
                      <PackageCheck className="w-4 h-4" />
                      <span>Confirmar Pedido / Cotización Fit</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      <SuccessModal
        isOpen={success}
        onClose={() => {
          setSuccess(false);
          onClose();
        }}
        title="¡Pedido Fit Registrado!"
        message="Hemos recibido tu orden y ha sido ingresada a nuestro centro de despacho. Te contactaremos vía WhatsApp para coordinar el método de pago y el número de guía de envío."
        referenceCode={orderCode}
      />
    </>
  );
}
