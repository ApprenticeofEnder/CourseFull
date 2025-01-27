'use client';

import { ScrollShadow } from "@heroui/react";

import Footer from '@/components/Ui/Footer';
import Navbar from '@/components/Ui/Navbar';
import { ChildrenProps } from '@/types';

/**
 * The actual cosmetic layout of the application, not counting providers and metadata.
 */
export default function AppLayout({ children }: ChildrenProps) {
    return (
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
    );
}
