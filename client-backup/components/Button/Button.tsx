'use client';

import { forwardRef } from 'react';
import { Button, ButtonProps as BaseButtonProps } from '@nextui-org/react';

import { classNames } from '@lib/helpers';

export interface ButtonProps extends BaseButtonProps {
    buttonSize?: 'sm' | 'md' | 'lg';
    buttonType?: 'default' | 'danger' | 'confirm' | 'warning';
}

const CourseFullButton = forwardRef<HTMLButtonElement, ButtonProps>(
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
            <Button
                ref={ref}
                className={classNames(
                    'button font-bold rounded-lg top-1 hover:-translate-y-1 active:translate-y-0 active:shadow-none',
                    types[buttonType],
                    'text-text-200 focus:bg-warning-100',
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

CourseFullButton.displayName = 'Button';

export default CourseFullButton;
