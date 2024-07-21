import Button, { ButtonProps } from '@/components/Button/Button';
import { useRouter } from 'next/navigation';
import { Fragment, forwardRef } from 'react';

export interface LinkButtonProps extends ButtonProps {
    href: string;
    confirm?: boolean;
}

export default forwardRef<HTMLButtonElement, LinkButtonProps>(function (
    { children, href, className, confirm, ...props },
    ref
) {
    const router = useRouter();
    return (
        <Button
            className={className}
            onPressEnd={() => router.push(href)}
            {...props}
            ref={ref}
            buttonType={confirm ? 'confirm' : 'default'}
        >
            <div className="flex justify-between">{children}</div>
        </Button>
    );
});
