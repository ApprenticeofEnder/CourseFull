import Button, { ButtonProps } from '@/components/Button/Button';
import { useRouter } from 'next/navigation';
import { Fragment, forwardRef } from 'react';
import ConfirmButton from '@/components/Button/ConfirmButton';

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
        <Fragment>
            {confirm ? (
                <ConfirmButton
                    className={className}
                    onPressEnd={() => router.push(href)}
                    {...props}
                    ref={ref}
                >
                    <div className="flex justify-between">{children}</div>
                </ConfirmButton>
            ) : (
                <Button
                    className={className}
                    onPressEnd={() => router.push(href)}
                    {...props}
                    ref={ref}
                >
                    <div className="flex justify-between">{children}</div>
                </Button>
            )}
        </Fragment>
    );
});
