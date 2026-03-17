"use client";

import Footer from "@/src/components/ui/Footer";
import Navbar from "@/src/components/ui/Navbar";
import { Variants } from "framer-motion";
import { projectsData } from "../services/proyect-data";
import HeroSection from "./sections/hero-sections";
import BentoOverviewSection from "./sections/bentoOverview-sections";
import TechEcosystemSection from "./sections/techEcosystem-sections";
import DesignSection from "./sections/design-sections";
import { Floating } from "@/src/components/ui/Floating";
import DarkCallSection from "./sections/DarkCall-sections";

export default function ProyectView({ projectId }: { projectId?: string }) {
    const project = projectsData.find(p => p.id === projectId) || projectsData[0];

    const fadeInVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        show: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" }
        }
    };

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-white selection:bg-primary selection:text-white">
                <HeroSection containerVariants={containerVariants} fadeInVariants={fadeInVariants} project={project} />
                <BentoOverviewSection containerVariants={containerVariants} fadeInVariants={fadeInVariants} project={project} />
                <TechEcosystemSection project={project} />
                <DesignSection project={project} />
                <DarkCallSection project={project} />
            </main>
            <Floating />
            <Footer />
        </>
    );
}
