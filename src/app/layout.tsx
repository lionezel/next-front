import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import Navbar from "@/src/components/layout/Navbar";
import Footer from "@/src/components/layout/Footer";
import Floating from "@/src/components/ui/Floating";
import { AuthProvider } from "@/src/context/AuthContext";

const roboto = Roboto({
  weight: ["300", "400", "500", "700", "900"],
  subsets: ["latin"],
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "Next Connection Group | Ecosistema Financiero y Bienestar Integral",
  description:
    "Next Connection Group: Plataforma integral que une soluciones de Crédito ágil, Inversiones de alto rendimiento, Seguros con cobertura total y Productos Fit de bienestar y nutrición certificada.",
  keywords: [
    "Next Connection Group",
    "Next Connection Group",
    "Créditos en línea",
    "Inversiones y rendimientos",
    "Seguros de vida y salud",
    "Productos fit",
    "Suplementos deportivos",
    "Fintech",
    "Bienestar integral",
  ],
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
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
        className={`${roboto.variable} font-sans antialiased min-h-screen bg-[#F8FAFC] text-slate-900 selection:bg-sky-100 selection:text-sky-900 flex flex-col`}
      >
        <AuthProvider>
          <Navbar />
          <div className="flex-1">
            {children}
          </div>
          <Floating />
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}

