import { SpacerProps, cn } from '@heroui/react';

/**
 * A spacer component to be wrapped around page content. Used to keep consistent spacing.
 */
export default function Spacer({ children, className }: SpacerProps) {
    return (
        <div
            className={cn(
                'mx-auto w-full max-w-[1024px] bg-background-900 px-6',
                className || ''
            )}
        >
            {children}
        </div>
    );
}
