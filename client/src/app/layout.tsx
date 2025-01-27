import type { Metadata } from 'next';
import { Atkinson_Hyperlegible } from 'next/font/google';

import '@/app/globals.css';
import AppLayout from '@/components/Ui/AppLayout';

import { Providers } from './providers';

export const metadata: Metadata = {
    title: 'CourseFull',
    description: 'Live your education to the fullest.',
};

const atkinsonHyperlegible = Atkinson_Hyperlegible({
    weight: ['400', '700'],
    subsets: ['latin'],
});

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${atkinsonHyperlegible.className} antialiased`}>
                <Providers>
                    <AppLayout>{children}</AppLayout>
                </Providers>
            </body>
        </html>
    );
}
