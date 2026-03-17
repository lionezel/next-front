import Image from "next/image";
import { partners } from "../../services/partners-data";

export function AlliesSection() {
    return (
        <section className="border-y border-zinc-100 bg-white py-16 overflow-hidden">
            <div className="container mx-auto px-6 text-center lg:px-12 mb-10">
                <h3 className="text-sm font-semibold uppercase tracking-widest text-zinc-400">
                    Empresas que confían en nuestra Ingeniería
                </h3>
            </div>

            <div className="relative flex overflow-hidden w-full group mask-image-linear-edges">
                <div className="flex whitespace-nowrap group-hover:[animation-play-state:paused]">
                    {/* First set of logos */}
                    <div className="flex items-center gap-16 md:gap-24 px-8 md:px-12">
                        {partners.map((partner, index) => (
                            <div
                                key={index}
                                className="flex flex-col items-center justify-center opacity-50 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0 min-w-[150px]"
                            >
                                <Image
                                    src={`/logos/${partner.id}.png`}
                                    alt={`Logo de ${partner.name}`}
                                    width={120}
                                    height={48}
                                    className="h-12 w-auto object-contain cursor-pointer"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}