'use client';

import {
    Button as BaseButton,
    ButtonProps as BaseButtonProps,
    cn,
} from '@nextui-org/react';
import { forwardRef } from 'react';

export interface ButtonProps extends BaseButtonProps {
    buttonSize?: 'sm' | 'md' | 'lg';
    buttonType?: 'default' | 'danger' | 'confirm' | 'warning';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            children,
            buttonSize = 'md',
            className,
            buttonType = 'default',
            ...props
        },
        ref
    ) => {
        const sizes = {
            sm: 'px-2 py-1',
            md: 'px-3 py-2',
            lg: 'px-5 py-3',
        };

        const types = {
            default: 'bg-primary-800',
            danger: 'button-danger bg-danger-200',
            confirm: 'button-confirm bg-success-200',
            warning: 'bg-warning-200',
        };

        return (
            <BaseButton
                ref={ref}
                className={cn(
                    'button font-bold rounded-lg top-1 hover:-translate-y-1 active:translate-y-0 active:shadow-none h-fit',
                    types[buttonType],
                    'text-text-200 focus:bg-warning-100',
                    className || '',
                    sizes[buttonSize]
                )}
                disableRipple
                {...props}
            >
                {children}
            </BaseButton>
        );
    }
);

Button.displayName = 'Button';

export default Button;
