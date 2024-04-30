import { forwardRef, Fragment } from 'react';
import { Disclosure } from '@headlessui/react';
import Button, { ButtonProps } from '@/components/Button/Button';
import { ChevronRightIcon } from '@heroicons/react/20/solid';

export interface MenuButtonProps extends ButtonProps {}

export default forwardRef<HTMLButtonElement, MenuButtonProps>(function (
    { children, ...props },
    ref
) {
    return (
        <Button {...props} ref={ref}>
            {children}
        </Button>
    );
});
