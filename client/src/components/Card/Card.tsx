'use client';

import {
    Card as BaseCard,
    CardProps as BaseCardProps,
    cn,
} from '@heroui/react';
import { forwardRef } from 'react';

export interface CardProps extends BaseCardProps {
    cardType?: 'primary' | 'secondary';
}

const Card = forwardRef<HTMLDivElement, CardProps>(
    (
        {
            children,
            className,
            cardType = 'primary',
            isPressable,
            shadow = 'none',
            ...props
        },
        ref
    ) => {
        const types = {
            primary:
                'rounded-lg bg-primary-800 p-2 border-solid border-2 border-primary-500/10',
            secondary: 'card-secondary',
        };

        return (
            <BaseCard
                ref={ref}
                className={cn(
                    types[cardType],
                    className || '',
                    isPressable
                        ? 'transition-colours hover:bg-background-900'
                        : ''
                )}
                isPressable={isPressable}
                shadow={shadow}
                disableRipple
                {...props}
            >
                {children}
            </BaseCard>
        );
    }
);

Card.displayName = 'Card';

export default Card;
