import { NextUIProvider, ScrollShadow } from '@nextui-org/react';
import { MotionConfig } from 'motion/react';
import { Atkinson_Hyperlegible } from 'next/font/google';
import type { Metadata } from 'next';

import Navbar from '@components/Navbar';
import Spacer from '@components/Spacer';
import { Toaster } from '@components/Toast/Toaster';
import { ChildrenProps } from '@coursefull/props';
import CartProvider from '@lib/cart/CartContext';
import HomePageProvider from '@lib/home/HomePageContext';
import QueryProvider from '@lib/query/QueryContext';
import SessionProvider from '@lib/supabase/SessionContext';

import './globals.css';
import Footer from '@components/Footer';

const atkinsonHyperlegible = Atkinson_Hyperlegible({
    weight: ['400', '700'],
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: 'CourseFull',
    description: 'Live your education to the fullest.',
};

function Contexts({ children }: ChildrenProps) {
    return (
        <QueryProvider>
            <SessionProvider>
                <CartProvider>
                    <HomePageProvider>
                        <NextUIProvider>
                            <MotionConfig reducedMotion="user">
                                {children}
                            </MotionConfig>
                        </NextUIProvider>
                    </HomePageProvider>
                </CartProvider>
            </SessionProvider>
        </QueryProvider>
    );
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={atkinsonHyperlegible.className}>
                <Contexts>
                    <div className="flex h-dvh flex-col overflow-x-clip">
                        <Navbar />
                        <ScrollShadow
                            hideScrollBar
                            className="flex flex-grow flex-col mx-auto w-full max-w-[1024px] px-6 bg-background-900"
                        >
                            {children}
                        </ScrollShadow>
                        <Footer />
                    </div>
                    <Toaster />
                </Contexts>
            </body>
        </html>
    );
}
