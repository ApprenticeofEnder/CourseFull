'use client';

import Link from '@/components/Ui/Link';
import Spacer from '@/components/Ui/Spacer';
import { Endpoints } from '@/types';

export default function Footer() {
    // TODO: Add links to features, pricing, FAQ, legal disclaimers, etc.
    interface MenuItem {
        label: string;
        color: 'foreground' | 'primary' | 'danger' | 'warning';
        disabled?: boolean;
        href: string;
    }

    const menuItems: MenuItem[] = [
        {
            label: 'Terms of Service',
            color: 'foreground',
            href: Endpoints.Legal.TERMS_OF_SERVICE,
        },
        {
            label: 'Privacy Policy',
            color: 'foreground',
            href: Endpoints.Legal.PRIVACY_POLICY,
        },
    ];

    return (
        <Spacer>
            <div className="collapse flex items-center justify-center gap-4 py-4 md:visible">
                {menuItems.map((menuItem) => {
                    const { label, href, color } = menuItem;
                    return (
                        <Link key={label} href={href} color={color}>
                            {label}
                        </Link>
                    );
                })}
            </div>
        </Spacer>
    );
}
