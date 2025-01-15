import { motion } from 'motion/react';
import { ForwardedRef, forwardRef } from 'react';
import { expositionVariants } from '@/lib/animations/variants';
import { ChildrenProps } from '@/types';

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
