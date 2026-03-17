"use client";

import Footer from "@/src/components/ui/Footer";
import Hero from "@/src/components/ui/Hero";
import Navbar from "@/src/components/ui/Navbar";
import Strengths from "@/src/components/ui/Strengths";
import { Variants } from "framer-motion";
import { AlliesSection } from "./sections/allies-section";
import { ServicesSection } from "./sections/services-section";
import { Floating } from "./Floating";

const sectionVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, ease: "easeOut" }
    }
};

const servicesContainerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            duration: 0.4,
            ease: "easeOut"
        }
    }
};

const serviceCardVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { duration: 0.4, ease: "easeOut" }
    },
    hover: {
        y: -10,
        transition: { duration: 0.4, ease: "easeOut" }
    }
};

export default function HomeView() {
    return (
        <>
            <Navbar />
            <main className="min-h-screen">
                <Hero />
                <AlliesSection />
                <Strengths />
                <ServicesSection sectionVariants={sectionVariants} servicesContainerVariants={servicesContainerVariants} serviceCardVariants={serviceCardVariants} />
            </main>
            <Floating />
            <Footer />
        </>
    );
}