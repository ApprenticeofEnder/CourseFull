import Button, { ButtonProps } from '@/components/Button/Button';
import { Fragment, forwardRef } from 'react';

import { classNames } from '@/lib/helpers';

export default forwardRef<HTMLButtonElement, ButtonProps>(function (
    { children, href, className, ...props },
    ref
) {
    return (
        <Button
            className={classNames(
                'button-confirm bg-green-300',
                className || ''
            )}
            {...props}
            ref={ref}
        >
            <div className="flex justify-between">{children}</div>
        </Button>
    );
});
