"use client";

import Navbar from "@/src/components/ui/Navbar";
import Hero from "@/src/components/ui/Hero";
import { AlliesSection } from "./components/sections/allies-section";
import CategoriesSection from "./components/CategoriesSection";
import Simulador3DSection from "./components/Simulador3DSection";
import InteractiveQuoter from "@/src/features/cotizador/InteractiveQuoter";
import QualityAndPersonalization from "./components/QualityAndPersonalization";
import ProcessSteps from "./components/ProcessSteps";
import WhyChooseDistripako from "./components/WhyChooseDistripako";
import ContactSection from "./components/ContactSection";
import Footer from "@/src/components/ui/Footer";
import { Floating } from "@/src/components/ui/Floating";

export default function HomeFeature() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {/* Main Hero Showcase */}
        <Hero />

        {/* Dynamic Allies & Client Logos */}
        <AlliesSection />

        {/* Uniform Categories & Catalog Preview */}
        <CategoriesSection />

        {/* 3D Uniform Studio & Interactive Customizer */}
        <Simulador3DSection />

        {/* Real-time Interactive Quoter Engine */}
        <InteractiveQuoter />

        {/* Quality, Machinery & Custom Embroidery */}
        <QualityAndPersonalization />

        {/* 4-Step Process: From Inquiry to Nationwide Delivery */}
        <ProcessSteps />

        {/* Why Choose Distripako: Guarantees & Volume Stats */}
        <WhyChooseDistripako />

        {/* Contact & Quote Request Form */}
        <ContactSection />
      </main>
      <Floating />
      <Footer />
    </>
  );
}
