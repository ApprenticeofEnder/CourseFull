'use client';

import { useRouter } from 'next/navigation';
import { forwardRef } from 'react';

import Button, { ButtonProps } from '@/components/Button/Button';

export interface LinkButtonProps extends ButtonProps {
    href: string;
    confirm?: boolean;
}

const LinkButton = forwardRef<HTMLButtonElement, LinkButtonProps>(function (
    { children, href, className, ...props },
    ref
) {
    const router = useRouter();
    return (
        <Button
            className={className}
            onPress={() => {
                router.push(href);
            }}
            {...props}
            ref={ref}
        >
            <div className="flex justify-between">{children}</div>
        </Button>
    );
});

LinkButton.displayName = 'LinkButton';

export default LinkButton;
