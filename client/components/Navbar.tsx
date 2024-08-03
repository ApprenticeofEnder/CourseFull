'use client';

import AccountDropdown from '@/components/AccountDropdown';
import {
    Navbar,
    NavbarBrand,
    NavbarMenuToggle,
    NavbarMenu,
    NavbarMenuItem,
    NavbarContent,
    NavbarItem,
    Link,
    Spinner,
} from '@nextui-org/react';
import { Endpoints } from '@/lib/enums';
import { Fragment, useEffect, useState } from 'react';
import Button from '@/components/Button/Button';
import { useSession } from '@/lib/session/sessionContext';

export default function CourseFullNavbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const { session, loadingSession } = useSession()!;

    return (
        <Navbar
            onMenuOpenChange={setIsMenuOpen}
            position="sticky"
            className="bg-background-900"
        >
            <NavbarContent>
                <NavbarMenuToggle
                    aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                    className="sm:hidden"
                />
                <NavbarBrand>
                    <Link
                        color="foreground"
                        href={Endpoints.ROOT}
                        underline="hover"
                    >
                        {/* <AcmeLogo /> */}
                        <p className="font-bold text-inherit sm:hidden">
                            CourseFull
                        </p>
                        <h3 className="font-bold text-inherit hidden sm:flex lg:hidden">
                            CourseFull
                        </h3>
                        <h2 className="font-bold text-inherit hidden lg:flex">
                            CourseFull
                        </h2>
                    </Link>
                </NavbarBrand>
            </NavbarContent>
            <NavbarContent className="hidden sm:flex gap-4" justify="center">
                <NavbarItem>
                    <Link
                        color="foreground"
                        href={Endpoints.ROOT}
                        underline="hover"
                    >
                        Home
                    </Link>
                </NavbarItem>
                <NavbarItem>
                    <Link color="foreground" href="#" isDisabled>
                        Guides (Coming Soon!)
                    </Link>
                </NavbarItem>
                <NavbarItem isActive>
                    <Link href={Endpoints.PRODUCTS} underline="hover">
                        Products
                    </Link>
                </NavbarItem>
            </NavbarContent>
            <NavbarContent justify="end">
                {loadingSession ? (
                    <Spinner />
                ) : session ? (
                    <AccountDropdown />
                ) : (
                    <Fragment>
                        <NavbarItem className="hidden lg:flex">
                            <Link href="#">Login</Link>
                        </NavbarItem>
                        <NavbarItem>
                            <Button
                                as={Link}
                                className="top-1"
                                href="#"
                                variant="flat"
                            >
                                Sign Up
                            </Button>
                        </NavbarItem>
                    </Fragment>
                )}
            </NavbarContent>
            <NavbarMenu></NavbarMenu>
        </Navbar>
        // {/* </Spacer> */}
        // </nav>
    );
}
