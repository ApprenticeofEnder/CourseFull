'use client';

import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { ClipboardIcon, UserIcon } from '@heroicons/react/24/solid';
import { motion } from 'motion/react';

import Button from '@/components/Button/Button';
import LinkButton from '@/components/Button/LinkButton';
import { headerVariants, heroVariants } from '@/lib/animations/variants';
import { useHomePage } from '@/lib/home/HomePageContext';
import { Endpoints } from '@/types';

export default function Hero() {
    const { refs } = useHomePage();

    const heroDelay: number = 1.5;
    const heroButtonDelay: number = heroDelay + 0.5;

    const headerTransition = { duration: 0.5, delay: 1, type: 'spring' };
    const heroTransition = { ...headerTransition, delay: heroDelay };

    const heroLinkButtons = [
        {
            href: Endpoints.Auth.LOGIN,
            text: 'Start Tracking Your Goals',
            testId: 'home-login',
            endContent: <UserIcon className="h-6 w-6"></UserIcon>,
        },
        {
            href: Endpoints.Auth.SIGN_UP,
            text: 'Try a Better Way to Manage Goals',
            testId: 'home-signup',
            endContent: <ClipboardIcon className="h-6 w-6"></ClipboardIcon>,
        },
    ];

    const scrollToMechanics = () => {
        refs?.mechanicsRef.scrollIntoView();
    };

    return (
        <div
            className="flex flex-col items-center justify-between sm:flex-row sm:px-16 sm:py-8"
            ref={refs?.heroRef.ref}
        >
            <div className="sm:basis-1/2">
                <motion.h1
                    initial="offscreen"
                    whileInView="onscreen"
                    variants={headerVariants}
                    viewport={{ once: true }}
                    className="text-left text-4xl sm:text-5xl"
                >
                    Last minute exam anxiety is out.
                </motion.h1>
                <motion.h1
                    initial="offscreen"
                    whileInView="onscreen"
                    variants={headerVariants}
                    transition={headerTransition}
                    viewport={{ once: true }}
                    className="text-left text-5xl font-bold"
                >
                    Tracking school goals is in.
                </motion.h1>
                <motion.p
                    initial="offscreen"
                    whileInView="onscreen"
                    variants={heroVariants}
                    transition={heroTransition}
                    viewport={{ once: true }}
                    className="my-5 text-xl sm:text-2xl"
                >
                    CourseFull tracks your grades, and what you need to achieve
                    your goals, so you can get the report card of your dreams.
                </motion.p>
                <motion.blockquote
                    initial="offscreen"
                    whileInView="onscreen"
                    variants={heroVariants}
                    transition={{
                        ...heroTransition,
                        delay: heroDelay + 0.1,
                    }}
                    viewport={{ once: true }}
                    className="my-4 hidden border-s-4 border-background-300 p-4 md:block"
                >
                    <p className="text-xl font-medium italic leading-relaxed">
                        {
                            "It's not what we do once in a while that shapes our lives. It's what we do consistently."
                        }
                    </p>
                    <p>~ Tony Robbins</p>
                </motion.blockquote>
            </div>
            <div className="flex flex-col gap-8 sm:basis-1/2">
                {heroLinkButtons.map((button, index) => (
                    <motion.div
                        key={`herobutton-${index}`}
                        initial="offscreen"
                        whileInView="onscreen"
                        variants={heroVariants}
                        transition={{
                            ...heroTransition,
                            delay: heroButtonDelay + 0.1 * index,
                        }}
                        viewport={{ once: true }}
                        className="me-2 ms-auto w-full sm:w-3/4"
                    >
                        <LinkButton
                            href={button.href}
                            className="w-full"
                            data-testid={button.testId}
                            endContent={button.endContent}
                        >
                            {button.text}
                        </LinkButton>
                    </motion.div>
                ))}
                <motion.div
                    initial="offscreen"
                    whileInView="onscreen"
                    variants={heroVariants}
                    transition={{
                        ...heroTransition,
                        delay: heroButtonDelay + 0.1 * heroLinkButtons.length,
                    }}
                    viewport={{ once: true }}
                    className="me-2 ms-auto w-full sm:w-3/4"
                >
                    <Button
                        className="w-full"
                        data-testid="home-learn-more"
                        endContent={
                            <InformationCircleIcon className="h-6 w-6"></InformationCircleIcon>
                        }
                        onPress={scrollToMechanics}
                    >
                        How It Works
                    </Button>
                </motion.div>
            </div>
        </div>
    );
}
