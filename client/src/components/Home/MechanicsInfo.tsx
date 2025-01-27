import { motion } from 'motion/react';

import Section from '@/components/Home/Section';
import { cardVariants, expositionVariants } from '@/lib/animations/variants';
import { useHomePage } from '@/lib/home/HomePageContext';

interface Step {
    stepNumber: number;
    step: string;
}

export default function MechanicsInfo() {
    const steps = [
        'Add your courses! (You get 3 for free.)',
        'Add your deliverables!',
        'Update your grades as you get them!',
    ];
    const { refs } = useHomePage();

    const cardData = steps.map((step, index) => ({
        stepNumber: index + 1,
        step,
    }));

    return (
        <Section ref={refs?.mechanicsRef.ref} title="How It Works">
            <motion.p
                initial="offscreen"
                whileInView="onscreen"
                variants={expositionVariants}
                className="text-center"
            >
                {"It's easier than you think."}
            </motion.p>
            <div className="flex flex-col justify-between gap-4 sm:flex-row">
                {cardData.map(({ stepNumber, step }: Step, index: number) => (
                    <motion.div
                        key={stepNumber}
                        initial="offscreen"
                        whileInView="onscreen"
                        variants={cardVariants}
                        transition={{
                            delay: 0.1 * (index + 1),
                        }}
                        className="card-secondary flex basis-1/3 flex-col items-center justify-between gap-2 rounded-lg lg:gap-4 lg:p-8"
                    >
                        <h1>{stepNumber}</h1>
                        <div className="flex basis-1/2 flex-col justify-center">
                            <p className="text-center text-xl">{step}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </Section>
    );
}
