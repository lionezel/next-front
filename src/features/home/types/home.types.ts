import { Variants } from "framer-motion";
import { ReactNode } from "react";

export interface HomeService {
    name: string;
    icon: ReactNode;
    desc: string;
    classes: string;
    iconClasses: string;
    image: string;
    hoverGradient: string;
    hoverShadow: string;
}

export interface Partner {
    name: string;
    id: string;
}

export interface HomeAnimations {
    sectionVariants: Variants;
    containerVariants: Variants;
    cardVariants: Variants;
}
