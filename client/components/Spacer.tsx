import { SpacerProps } from '@coursefull';
import { classNames } from '@lib/helpers';

/**
 * A spacer component to be wrapped around page content. Used to keep consistent spacing.
 */
export default function Spacer({ children, className }: SpacerProps) {
    return (
        <div
            className={classNames(
                'mx-auto max-w-[1024px] h-dvh px-6 bg-background-900 -mt-16',
                className || ''
            )}
        >
            {children}
        </div>
    );
}
