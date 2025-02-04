'use client';

import {
    Button as BaseButton,
    ButtonProps as BaseButtonProps,
    cn,
} from '@heroui/react';
import { forwardRef } from 'react';

export interface ButtonProps extends BaseButtonProps {
    buttonType?: 'default' | 'danger' | 'confirm' | 'warning';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        { children, size = 'md', className, buttonType = 'default', ...props },
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
                    'button top-1 h-fit rounded-lg font-bold hover:-translate-y-1 active:translate-y-0 active:shadow-none',
                    types[buttonType],
                    'text-text-200 focus:bg-warning-100',
                    className || '',
                    sizes[size]
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
