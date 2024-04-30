'use client';

import { forwardRef } from 'react';
import {
    useButton,
    Ripple,
    Spinner,
    ButtonProps as BaseButtonProps,
} from '@nextui-org/react';

export interface ButtonProps extends BaseButtonProps {}

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
        disableRipple,
        getButtonProps,
        getRippleProps,
    } = useButton({
        ref,
        ...props,
    });

    const { ripples, onClear } = getRippleProps();

    return (
        <button
            ref={domRef}
            className="relative rounded-md button-outer w-full"
            {...getButtonProps()}
        >
            <div className="button rounded-md button-inner">
                {startContent}
                {isLoading && spinnerPlacement === 'start' && spinner}
                {children}
                {isLoading && spinnerPlacement === 'end' && spinner}
                {endContent}
                {!disableRipple && (
                    <Ripple ripples={ripples} onClear={onClear} />
                )}
            </div>
        </button>
    );
});

NDButton.displayName = 'NDButton';

NDButton.defaultProps = {
    onPressStart: (e) => {
        e.target.classList.toggle(
            'button-outer__clicked hover:translate-y-1 hover:pb-1'
        );
        e.target.children[0].classList.toggle('button-inner__clicked');
    },
    onPressEnd: (e) => {
        e.target.classList.toggle(
            'button-outer__clicked hover:translate-y-1 hover:pb-1'
        );
        e.target.children[0].classList.toggle('button-inner__clicked');
    },
};

export default NDButton;
