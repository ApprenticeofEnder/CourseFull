'use client';

import { forwardRef } from 'react';
import { Button, ButtonProps as BaseButtonProps } from '@nextui-org/react';
import { commonColors, semanticColors } from '@nextui-org/theme';

import { classNames } from '@/lib/helpers';

export interface ButtonProps extends BaseButtonProps {
    buttonSize?: 'sm' | 'md' | 'lg';
}

//TODO: Maybe convert this to a more general purpose button
const NDButton = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ children, buttonSize = 'md', className, ...props }, ref) => {
        const sizes = {
            sm: 'px-2 py-1',
            md: 'px-3 py-2',
            lg: 'px-5 py-3',
        };

        return (
            <Button
                ref={ref}
                className={classNames(
                    'button font-bold rounded-lg hover:-translate-y-1 active:translate-y-0 active:shadow-none',
                    'bg-primary-800 text-text-50',
                    className || '',
                    sizes[buttonSize]
                )}
                disableRipple
                {...props}
            >
                {children}
            </Button>
        );
    }
);

NDButton.displayName = 'NDButton';

export default NDButton;
