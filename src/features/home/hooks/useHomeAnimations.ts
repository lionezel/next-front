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
                duration: 0.4,
                ease: "easeOut"
            }
        }
    };

    const cardVariants: Variants = {
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

    return {
        sectionVariants,
        containerVariants,
        cardVariants
    };
};
