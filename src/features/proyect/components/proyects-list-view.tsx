"use client";

import { useEffect, useState } from "react";
import Footer from "@/src/components/ui/Footer";
import Navbar from "@/src/components/ui/Navbar";
import { motion, Variants } from "framer-motion";
import { subscribeProjects } from "@/src/services/firebase/projects.service";
import { Project } from "../types/project.type";
import { projectsData as fallbackProjects } from "../services/proyect-data";
import { Floating } from "@/src/components/ui/Floating";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Award, CheckCircle2 } from "lucide-react";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      ease: "easeOut",
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  hover: { y: -6, transition: { duration: 0.3, ease: "easeOut" } },
};

export default function ProyectsListView() {
  const [projects, setProjects] = useState<Project[]>(fallbackProjects);

  useEffect(() => {
    const unsub = subscribeProjects((data) => {
      if (data && data.length > 0) {
        setProjects(data);
      }
    });

    return () => {
      if (typeof unsub === "function") unsub();
    };
  }, []);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50 pt-32 pb-20">
        <div className="container mx-auto px-6 lg:px-12">
          {/* Header Section */}
          <div className="mb-16 md:mb-20 flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 mb-6 shadow-sm"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1B3A6B] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1B3A6B]" />
              </span>
              <span className="text-xs font-bold tracking-wider text-[#0F1D36] uppercase">
                Dotaciones Entregadas
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#0F1D36] mb-6 max-w-3xl"
            >
              Casos de Éxito &{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0F1D36] via-[#1E3A5F] to-[#1B3A6B]">
                Proyectos Realizados
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base md:text-lg text-slate-600 max-w-2xl leading-relaxed"
            >
              Conoce cómo hemos equipado a empresas líderes en minería, clínicas, restaurantes y oficinas corporativas en toda Colombia.
            </motion.p>
          </div>

          {/* Grid de Proyectos */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {projects.map((project) => (
              <motion.div
                key={project.id}
                variants={cardVariants}
                whileHover="hover"
                className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-md hover:shadow-xl transition-all flex flex-col group"
              >
                {/* Hero Image */}
                <div className="relative h-60 sm:h-72 w-full overflow-hidden bg-slate-100">
                  <Image
                    src={project.heroImage}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    unoptimized={project.heroImage.startsWith("http")}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between text-white">
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#1B3A6B] text-[#0F1D36] uppercase tracking-wider">
                      {project.stats.statusLabel}
                    </span>
                    <span className="text-xs font-semibold text-slate-300">
                      {project.overview.highlight1}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-8 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-[#1B3A6B] uppercase tracking-wider block">
                      {project.subtitle}
                    </span>
                    <h3 className="text-2xl font-extrabold text-[#0F1D36] group-hover:text-[#1E3A5F] transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
                      {project.description}
                    </p>
                  </div>

                  {/* Tech stack / specifications */}
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
                    {project.techStack.map((tech, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 text-xs font-semibold text-slate-700 bg-slate-100 rounded-full border border-slate-200"
                      >
                        {tech.name}
                      </span>
                    ))}
                  </div>

                  {/* CTA */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-[#0F1D36] flex items-center gap-1.5">
                      <CheckCircle2 size={15} className="text-emerald-500" />
                      {project.overview.vision.substring(0, 45)}...
                    </span>

                    <a
                      href="/#cotizador"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0F1D36] hover:text-[#1B3A6B] transition-colors"
                    >
                      <span>Cotizar dotación similar</span>
                      <ArrowRight size={14} />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </main>
      <Floating />
      <Footer />
    </>
  );
}
