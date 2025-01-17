'use client';

import { Link as BaseLink, LinkProps } from '@nextui-org/react';

export default function Link({ children, href, ...props }: LinkProps) {
    return (
        <BaseLink href={href} rel="noopener noreferrer" {...props}>
            {children}
        </BaseLink>
    );
}
