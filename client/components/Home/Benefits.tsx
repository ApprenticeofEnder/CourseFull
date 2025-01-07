import { useHomePage } from '@lib/home/HomePageContext';
import { motion } from 'motion/react';
import { expositionVariants, cardVariants } from '@lib/animations/variants';
import { ReactNode } from 'react';
import {
    ArrowRightIcon,
    ClipboardDocumentCheckIcon,
    ClockIcon,
    ExclamationTriangleIcon,
    FaceFrownIcon,
    FaceSmileIcon,
} from '@heroicons/react/24/outline';

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
            subtitle:
                'Which means better scholarships and more opportunities. And maybe happier parents.',
            visual: <ClipboardDocumentCheckIcon className="icon-lg" />,
        },
        {
            title: 'Fewer Missed Deadlines',
            subtitle: "They suck when they happen, but they don't have to.",
            visual: <ExclamationTriangleIcon className="icon-lg" />,
        },
        {
            title: 'Less Stress',
            subtitle:
                'Managing all your deadlines and knowing where you stand can be a lot. We can help.',
            visual: (
                <div className="flex gap-1 justify-center">
                    <FaceFrownIcon className="icon-lg" />
                    <ArrowRightIcon className="icon-lg" />
                    <FaceSmileIcon className="icon-lg" />
                </div>
            ),
        },
        {
            title: 'More Time',
            subtitle:
                "Because you're not fiddling with a spreadsheet or Notion template all the time.",
            visual: <ClockIcon className="icon-lg" />,
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
            <motion.div className="grid grid-cols-1 sm:grid-cols-2 w-full gap-2">
                {benefits.map(({ title, subtitle, visual }, index) => {
                    return (
                        <motion.div
                            className="card-secondary flex flex-col gap-2 justify-between items-center p-4"
                            key={title}
                            initial="offscreen"
                            whileInView="onscreen"
                            variants={cardVariants}
                            transition={{ delay: 0.1 * (index + 1) }}
                            viewport={{ once: true }}
                        >
                            <motion.h3>{title}</motion.h3>
                            {visual}
                            <motion.h4 className="text-center basis-1/3 flex flex-col justify-center">
                                {subtitle}
                            </motion.h4>
                        </motion.div>
                    );
                })}
            </motion.div>
        </motion.div>
    );
}
