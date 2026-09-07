import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  weight: ["300", "400", "500", "700", "900"],
  subsets: ["latin"],
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "Distripako | Dotación de Uniformes Industriales y Corporativos",
  description:
    "Especialistas en dotación de uniformes industriales, ejecutivos, médicos, gastronómicos y calzado de seguridad. Personalización con bordado computarizado de alta calidad. Cotiza en línea.",
  keywords: [
    "Distripako",
    "dotación de uniformes",
    "uniformes industriales",
    "ropa de trabajo",
    "bordado computarizado",
    "camisas oxford",
    "overoles industriales",
    "uniformes medicos antifluido",
    "cotizador de uniformes",
  ],
  icons: {
    icon: "/distripako-icon.png",
    shortcut: "/distripako-icon.png",
    apple: "/distripako-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body
        className={`${roboto.variable} font-sans antialiased selection:bg-amber-200/50 selection:text-slate-900 min-h-screen bg-white text-slate-900`}
      >
        {children}
      </body>
    </html>
  );
}
