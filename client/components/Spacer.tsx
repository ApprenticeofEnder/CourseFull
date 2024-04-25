import { ReactNode } from 'react';

type Props = {
    children: ReactNode;
};

/**
 * A spacer component to be wrapped around page content. Used to keep consistent spacing.
 * @param children
 * @returns ReactNode
 */
export default function Spacer({ children }: Props) {
    return (
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">{children}</div>
    );
}
