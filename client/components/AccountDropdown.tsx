'use client';

import { Fragment, useContext } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { UserCircleIcon } from '@heroicons/react/24/outline';

import Button from '@/components/Button/Button';
import { Endpoints } from '@coursefull';
import { classNames } from '@/lib/helpers';
import { UserMetadata } from '@supabase/supabase-js';
import { useCart } from '@/lib/cart/cartContext';
import LinkButton from '@/components/Button/LinkButton';
import { useSession } from '@/lib/session/sessionContext';
import Link from '@/components/Link';
import { useRouter } from 'next/navigation';

type MenuItem = {
    href: string;
    text: string;
};

const menuItemsAuth: MenuItem[] = [
    {
        href: Endpoints.SETTINGS,
        text: 'Settings',
    },
    {
        href: Endpoints.LOGOUT,
        text: 'Sign Out',
    },
];

const menuItemsAnon: MenuItem[] = [
    {
        href: Endpoints.LOGIN,
        text: 'Login',
    },
    {
        href: Endpoints.SIGN_UP,
        text: 'Sign Up',
    },
];

const userIconAnon = (
    <UserCircleIcon className="h-6 w-6 rounded-full"></UserCircleIcon>
);

const usernameAnon = 'Guest';

let userIcon = userIconAnon;
let username = usernameAnon;
let menuItems = menuItemsAnon;

export default function AccountDropdown() {
    const { session } = useSession()!;
    const { cart } = useCart()!;
    const router = useRouter();

    if (session) {
        menuItems = menuItemsAuth;
        const metadata: UserMetadata = session.user.user_metadata;
        username = metadata.first_name;
    }

    const cartItems = Object.keys(cart.items).reduce(
        (items, itemId) => items + cart.items[itemId].quantity,
        0
    );

    return (
        <div className="flex">
            <LinkButton href={Endpoints.CHECKOUT} className="top-1">
                Cart: {cartItems}
            </LinkButton>
            <Menu as="div" className="relative ml-3">
                <div>
                    <Menu.Button
                        as={Button}
                        startContent={userIcon}
                        className="top-1"
                    >
                        <span className="sr-only">Open user menu</span>
                        <div className="text-sm">{username}</div>
                    </Menu.Button>
                </div>
                <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-y-0"
                    enterTo="transform opacity-100 scale-y-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-y-100"
                    leaveTo="transform opacity-0 scale-y-0"
                >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-background-800 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        {menuItems.map((menuItem) => (
                            <Menu.Item key={menuItem.text}>
                                {({ active }) => (
                                    <Link
                                        href={menuItem.href}
                                        className={classNames(
                                            active ? 'bg-primary-600' : '',
                                            'block px-4 py-2 text-sm'
                                        )}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            router.push(e.currentTarget.href);
                                        }}
                                        color="foreground"
                                    >
                                        {menuItem.text}
                                    </Link>
                                )}
                            </Menu.Item>
                        ))}
                    </Menu.Items>
                </Transition>
            </Menu>
        </div>
    );
}
