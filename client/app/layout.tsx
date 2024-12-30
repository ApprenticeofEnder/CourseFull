import { NextUIProvider, ScrollShadow } from '@nextui-org/react';
import {
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query';
import { MotionConfig } from 'motion/react';
import { Atkinson_Hyperlegible } from 'next/font/google';
import type { Metadata } from 'next';

import Navbar from '@components/Navbar';
import Spacer from '@components/Spacer';
import { Toaster } from '@components/Toast/Toaster';
import CartProvider from '@lib/cart/CartContext';
import SessionProvider from '@lib/supabase/SessionContext';
import QueryProvider from '@lib/query/QueryContext';
import './globals.css';
import { ChildrenProps } from '@coursefull/props';

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
                    <NextUIProvider>
                        <MotionConfig reducedMotion="user">
                            {children}
                        </MotionConfig>
                    </NextUIProvider>
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
                    <Navbar />
                    <ScrollShadow className="relative flex justify-center h-[calc(100dvh-64px)]">
                        <Spacer>{children}</Spacer>
                    </ScrollShadow>
                    <Toaster />
                </Contexts>
            </body>
        </html>
    );
}
