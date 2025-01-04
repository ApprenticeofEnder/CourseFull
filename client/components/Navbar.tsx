'use client';

import AccountDropdown from '@components/AccountDropdown';
import {
    Navbar,
    NavbarBrand,
    NavbarMenuToggle,
    NavbarMenu,
    NavbarMenuItem,
    NavbarContent,
    NavbarItem,
    Spinner,
    Spacer,
} from '@nextui-org/react';
import { Endpoints } from '@coursefull';
import { Fragment, useEffect, useState } from 'react';
import { useSession } from '@lib/supabase/SessionContext';
import Link from '@components/Link';
import LinkButton from '@components/Button/LinkButton';
import { GitHubLogoIcon } from '@radix-ui/react-icons';

const GITHUB_LINK: string = 'https://github.com/ApprenticeofEnder/CourseFull';

// TODO: Add links for the unauthenticated home page

export default function CourseFullNavbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const { session, loadingSession } = useSession()!;

    const menuItems: {
        label: string;
        href: string;
        color: 'foreground' | 'primary' | 'danger' | 'warning';
        disabled?: boolean;
    }[] = [
        {
            label: 'Dashboard',
            href: Endpoints.DASHBOARD,
            color: 'foreground',
        },
        {
            label: 'Products',
            href: Endpoints.PRODUCTS,
            color: 'primary',
        },
        {
            label: 'Contact Us',
            href: Endpoints.CONTACT,
            color: 'foreground',
        },
    ];

    return (
        <Navbar
            onMenuOpenChange={setIsMenuOpen}
            position="sticky"
            className="bg-background-900"
        >
            <NavbarContent>
                <NavbarMenuToggle
                    aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                    className="md:hidden"
                />
                <NavbarBrand>
                    <p className="font-bold text-inherit sm:hidden">
                        CourseFull
                    </p>
                    <Link
                        color="foreground"
                        href={Endpoints.ROOT}
                        underline="hover"
                    >
                        {/* <AcmeLogo /> */}
                        <h3 className="font-bold text-inherit hidden sm:flex lg:hidden">
                            CourseFull
                        </h3>
                        <h2 className="font-bold text-inherit hidden lg:flex">
                            CourseFull
                        </h2>
                    </Link>

                    <div className="hidden md:flex">
                        <Spacer x={2} />

                        <a
                            color="foreground"
                            href={GITHUB_LINK}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <GitHubLogoIcon className="h-6 w-6" />
                        </a>
                    </div>
                </NavbarBrand>
            </NavbarContent>
            {session && (
                <NavbarContent
                    className="hidden md:flex gap-4"
                    justify="center"
                >
                    {menuItems.map((menuItem) => (
                        <NavbarItem isActive={menuItem.color == 'primary'} key={menuItem.href}>
                            <Link
                                color={menuItem.color}
                                href={menuItem.href}
                                underline="hover"
                            >
                                {menuItem.label}
                            </Link>
                        </NavbarItem>
                    ))}
                </NavbarContent>
            )}

            <NavbarContent justify="end">
                {loadingSession ? (
                    <Spinner />
                ) : session ? (
                    <AccountDropdown />
                ) : (
                    <Fragment>
                        <NavbarItem className="hidden lg:flex">
                            <LinkButton
                                className="top-1"
                                href={Endpoints.LOGIN}
                                variant="flat"
                                data-testid="nav-signup"
                            >
                                Login
                            </LinkButton>
                        </NavbarItem>
                        <NavbarItem>
                            <LinkButton
                                className="top-1"
                                href={Endpoints.SIGN_UP}
                                variant="flat"
                                data-testid="nav-signup"
                            >
                                Sign Up
                            </LinkButton>
                        </NavbarItem>
                    </Fragment>
                )}
            </NavbarContent>
            <NavbarMenu className="bg-background-900">
                {menuItems.map((item, index) => {
                    return (
                        <NavbarMenuItem key={`${item}-${index}`}>
                            <Link
                                className="w-full"
                                isDisabled={item.disabled}
                                href={item.href}
                                size="lg"
                                color={item.color}
                                onClick={() => {
                                    setIsMenuOpen(false);
                                }}
                            >
                                {item.label}
                            </Link>
                        </NavbarMenuItem>
                    );
                })}
                <Spacer y={4} />

                <hr className="border-1 border-primary-700/50 my-2" />

                <NavbarMenuItem
                    key="github"
                    onClick={() => {
                        setIsMenuOpen(false);
                    }}
                >
                    <a
                        className="w-full flex"
                        href={GITHUB_LINK}
                        color="foreground"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <GitHubLogoIcon className="h-6 w-6" />
                        <Spacer x={2} />
                        Github
                    </a>
                </NavbarMenuItem>
            </NavbarMenu>
        </Navbar>
    );
}
