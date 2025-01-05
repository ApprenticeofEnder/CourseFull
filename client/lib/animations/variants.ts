
import { motion, type Variants } from 'motion/react';

export const expositionVariants: Variants = {
    offscreen: {
        opacity: 0,
        filter: 'blur(20px)',
    },
    onscreen: {
        opacity: 1,
        filter: 'blur(0)',
    },
};

export const cardVariants: Variants = {
    offscreen: {
        ...expositionVariants.offscreen,
        x: '-100%',
    },
    onscreen: {
        ...expositionVariants.onscreen,
        x: '0%',
    },
};