"use client";

import { useState } from "react";
import { servicesData } from "../services/services-data";
import Navbar from "@/src/components/ui/Navbar";

export default function ServicesView() {
    const [activeServiceId, setActiveServiceId] = useState("web");

    const activeService = servicesData.find(s => s.id === activeServiceId) || servicesData[0];

    return (
        <div className="min-h-screen bg-[#FDFDFD] font-sans pb-20 mt-20">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col lg:flex-row gap-12">
                {/* Sidebar */}
                <aside className="w-full lg:w-[35%] flex flex-col gap-4">
                    {servicesData.map((service) => {
                        const isActive = activeServiceId === service.id;
                        return (
                            <div
                                key={service.id}
                                onClick={() => setActiveServiceId(service.id)}
                                className={`cursor-pointer p-6 rounded-[1.5rem] transition-all duration-300 border-2 ${isActive
                                    ? "border-[#F9A826] bg-[#F8F9FA] shadow-sm transform scale-[1.02]"
                                    : "border-transparent bg-[#F8F9FA] hover:bg-slate-100/70"
                                    }`}
                            >
                                <h3 className={`font-bold text-lg mb-2 ${isActive ? "text-slate-900" : "text-slate-600"}`}>
                                    {service.title}
                                </h3>
                                <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
                                    {service.sidebarDesc}
                                </p>

                                {isActive && (
                                    <button className="mt-4 bg-[#6943CB] hover:bg-[#5837A9] transition-colors text-white px-5 py-2.5 rounded-full font-semibold text-sm flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                        </svg>
                                        QUIERO ESTO
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </aside>

                {/* Main Content */}
                <section className="w-full lg:w-[65%] flex flex-col items-center">
                    <div className="text-center max-w-3xl mb-12">
                        <h1 className="text-3xl font-bold text-slate-900 mb-4">{activeService.title}</h1>
                        <p className="text-slate-600 leading-relaxed text-[15px]">
                            {activeService.mainDesc}
                        </p>
                    </div>

                    {/* Illustration Placeholder */}
                    <div className="relative w-80 h-80 rounded-full bg-gradient-to-br from-[#F59E0B] to-[#EA580C] mb-16 flex items-center justify-center shadow-lg shadow-orange-100">
                        {/* Monitor Graphic */}
                        <div className="relative w-48 h-36 bg-slate-800 rounded-lg p-1.5 flex flex-col shadow-2xl transform -rotate-12 hover:rotate-0 transition-transform duration-500 ease-out z-10">
                            <div className="flex-1 bg-white flex flex-col rounded-sm overflow-hidden">
                                <div className="w-full h-8 bg-pink-500 flex items-center px-3">
                                    <div className="w-16 h-3 bg-white/30 rounded-full"></div>
                                </div>
                                <div className="flex-1 bg-slate-50 p-3 flex gap-3">
                                    <div className="w-1/3 bg-slate-200 rounded-sm"></div>
                                    <div className="w-2/3 bg-slate-200 rounded-sm"></div>
                                </div>
                            </div>
                            <div className="h-4 bg-slate-800"></div>
                            {/* Stand */}
                            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-8 h-6 bg-slate-700"></div>
                            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-24 h-2 bg-slate-400 rounded-full shadow-md"></div>
                        </div>
                        {/* Mouse */}
                        <div className="absolute bottom-10 right-10 w-8 h-12 bg-white rounded-full border border-slate-200 shadow-md transform rotate-12 z-20">
                            <div className="w-full h-1/2 border-b border-slate-100"></div>
                        </div>
                    </div>

                    {/* Features Grid */}
                    {activeService.features && activeService.features.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                            {activeService.features.map((feature, idx) => (
                                <div key={idx} className="bg-[#FFF6F0] p-8 rounded-2xl relative shadow-sm hover:shadow-md transition-shadow">
                                    <span className="text-[#F9A826] font-bold text-lg mb-3 block">
                                        {feature.num}
                                    </span>
                                    <h4 className="font-bold text-slate-800 mb-2">{feature.title}</h4>
                                    <p className="text-sm text-slate-600 leading-relaxed">
                                        {feature.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-slate-50 border border-slate-100 p-8 rounded-2xl w-full text-center">
                            <p className="text-slate-500">Más detalles de {activeService.title} próximamente.</p>
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}