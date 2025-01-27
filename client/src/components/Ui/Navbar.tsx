import {
    Navbar as BaseNavbar,
    Divider,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    NavbarMenu,
    NavbarMenuItem,
    NavbarMenuToggle,
    Spacer,
} from '@heroui/react';
import { GitHubLogoIcon } from '@radix-ui/react-icons';
import { useState } from 'react';

import LinkButton from '@/components/Button/LinkButton';
import AccountDropdown from '@/components/Ui/AccountDropdown';
import Link from '@/components/Ui/Link';
import { useSession } from '@/lib/supabase/SessionContext';
import { Endpoints } from '@/types';

// interface MenuItem {
//     label: string;
//     color: 'foreground' | 'primary' | 'danger' | 'warning';
//     disabled?: boolean;
// }

// interface AuthenticatedMenuItem extends MenuItem {
//     href: string;
// }

// interface HomeMenuItem extends MenuItem {
//     onClick: (() => void) | undefined;
// }

const GITHUB_LINK: string = 'https://github.com/ApprenticeofEnder/CourseFull';

function authenticatedMenuItems() {
    return <div></div>;
}

function homeMenuItems() {
    return <div></div>;
}

export default function Navbar() {
    const { session } = useSession();

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <BaseNavbar
            onMenuOpenChange={setIsMenuOpen}
            isMenuOpen={isMenuOpen}
            position="sticky"
            className="bg-background-900"
        >
            <NavbarContent>
                <NavbarMenuToggle
                    aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                />
                <NavbarBrand>
                    <Link
                        color="foreground"
                        href={Endpoints.Page.HOME}
                        underline="hover"
                    >
                        {/* <AcmeLogo /> */}
                        <h3 className="font-bold text-inherit lg:hidden">
                            CourseFull
                        </h3>
                        <h2 className="hidden font-bold text-inherit lg:flex">
                            CourseFull
                        </h2>
                    </Link>
                </NavbarBrand>
            </NavbarContent>
            <NavbarContent justify="end">
                {session ? (
                    <AccountDropdown
                        name={session.user.user_metadata.first_name}
                    />
                ) : (
                    <>
                        <NavbarItem className="hidden lg:flex">
                            <LinkButton
                                href={Endpoints.Auth.LOGIN}
                                variant="flat"
                                data-testid="nav-signup"
                            >
                                Login
                            </LinkButton>
                        </NavbarItem>
                        <NavbarItem>
                            <LinkButton
                                href={Endpoints.Auth.SIGN_UP}
                                variant="flat"
                                data-testid="nav-signup"
                            >
                                Sign Up
                            </LinkButton>
                        </NavbarItem>
                    </>
                )}
            </NavbarContent>
            <NavbarMenu className="mx-auto max-w-[1024px] bg-background-900">
                {session ? authenticatedMenuItems() : homeMenuItems()}
                <Divider />
                <NavbarMenuItem
                    key="github"
                    onClick={() => {
                        setIsMenuOpen(false);
                    }}
                >
                    <a
                        className="flex w-full"
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
        </BaseNavbar>
    );
}
