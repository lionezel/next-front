import React from "react";
import BankFormManager from "@/src/features/credito/BankFormManager";

export const metadata = {
  title: "Gestor de Bancos y Formularios | NEXT Crédito",
  description: "Administra carpetas de bancos (BBVA, Itaú, AV Villas, Bogotá, Bancolombia), plantillas de formularios y lectura de documentos con IA.",
};

export default function BankFormsPage() {
  return (
    <main className="min-h-screen bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <BankFormManager />
      </div>
    </main>
  );
}
