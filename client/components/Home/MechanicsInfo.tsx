import { HomePageProps } from '@coursefull/props';
import { motion, type Variants } from 'motion/react';
import { RefObject } from 'react';

interface Step {
    stepNumber: number;
    step: string;
}

export default function MechanicsInfo({mechanicsRef}: Partial<HomePageProps>) {
    const steps = [
        'Add your courses! (You get 3 for free.)',
        'Add your deliverables!',
        'Update your grades as you get them!',
    ];

    const cardData = steps.map((step, index) => ({
        stepNumber: index + 1,
        step,
    }));

    const expositionVariants: Variants = {
        offscreen: {
            opacity: 0,
            filter: 'blur(20px)',
        },
        onscreen: {
            opacity: 1,
            filter: 'blur(0)',
        },
    };

    const cardVariants: Variants = {
        offscreen: {
            ...expositionVariants.offscreen,
            x: '-100%',
        },
        onscreen: {
            ...expositionVariants.onscreen,
            x: '0%',
        },
    };

    return (
        <motion.div className="flex flex-col justify-center items-center gap-4 sm:px-16" ref={mechanicsRef}>
            <motion.h2
                initial="offscreen"
                whileInView="onscreen"
                variants={expositionVariants}
            >
                Take charge of your academic goals!
            </motion.h2>
            <motion.p
                initial="offscreen"
                whileInView="onscreen"
                variants={expositionVariants}
                className="text-center"
            >
                <b>Got a target to hit?</b> We do the math behind the scenes so
                you always know what you need to get on your assignments, exams,
                and other deliverables.
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
                        className="basis-1/3 card-secondary lg:p-8 flex flex-col justify-between gap-2 lg:gap-4 rounded-lg"
                    >
                        <h1>{stepNumber}</h1>
                        <p className="text-center text-xl">{step}</p>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}
