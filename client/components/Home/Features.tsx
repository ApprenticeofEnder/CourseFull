import { motion, type Variants } from 'motion/react';
import { ReactNode, useState } from 'react';
import {
    ArrowTrendingUpIcon,
    CalendarIcon,
    EyeIcon,
    InformationCircleIcon,
} from '@heroicons/react/24/outline';
import Button from '@components/Button/Button';
import { Popover, PopoverContent, PopoverTrigger } from '@nextui-org/react';
import { useHomePage } from '@lib/home/HomePageContext';

interface FeatureData {
    title: string;
    subheading: string;
    description: string;
    visual: ReactNode;
}

export default function Features() {
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

    const features: FeatureData[] = [
        {
            title: 'Automatic Goal Tracking',
            subheading: 'Let us do the math for you!',
            description:
                'Got a target you need to hit? We do the math behind the scenes so you always know what you need to get on your assignments, exams, and other deliverables to get the report card of your dreams!',
            visual: <ArrowTrendingUpIcon className="icon-lg" />,
        },
        {
            title: 'Instant Visual Feedback',
            subheading: "See how you're doing at a glance!",
            description:
                "Colour-coded items let you know where you have breathing room, where you need to put a little more work, and where you're starting to fall behind!",
            visual: <EyeIcon className="icon-lg" />,
        },
        {
            title: 'Always-On Deadline Tracking',
            subheading: "Know what's coming up so you can prioritize better!",
            description:
                'Know what deadlines you have coming soon, and how much time you have left! If any deliverables are overdue, you will see them first.',
            visual: <CalendarIcon className="icon-lg" />,
        },
    ];

    const { refs } = useHomePage();

    return (
        <div
            className="flex flex-col gap-4 sm:px-16 sm:py-8"
            ref={refs?.featuresRef.ref}
        >
            <motion.h2
                initial="offscreen"
                whileInView="onscreen"
                variants={expositionVariants}
            >
                Features
            </motion.h2>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
                {features.map(
                    ({ title, subheading, visual, description }, index) => {
                        return (
                            <motion.div
                                className="card-primary pb-4 flex flex-col gap-4 justify-between items-center basis-1/3"
                                key={`feature-${index}`}
                                variants={cardVariants}
                                initial="offscreen"
                                transition={{
                                    delay: 0.1 * (index + 1),
                                }}
                                whileInView="onscreen"
                            >
                                <h3>{title}</h3>
                                <div>{visual}</div>
                                <div className="text-center">{subheading}</div>
                                <Popover offset={20} placement="top">
                                    <PopoverTrigger>
                                        <Button
                                            endContent={
                                                <InformationCircleIcon className="icon" />
                                            }
                                        >
                                            {"What's This?"}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="bg-secondary-800">
                                        <div className="px-1 py-2 max-w-64">
                                            <h4 className="font-bold">
                                                {title}
                                            </h4>
                                            <div>{description}</div>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </motion.div>
                        );
                    }
                )}
            </div>
        </div>
    );
}
