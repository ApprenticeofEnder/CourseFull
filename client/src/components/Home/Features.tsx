import {
    ArrowTrendingUpIcon,
    CalendarIcon,
    EyeIcon,
    InformationCircleIcon,
} from '@heroicons/react/24/outline';
import { Popover, PopoverContent, PopoverTrigger } from '@heroui/react';
import { motion } from 'motion/react';
import { ReactNode } from 'react';

import Button from '@/components/Button/Button';
import Section from '@/components/Home/Section';
import { cardVariants } from '@/lib/animations/variants';
import { useHomePage } from '@/lib/home/HomePageContext';

interface FeatureData {
    title: string;
    subtitle: string;
    description: string;
    visual: ReactNode;
}

export default function Features() {
    const features: FeatureData[] = [
        {
            title: 'Automatic Goal Tracking',
            subtitle: 'Let us do the math for you!',
            description:
                'Got a target you need to hit? We do the math behind the scenes so you always know what you need to get on your assignments, exams, and other deliverables to get the report card of your dreams!',
            visual: <ArrowTrendingUpIcon className="icon-lg" />,
        },
        {
            title: 'Instant Visual Feedback',
            subtitle: "See how you're doing at a glance!",
            description:
                "Colour-coded items let you know where you have breathing room, where you need to put a little more work, and where you're starting to fall behind!",
            visual: <EyeIcon className="icon-lg" />,
        },
        {
            title: 'Always-On Deadline Tracking',
            subtitle: "Know what's coming up so you can prioritize better!",
            description:
                'Know what deadlines you have coming soon, and how much time you have left! If any deliverables are overdue, you will see them first.',
            visual: <CalendarIcon className="icon-lg" />,
        },
    ];

    const { refs } = useHomePage();

    return (
        <Section ref={refs?.featuresRef.ref} title="Features">
            <div className="flex flex-col justify-center gap-4 md:flex-row">
                {features.map(
                    (
                        { title, subtitle: subheading, visual, description },
                        index
                    ) => {
                        return (
                            <motion.div
                                className="card-primary flex basis-1/3 flex-col items-center justify-between gap-4 pb-4"
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
                                        <div className="max-w-64 px-1 py-2">
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
        </Section>
    );
}
