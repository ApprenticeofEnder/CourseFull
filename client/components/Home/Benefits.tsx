import { useHomePage } from '@lib/home/HomePageContext';
import { motion } from 'motion/react';
import { expositionVariants, cardVariants } from '@lib/animations/variants';
import { ReactNode } from 'react';

export default function Benefits() {
    const { refs } = useHomePage();

    interface Benefit {
        title: string;
        subtitle: string;
        visual: ReactNode;
    }

    const benefits: Benefit[] = [
        {
            title: 'Better Grades',
            subtitle: 'Which means better scholarships and more opportunities.',
            visual: '',
        },
    ];

    return (
        <motion.div
            className="flex flex-col justify-center items-center gap-4 sm:px-16 sm:py-8"
            ref={refs?.benefitsRef.ref}
        >
            <motion.h2
                initial="offscreen"
                whileInView="onscreen"
                variants={expositionVariants}
            >
                Benefits
            </motion.h2>
            <motion.p
                initial="offscreen"
                whileInView="onscreen"
                variants={expositionVariants}
                className="text-center"
            >
                {"What's in it for you? A lot, actually!"}
            </motion.p>
            <motion.div className="grid grid-cols-2">
                {benefits.map(({ title, subtitle, visual }) => {
                    return (
                        <motion.div key={title}>
                            <motion.h3>{title}</motion.h3>
                        </motion.div>
                    );
                })}
            </motion.div>
        </motion.div>
    );
}
