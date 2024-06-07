import { classNames } from '@/lib/helpers';
import { ChildrenProps } from '@/lib/types';

/**
 * A spacer component to be wrapped around page content. Used to keep consistent spacing.
 * @param children
 * @returns ReactNode
 */
export default function Spacer({
    children,
    className,
}: ChildrenProps & { className?: string }) {
    return (
        <div
            className={classNames(
                'mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 bg-background-900',
                className || ''
            )}
        >
            {children}
        </div>
    );
}
