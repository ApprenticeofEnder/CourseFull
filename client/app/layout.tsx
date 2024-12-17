import { NextUIProvider, ScrollShadow } from '@nextui-org/react';
import { MotionConfig } from 'motion/react';
import { Atkinson_Hyperlegible, Inter } from 'next/font/google';
import type { Metadata } from 'next';

import Navbar from '@components/Navbar';
import Spacer from '@components/Spacer';
import { Toaster } from '@components/Toast/Toaster';
import CartProvider from '@lib/cart/cartContext';
import SessionProvider from '@lib/supabase/sessionContext';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });
const atkinsonHyperlegible = Atkinson_Hyperlegible({
    weight: ['400', '700'],
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: 'CourseFull',
    description: 'Live your education to the fullest.',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={atkinsonHyperlegible.className}>
                <SessionProvider>
                    <CartProvider>
                        <NextUIProvider>
                            <MotionConfig reducedMotion="user">
                                <Navbar />
                                <ScrollShadow className="relative flex justify-center">
                                    <Spacer>
                                        <main className="mt-10 mb-10 w-full px-6">
                                            {children}
                                        </main>
                                    </Spacer>
                                </ScrollShadow>
                                <Toaster />
                            </MotionConfig>
                        </NextUIProvider>
                    </CartProvider>
                </SessionProvider>
            </body>
        </html>
    );
}
