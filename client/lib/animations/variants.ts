
import { motion, type Variants } from 'motion/react';

export const basicVariants: Variants = {
    offscreen: {
        opacity: 0,
        filter: 'blur(5px)',
    },
    onscreen: {
        opacity: 1,
        filter: 'blur(0)',
    },
};

export const headerVariants: Variants = {
    offscreen: {
        ...basicVariants.offscreen,
        x: '-100%',
    },
    onscreen: {
        ...basicVariants.onscreen,
        x: '0%',
    },
};

export const heroVariants: Variants = {
    offscreen: {
        ...basicVariants.offscreen,
        y: '100%',
    },
    onscreen: {
        ...basicVariants.onscreen,
        y: '0%',
    },
};

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