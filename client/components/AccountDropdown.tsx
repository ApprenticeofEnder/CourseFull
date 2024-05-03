'use client';

import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import { SessionProps } from '@/lib/types';
import MenuButton from '@/components/Button/MenuButton';
import { classNames, Endpoints } from '@/lib/helpers';

type MenuItem = {
    href: string;
    text: string;
};

let menuItemsAuth: MenuItem[] = [
    {
        href: '#',
        text: 'Your Profile',
    },
    {
        href: '#',
        text: 'Settings',
    },
    {
        href: Endpoints.LOGOUT,
        text: 'Sign Out',
    },
];

let menuItemsAnon: MenuItem[] = [
    {
        href: Endpoints.LOGIN,
        text: 'Login',
    },
    {
        href: Endpoints.SIGN_UP,
        text: 'Sign Up',
    },
];

let userIconAnon = (
    <Fragment>
        <UserCircleIcon className="h-6 w-6 rounded-full"></UserCircleIcon>
        <div className="p-1 text-sm">Anon</div>
    </Fragment>
);

export default function AccountDropdown({ session }: SessionProps) {
    let userIcon = userIconAnon;
    let menuItems = menuItemsAnon;
    if (session) {
        menuItems = menuItemsAuth;
    }
    return (
        <Menu as="div" className="relative ml-3">
            <div>
                <Menu.Button as={MenuButton}>
                    <span className="sr-only">Open user menu</span>
                    <div className="flex">{userIcon}</div>
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
                <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    {menuItems.map((menuItem) => (
                        <Menu.Item key={menuItem.text}>
                            {({ active }) => (
                                <a
                                    href={menuItem.href}
                                    className={classNames(
                                        active ? 'bg-gray-200' : '',
                                        'block px-4 py-2 text-sm text-gray-700'
                                    )}
                                >
                                    {menuItem.text}
                                </a>
                            )}
                        </Menu.Item>
                    ))}
                </Menu.Items>
            </Transition>
        </Menu>
    );
}
