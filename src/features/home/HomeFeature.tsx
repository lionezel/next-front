"use client";

import React from "react";
import Navbar from "@/src/components/ui/Navbar";
import Footer from "@/src/components/ui/Footer";
import Hero from "@/src/components/ui/Hero";
import Strengths from "@/src/components/ui/Strengths";
import { Floating } from "@/src/components/ui/Floating";

import { AlliesSection } from "./components/sections/allies-section";
import { ServicesBento } from "./components/ServicesBento";

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

                {/* Allies/Partners Marquee */}
                <AlliesSection />

                {/* Value Propositions / Strengths */}
                <Strengths />

                {/* Services Bento Grid (Dumb Component) */}
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
