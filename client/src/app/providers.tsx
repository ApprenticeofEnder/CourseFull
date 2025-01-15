// app/providers.tsx
'use client';

import { useRouter } from 'next/navigation';
import { NextUIProvider } from '@nextui-org/react';
import QueryProvider from '@/lib/query/QueryContext';
import AuthProvider from '@/lib/supabase/SessionContext';

export function Providers({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    return (
        <NextUIProvider navigate={router.push}>
            <QueryProvider>
                <AuthProvider>{children}</AuthProvider>
            </QueryProvider>
        </NextUIProvider>
    );
}
