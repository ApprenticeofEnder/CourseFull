import type { Metadata } from 'next';
import { Inter, Atkinson_Hyperlegible } from 'next/font/google';
import { NextUIProvider } from '@nextui-org/react';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });
const atkinsonHyperlegible = Atkinson_Hyperlegible({
    weight: ['400', '700'],
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: 'CourseFull',
    description: 'Final exam grade calculations? Leave it to us.',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={
                    atkinsonHyperlegible.className +
                    'bg-sky-200 dark:bg-sky-950 text-foreground dark:text-neutral-50'
                }
            >
                <NextUIProvider>{children}</NextUIProvider>
            </body>
        </html>
    );
}
