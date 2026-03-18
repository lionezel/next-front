"use client";

import Navbar from "@/src/components/ui/Navbar";
import Footer from "@/src/components/ui/Footer";
import Hero from "@/src/components/ui/Hero";
import { Floating } from "@/src/components/ui/Floating";

import { AlliesSection } from "./components/sections/allies-section";
import { ServicesBento } from "./components/ServicesBento";
import { ArchitectureSection } from "./components/ArchitectureSection";

import { useHomeAnimations } from "./hooks/useHomeAnimations";
import { services } from "./services/skills-data";

export default function HomeFeature() {
    const animations = useHomeAnimations();

    return (
        <>
            <Navbar />
            <main className="min-h-screen">
                {/* Hero Section */}
                <Hero />

                <ArchitectureSection animations={animations} />

                {/* Services Bento Grid (Core Experience) */}
                <ServicesBento
                    services={services}
                    animations={animations}
                />
            </main>
            <Floating />
            <Footer />
        </>
    );
}
