import Navbar from '@components/Navbar';
import Spacer from '@components/Spacer';
import { Toaster } from '@components/Toast/Toaster';
import CartProvider from '@lib/cart/cartContext';
import SessionProvider from '@lib/supabase/sessionContext';
import { NextUIProvider } from '@nextui-org/react';
import type { Metadata } from 'next';
import { Atkinson_Hyperlegible, Inter } from 'next/font/google';
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
                            <Navbar />
                            <Spacer className="overflow-auto">
                                {children}
                            </Spacer>
                            <Toaster />
                        </NextUIProvider>
                    </CartProvider>
                </SessionProvider>
            </body>
        </html>
    );
}
