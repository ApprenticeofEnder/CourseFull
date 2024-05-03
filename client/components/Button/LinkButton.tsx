import Button, { ButtonProps } from '@/components/Button/Button';
import { useRouter } from 'next/navigation';
import { forwardRef } from 'react';

export interface LinkButtonProps extends ButtonProps {
    href: string;
}

export default forwardRef<HTMLButtonElement, LinkButtonProps>(function (
    { children, href, ...props },
    ref
) {
    let { className, ...remainingProps } = props;

    const router = useRouter();
    return (
        <Button
            className={className}
            onPressEnd={() => router.push(href)}
            {...remainingProps}
            ref={ref}
        >
            <div className="flex justify-between">{children}</div>
        </Button>
    );
});
