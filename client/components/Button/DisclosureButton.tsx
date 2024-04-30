import { forwardRef, Fragment } from 'react';
import { Disclosure } from '@headlessui/react';
import Button, { ButtonProps } from '@/components/Button/Button';
import { ChevronRightIcon } from '@heroicons/react/20/solid';

export interface DisclosureButtonProps extends ButtonProps {}

export default forwardRef<HTMLButtonElement, DisclosureButtonProps>(function (
    { children, ...props },
    ref
) {
    let { className, ...remainingProps } = props;
    return (
        <Button className={className} {...remainingProps} ref={ref}>
            <div className="flex justify-between">
                {children}
                <ChevronRightIcon className="ui-open:-rotate-90 ui-not-open:rotate-90 h-6 w-6" />
            </div>
        </Button>
    );
});
