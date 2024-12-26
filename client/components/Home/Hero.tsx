'use client';

import {
    motion,
    type Variants,
    useMotionValueEvent,
    useScroll,
} from 'motion/react';
import { ClipboardIcon, UserIcon } from '@heroicons/react/24/solid';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

import { Endpoints } from '@coursefull';
import LinkButton from '@components/Button/LinkButton';
import Button from '@components/Button/Button';

export default function Hero() {

    const basicVariants: Variants = {
        offscreen: {
            opacity: 0,
            filter: 'blur(5px)',
        },
        onscreen: {
            opacity: 1,
            filter: 'blur(0)',
        },
    };

    const headerVariants: Variants = {
        offscreen: {
            ...basicVariants.offscreen,
            x: '-100%',
        },
        onscreen: {
            ...basicVariants.onscreen,
            x: '0%',
        },
    };

    const heroVariants: Variants = {
        offscreen: {
            ...basicVariants.offscreen,
            y: '100%',
        },
        onscreen: {
            ...basicVariants.onscreen,
            y: '0%',
        },
    };

    const quoteVariants: Variants = {
        offscreen: {
            ...heroVariants.offscreen,
            className: 'hidden sm:visible',
        },
        onscreen: {
            ...heroVariants.onscreen,
            className: 'hidden sm:visible',
        },
    };

    const heroDelay: number = 1.5;
    const heroButtonDelay: number = heroDelay + 0.5;

    const headerTransition = { duration: 0.5, delay: 1, type: 'spring' };
    const heroTransition = { ...headerTransition, delay: heroDelay };

    const heroLinkButtons = [
        {
            href: Endpoints.LOGIN,
            text: 'Login',
            testId: 'home-login',
            endContent: <UserIcon className="w-6 h-6"></UserIcon>,
        },
        {
            href: Endpoints.SIGN_UP,
            text: 'Sign Up',
            testId: 'home-signup',
            endContent: <ClipboardIcon className="w-6 h-6"></ClipboardIcon>,
        },
    ];

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between sm:px-16">
            <div className="basis-1/2">
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
                    Tracking goals is in.
                </motion.h1>
                <motion.p
                    initial="offscreen"
                    whileInView="onscreen"
                    variants={heroVariants}
                    transition={heroTransition}
                    viewport={{ once: true }}
                    className="text-xl sm:text-2xl my-5"
                >
                    CourseFull tracks your grades, and what you need to achieve
                    your goals, all semester long.
                </motion.p>
                <motion.blockquote
                    initial="offscreen"
                    whileInView="onscreen"
                    variants={quoteVariants}
                    transition={{
                        ...heroTransition,
                        delay: heroDelay + 0.1,
                    }}
                    viewport={{ once: true }}
                    className="p-4 my-4 border-s-4 border-background-300"
                >
                    <p className="text-xl italic font-medium leading-relaxed">
                        {
                            "It's not what we do once in a while that shapes our lives. It's what we do consistently."
                        }
                    </p>
                    <p>~ Tony Robbins</p>
                </motion.blockquote>
            </div>
            <div className="basis-1/2 flex flex-col gap-8">
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
                        className="w-full sm:w-3/4 ms-auto me-2"
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
                    className="w-full sm:w-3/4 ms-auto me-2"
                >
                    <Button
                        className="w-full"
                        data-testid="home-learn-more"
                        endContent={
                            <InformationCircleIcon className="w-6 h-6"></InformationCircleIcon>
                        }
                    >
                        Learn More
                    </Button>
                </motion.div>
            </div>
        </div>
    );
}
