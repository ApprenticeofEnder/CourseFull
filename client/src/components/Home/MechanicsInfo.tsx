import { useHomePage } from '@/lib/home/HomePageContext';
import { expositionVariants, cardVariants } from '@/lib/animations/variants';
import { motion } from 'motion/react';
import Section from '@/components/Home/Section';

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
            <div className="flex flex-col sm:flex-row justify-between gap-4">
                {cardData.map(({ stepNumber, step }: Step, index: number) => (
                    <motion.div
                        key={stepNumber}
                        initial="offscreen"
                        whileInView="onscreen"
                        variants={cardVariants}
                        transition={{
                            delay: 0.1 * (index + 1),
                        }}
                        className="basis-1/3 card-secondary lg:p-8 flex flex-col justify-between items-center gap-2 lg:gap-4 rounded-lg"
                    >
                        <h1>{stepNumber}</h1>
                        <div className="flex flex-col justify-center basis-1/2">
                            <p className="text-center text-xl">{step}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </Section>
    );
}
