"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Zap, Rocket, Instagram } from "lucide-react";

const navLinks = [
    { href: "/", label: "Inicio", icon: Home },
    { href: "/services", label: "Servicios", icon: Zap },
    { href: "/proyect", label: "Proyectos", icon: Rocket },
];

const SOCIAL_LINKS = [
    { href: "https://www.instagram.com/prioritech.co/", label: "Instagram", icon: Instagram },
];

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        document.body.style.overflow = isMenuOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [isMenuOpen]);

    return (
        <>
            <nav className={`fixed top-0 z-50 w-full transition-all duration-300 ${isScrolled ? "bg-white/80 py-4 shadow-sm backdrop-blur-md" : "bg-transparent py-6"}`}>
                <div className="container mx-auto flex items-center justify-between px-6 lg:px-12">
                    <Link href="/" className="flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
                        <span className="text-2xl font-bold tracking-tighter text-primary">
                            PRIORI<span className="text-secondary"> TECH</span>
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden items-center gap-8 md:flex">
                        {navLinks.map((link) => (
                            <Link key={link.href} href={link.href} className="text-sm font-medium transition-colors hover:text-primary text-zinc-600">
                                {link.label}
                            </Link>
                        ))}
                        
                        <div className="flex items-center gap-6 pl-4 border-l border-zinc-200">
                            {SOCIAL_LINKS.map((social) => (
                                <a key={social.href} href={social.href} target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-primary transition-colors hover:scale-110">
                                    <social.icon size={20} strokeWidth={2} />
                                </a>
                            ))}
                            <a href="https://wa.me/573053617422" target="_blank" rel="noopener noreferrer"
                                className="rounded-full bg-gradient-to-r from-primary to-secondary px-6 py-2.5 text-sm font-semibold text-white transition-all hover:scale-105 hover:shadow-lg active:scale-95">
                                Hablemos
                            </a>
                        </div>
                    </div>

                    {/* Hamburger */}
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Menú"
                        className="relative flex h-10 w-10 items-center justify-center rounded-full md:hidden overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 group-hover:from-primary/20 group-hover:to-secondary/20 transition-all duration-300 rounded-full" />
                        <div className="absolute inset-0 rounded-full border border-primary/20" />
                        <AnimatePresence mode="wait" initial={false}>
                            {isMenuOpen ? (
                                <motion.svg key="close" initial={{ opacity: 0, rotate: -90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 90 }} transition={{ duration: 0.18 }}
                                    xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="relative z-10">
                                    <line x1="18" x2="6" y1="6" y2="18" /><line x1="6" x2="18" y1="6" y2="18" />
                                </motion.svg>
                            ) : (
                                <motion.svg key="open" initial={{ opacity: 0, rotate: 90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: -90 }} transition={{ duration: 0.18 }}
                                    xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="relative z-10">
                                    <line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="18" y2="18" />
                                </motion.svg>
                            )}
                        </AnimatePresence>
                    </button>
                </div>
            </nav>

            {/* ── PREMIUM DARK DRAWER ── */}
            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div key="backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
                            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-md md:hidden" onClick={() => setIsMenuOpen(false)} />

                        {/* Drawer */}
                        <motion.div key="drawer" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
                            transition={{ type: "spring", stiffness: 280, damping: 28 }}
                            className="fixed right-0 top-0 z-50 h-full w-[85vw] max-w-[340px] md:hidden flex flex-col overflow-hidden bg-white shadow-2xl">

                            {/* Glowing orbs inside drawer */}
                            <div className="pointer-events-none absolute -top-20 -left-20 h-60 w-60 rounded-full bg-primary/10 blur-[80px]" />
                            <div className="pointer-events-none absolute bottom-20 -right-10 h-48 w-48 rounded-full bg-secondary/10 blur-[60px]" />

                            {/* Top bar */}
                            <div className="relative flex items-center justify-between px-6 pt-7 pb-6 border-b border-black/5">
                                <div>
                                    <span className="text-xl font-bold tracking-tighter text-primary">
                                        PRIORI<span className="text-secondary"> TECH</span>
                                    </span>
                                    <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 mt-0.5">Fábrica de Software & IA</p>
                                </div>
                                <button onClick={() => setIsMenuOpen(false)}
                                    className="flex h-9 w-9 items-center justify-center rounded-2xl bg-zinc-100 border border-zinc-200 text-zinc-500 hover:bg-zinc-200 hover:text-zinc-700 transition-all">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="18" x2="6" y1="6" y2="18" /><line x1="6" x2="18" y1="6" y2="18" />
                                    </svg>
                                </button>
                            </div>

                            {/* Nav links */}
                            <nav className="relative flex flex-col gap-1 px-4 py-6">
                                <p className="px-3 mb-3 text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-semibold">Navegación</p>
                                {navLinks.map((link, i) => (
                                    <motion.div key={link.href} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 + 0.05 }}>
                                        <Link href={link.href} onClick={() => setIsMenuOpen(false)}
                                            className="group flex items-center gap-4 rounded-2xl px-4 py-4 transition-all duration-200 hover:bg-zinc-50">
                                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-100 border border-zinc-200 group-hover:border-primary/40 group-hover:bg-primary/5 transition-all relative overflow-hidden">
                                                <motion.div
                                                    whileHover={{ scale: 1.15, rotate: [0, -10, 10, -5, 5, 0] }}
                                                    transition={{ duration: 0.4 }}
                                                    className="text-zinc-500 group-hover:text-primary transition-colors flex items-center justify-center"
                                                >
                                                    <link.icon size={20} strokeWidth={2.2} />
                                                </motion.div>
                                            </span>
                                            <span className="text-base font-semibold text-zinc-700 group-hover:text-primary transition-colors">{link.label}</span>
                                            <svg className="ml-auto text-zinc-400 group-hover:text-primary transition-colors opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
                                        </Link>
                                    </motion.div>
                                ))}
                            </nav>

                            {/* Social Area */}
                            <div className="px-4 py-4 mt-auto">
                                <p className="px-3 mb-4 text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-semibold">Nuestras Redes</p>
                                <div className="flex gap-4 px-3">
                                    {SOCIAL_LINKS.map((social, i) => (
                                        <motion.a key={social.href} href={social.href} target="_blank" rel="noopener noreferrer"
                                            initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 + i * 0.1 }}
                                            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-50 border border-zinc-200 text-zinc-500 hover:border-primary/40 hover:bg-primary/5 hover:text-primary transition-all">
                                            <social.icon size={22} strokeWidth={2} />
                                        </motion.a>
                                    ))}
                                </div>
                            </div>

                            {/* Status widget */}
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                                className="relative mx-4 mb-4 rounded-2xl bg-zinc-50 border border-zinc-200 p-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                                    </span>
                                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Disponibles ahora</span>
                                </div>
                                <p className="text-xs text-zinc-500 leading-relaxed">
                                    Respondemos en menos de <span className="text-zinc-800 font-semibold">24 horas</span>. Tu próximo proyecto empieza hoy.
                                </p>
                            </motion.div>

                            {/* CTA */}
                            <div className="relative px-4 pb-8">
                                <motion.a href="https://wa.me/573053617422" target="_blank" rel="noopener noreferrer"
                                    onClick={() => setIsMenuOpen(false)}
                                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.38 }}
                                    className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-primary to-secondary px-6 py-4 text-base font-bold text-white shadow-[0_0_40px_-10px_rgba(105,67,203,0.3)] transition-all hover:shadow-[0_0_50px_-5px_rgba(105,67,203,0.5)] hover:scale-[1.02] active:scale-[0.98]">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                    </svg>
                                    Hablemos por WhatsApp
                                </motion.a>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
