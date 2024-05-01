'use client';

import { MouseEvent, MouseEventHandler, forwardRef } from 'react';
import {
    useButton,
    Ripple,
    Spinner,
    ButtonProps as BaseButtonProps,
} from '@nextui-org/react';

import { classNames } from '@/lib/helpers';

export interface ButtonProps extends BaseButtonProps {
    buttonSize?: 'sm' | 'md' | 'lg';
}

const NDButton = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
    const {
        domRef,
        children,
        styles,
        spinnerSize,
        spinner = <Spinner color="current" size={spinnerSize} />,
        spinnerPlacement,
        startContent,
        endContent,
        isLoading,
        getButtonProps,
    } = useButton({
        ref,
        ...props,
    });

    let buttonSize = props.buttonSize || 'md';

    const sizes = {
        sm: 'px-2 py-1',
        md: 'px-3 py-2',
        lg: 'px-5 py-3',
    };

    return (
        <button
            ref={domRef}
            className={classNames(
                'button hover:-translate-y-1 active:translate-y-0 active:shadow-none',
                sizes[buttonSize],
                props.className || ''
            )}
            {...getButtonProps()}
        >
            {startContent}
            {isLoading && spinnerPlacement === 'start' && spinner}
            {children}
            {isLoading && spinnerPlacement === 'end' && spinner}
            {endContent}
        </button>
    );
});

NDButton.displayName = 'NDButton';

export default NDButton;
