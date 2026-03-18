import { Variants } from "framer-motion";


export const useHomeAnimations = () => {
    const sectionVariants: Variants = {
        hidden: { opacity: 0, y: 30 },
        show: { 
            opacity: 1, 
            y: 0, 
            transition: { duration: 0.8, ease: "easeOut" } 
        }
    };

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.1,
            }
        }
    };

    const cardVariants: Variants = {
        hidden: { opacity: 0, scale: 0.95, y: 20 },
        show: { 
            opacity: 1, 
            scale: 1,
            y: 0,
            transition: { duration: 0.5, ease: "easeOut" } 
        },
        hover: {
            y: -8,
            transition: { duration: 0.3, ease: "easeInOut" }
        }
    };

    const architectureContainer: Variants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.3,
            }
        }
    };

    const architectureItem: Variants = {
        hidden: { opacity: 0, x: -20 },
        show: { 
            opacity: 1, 
            x: 0,
            transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } 
        }
    };

    return {
        sectionVariants,
        containerVariants,
        cardVariants,
        architectureContainer,
        architectureItem
    };
};
