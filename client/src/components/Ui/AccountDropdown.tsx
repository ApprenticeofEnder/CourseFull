import { ShoppingCartIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import {
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownSection,
    DropdownTrigger,
} from "@heroui/react";
import { ExitIcon, GearIcon } from '@radix-ui/react-icons';
import { useRouter } from 'next/navigation';
import { Key } from 'react';

import Button from '@/components/Button/Button';
import { Endpoints } from '@/types';

// import { Endpoints } from '@/types';

interface AccountDropdownProps {
    name: string;
}

export default function AccountDropdown({ name }: AccountDropdownProps) {
    const router = useRouter();

    function action(key: Key) {
        switch (key) {
            case 'account':
                alert('Account');
                break;
            case 'cart':
                alert('Cart');
                break;
            case 'logout':
                router.push(Endpoints.Auth.LOGOUT);
                break;
        }
    }

    const menuItems = [
        {
            key: 'cart',
            label: 'Cart',
            icon: <ShoppingCartIcon className="icon"></ShoppingCartIcon>,
        },
        {
            key: 'account',
            label: 'My Account',
            icon: <GearIcon className="icon"></GearIcon>,
        },
    ];

    return (
        <Dropdown placement="bottom-end">
            <DropdownTrigger>
                <Button startContent={<UserCircleIcon className="icon" />}>
                    <span className="sr-only">Open user menu</span>
                    {name}
                </Button>
            </DropdownTrigger>
            <DropdownMenu
                aria-label="User Options"
                // disabledKeys={['account', 'cart']}
                onAction={(key) => action(key)}
            >
                <DropdownSection showDivider items={menuItems}>
                    {(item) => (
                        <DropdownItem key={item.key} startContent={item.icon}>
                            {item.label}
                        </DropdownItem>
                    )}
                </DropdownSection>
                <DropdownItem
                    key={'logout'}
                    startContent={<ExitIcon className="icon" />}
                >
                    Log Out
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>
    );
}
