"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            className={`fixed top-0 z-50 w-full transition-all duration-300 ${isScrolled
                ? "bg-white/80 py-4 shadow-sm backdrop-blur-md"
                : "bg-transparent py-6"
                }`}
        >
            <div className="container mx-auto flex items-center justify-between px-6 lg:px-12">
                <Link href="/" className="flex items-center gap-2">
                    <span className="text-2xl font-bold tracking-tighter text-primary">
                        PRIORI<span className="text-secondary"> TECH</span>
                    </span>
                </Link>

                <div className="hidden items-center gap-8 md:flex">
                    <Link
                        href="/"
                        className="text-sm font-medium transition-colors hover:text-primary"
                    >
                        Inicio
                    </Link>
                    <Link
                        href="/services"
                        className="text-sm font-medium transition-colors hover:text-primary"
                    >
                        Servicios
                    </Link>
                    <Link
                        href="/proyectos"
                        className="text-sm font-medium transition-colors hover:text-primary"
                    >
                        Proyectos
                    </Link>
                    <button className="rounded-full bg-gradient-to-r from-primary to-secondary px-6 py-2.5 text-sm font-semibold text-white transition-all hover:scale-105 hover:shadow-lg active:scale-95">
                        Hablemos
                    </button>
                </div>

                <button className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 md:hidden">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" /></svg>
                </button>
            </div>
        </nav>
    );
}
