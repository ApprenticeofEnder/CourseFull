'use client';

import { Endpoints } from '@/types';
import Spacer from '@/components/Ui/Spacer';
import Link from '@/components/Ui/Link';

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
            <div className="flex justify-center items-center collapse md:visible gap-4 py-4">
                {menuItems.map((menuItem) => {
                    const {label, href, color} = menuItem
                    return <Link key={label} href={href} color={color}>{label}</Link>;
                })}
            </div>
        </Spacer>
    );
}
