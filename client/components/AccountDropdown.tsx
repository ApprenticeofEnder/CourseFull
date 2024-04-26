'use client';

import { Fragment } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import {
    Bars3Icon,
    BellIcon,
    XMarkIcon,
    UserCircleIcon,
} from '@heroicons/react/24/outline';

/**
 * @param classes Tailwind CSS class strings as arguments
 * @returns A space separated list of classes,
 * or an empty string if no classes are available.
 */
function classNames(...classes: string[]): string {
    return classes.filter(Boolean).join(' ');
}

type MenuItem = {
    href: string;
    text: string;
};

const menuItems: MenuItem[] = [
    {
        href: '#',
        text: 'Your Profile',
    },
    {
        href: '#',
        text: 'Settings',
    },
    {
        href: '#',
        text: 'Sign Out',
    },
];

export default function AccountDropdown() {
    return (
        <Menu as="div" className="relative ml-3">
            <div>
                <Menu.Button className="button text-sm rounded-md button-outer">
                    <span className="sr-only">Open user menu</span>
                    <div className="button rounded-md button-inner flex">
                        <UserCircleIcon className="h-8 w-8 rounded-full"></UserCircleIcon>
                        <div className="p-1 text-lg">You</div>
                    </div>
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
