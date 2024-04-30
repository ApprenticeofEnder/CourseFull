'use client';

import { ChildrenProps } from '@/lib/types';
import { MouseEventHandler } from 'react';

export default function Button({
    children,
    onClick,
}: ChildrenProps & { onClick?: MouseEventHandler<HTMLElement> }) {
    return (
        <button
            className="relative rounded-md button-outer w-full"
            onClick={onClick || (() => {})}
        >
            <div className="button rounded-md button-inner">{children}</div>
        </button>
    );
}
