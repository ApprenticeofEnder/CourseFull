import { motion, type Variants } from 'motion/react';
import { ReactNode, useState } from 'react';
import {
    ArrowTrendingUpIcon,
    CalendarIcon,
    EyeIcon,
    InformationCircleIcon,
} from '@heroicons/react/24/outline';

import Button from '@components/Button/Button';
import {
    Accordion,
    AccordionItem,
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@nextui-org/react';
import { useHomePage } from '@lib/home/HomePageContext';
import { expositionVariants, cardVariants } from '@lib/animations/variants';

export default function Faq() {
    const { refs } = useHomePage();

    const questions = [
        {
            question: 'How much does CourseFull cost?',
            answer: "$5 per course. That's it! You get 3 courses for free, and you can keep the credits for as long as you have an account.",
        },
    ];

    return (
        <motion.div
            ref={refs?.faqRef.ref}
            className="flex flex-col justify-center items-center gap-4 sm:px-16 sm:py-8"
        >
            <motion.h2
                initial="offscreen"
                whileInView="onscreen"
                variants={expositionVariants}
            >
                FAQ
            </motion.h2>
            <Accordion variant="splitted">
                {questions.map(({ question, answer }, index) => {
                    return (
                        <AccordionItem
                            key={index}
                            aria-label={question}
                            title={question}
                            className='bg-primary-800'
                        >
                            {answer}
                        </AccordionItem>
                    );
                })}
            </Accordion>
        </motion.div>
    );
}
