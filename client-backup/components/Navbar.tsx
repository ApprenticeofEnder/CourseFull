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
import { Fragment, useState } from 'react';
import { useSession } from '@lib/supabase/SessionContext';
import Link from '@components/Link';
import LinkButton from '@components/Button/LinkButton';
import { GitHubLogoIcon } from '@radix-ui/react-icons';
import { useHomePage } from '@lib/home/HomePageContext';

const GITHUB_LINK: string = 'https://github.com/ApprenticeofEnder/CourseFull';

export default function CourseFullNavbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const { session, loadingSession } = useSession();
    const { refs: homeRefs } = useHomePage();

    interface MenuItem {
        label: string;
        color: 'foreground' | 'primary' | 'danger' | 'warning';
        disabled?: boolean;
    }

    interface AuthenticatedMenuItem extends MenuItem {
        href: string;
    }

    interface HomeMenuItem extends MenuItem {
        onClick: (() => void) | undefined;
    }

    const homeMenuItems: HomeMenuItem[] = [
        {
            label: 'Home',
            color: 'foreground',
            onClick: homeRefs?.heroRef.navigateTo,
        },
        {
            label: 'Features',
            color: 'foreground',
            onClick: homeRefs?.featuresRef.navigateTo,
        },
        // {
        //     label: "Use Cases",
        //     color: "foreground",
        //     onClick: homeRefs?.inActionRef.scrollIntoView
        // },
        {
            label: 'Benefits',
            color: 'foreground',
            onClick: homeRefs?.benefitsRef.navigateTo,
        },
        {
            label: 'How It Works',
            color: 'foreground',
            onClick: homeRefs?.mechanicsRef.navigateTo,
        },
        {
            label: 'FAQ',
            color: 'foreground',
            onClick: homeRefs?.faqRef.scrollIntoView,
        },
    ];

    const authenticatedMenuItems: AuthenticatedMenuItem[] = [
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
            isMenuOpen={isMenuOpen}
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
                        href={session ? Endpoints.DASHBOARD : Endpoints.ROOT}
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
            {session ? (
                <NavbarContent
                    className="hidden md:flex gap-4"
                    justify="center"
                >
                    {authenticatedMenuItems.map((menuItem) => (
                        <NavbarItem
                            isActive={menuItem.color == 'primary'}
                            key={menuItem.href}
                        >
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
            ) : (
                <NavbarContent
                    className="hidden md:flex gap-4"
                    justify="center"
                >
                    {homeMenuItems.map(({ color, label, onClick }) => (
                        <NavbarItem isActive={color == 'primary'} key={label}>
                            <Link
                                color={color}
                                onClick={onClick}
                                underline="hover"
                                className="hover:cursor-pointer"
                            >
                                {label}
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
                                href={Endpoints.LOGIN}
                                variant="flat"
                                data-testid="nav-signup"
                            >
                                Login
                            </LinkButton>
                        </NavbarItem>
                        <NavbarItem>
                            <LinkButton
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
                {session
                    ? authenticatedMenuItems.map(
                          ({ label, disabled, href, color }, index) => {
                              return (
                                  <NavbarMenuItem key={`${label}-${index}`}>
                                      <Link
                                          className="w-full"
                                          isDisabled={disabled}
                                          href={href}
                                          size="lg"
                                          color={color}
                                          onClick={() => {
                                              setIsMenuOpen(false);
                                          }}
                                      >
                                          {label}
                                      </Link>
                                  </NavbarMenuItem>
                              );
                          }
                      )
                    : homeMenuItems.map(
                          ({ color, disabled, label, onClick }, index) => {
                              return (
                                  <NavbarItem
                                      isActive={color == 'primary'}
                                      key={`${label}-${index}`}
                                  >
                                      <Link
                                          color={color}
                                          size="lg"
                                          onClick={() => {
                                              setIsMenuOpen(false);
                                              onClick && onClick();
                                          }}
                                          underline="hover"
                                          className="w-full hover:cursor-pointer"
                                      >
                                          {label}
                                      </Link>
                                  </NavbarItem>
                              );
                          }
                      )}
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
