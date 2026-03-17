"use client";

import Footer from "@/src/components/ui/Footer";
import Navbar from "@/src/components/ui/Navbar";
import HeroSection from "./sections/hero-sections";
import FeatureSection from "./sections/feature-sections";
import { Floating } from "@/src/components/ui/Floating";
import LightCallSection from "./sections/lightCall-sections";

export default function ServicesView() {
    return (
        <div className="bg-white text-zinc-900 min-h-screen selection:bg-primary/30">
            <Navbar />
            <main>
                <HeroSection />
                <FeatureSection />
                <LightCallSection />
            </main>
            <Floating />
            <Footer />
        </div>
    );
}
