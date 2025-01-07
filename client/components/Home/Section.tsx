import { motion, type Variants } from 'motion/react';
import { ForwardedRef, forwardRef, ReactNode, RefObject, useState } from 'react';
import Button from '@components/Button/Button';
import { Popover, PopoverContent, PopoverTrigger } from '@nextui-org/react';
import { useHomePage } from '@lib/home/HomePageContext';
import { expositionVariants, cardVariants } from '@lib/animations/variants';
import { ChildrenProps } from '@coursefull/props';
import { HomePageRef } from '@coursefull/home-page';

interface SectionProps extends ChildrenProps {
    title: string;
}

const Section = forwardRef(function Section({ title, children }: SectionProps, ref: ForwardedRef<HTMLDivElement> | undefined){
    return <motion.div
            className="flex flex-col justify-center items-center gap-4 py-4 sm:px-16 sm:py-8"
            ref={ref}
        >
            <motion.h2
                initial="offscreen"
                whileInView="onscreen"
                variants={expositionVariants}
            >
                {title}
            </motion.h2>
            {children}
        </motion.div>
});

export default Section;
