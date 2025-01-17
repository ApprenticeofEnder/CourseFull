// app/providers.tsx
'use client';

import { useRouter } from 'next/navigation';
import { NextUIProvider } from '@nextui-org/react';
import QueryProvider from '@/lib/query/QueryContext';
import AuthProvider from '@/lib/supabase/SessionContext';
import TimeProvider from '@/lib/time/TimeContext';

export function Providers({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    return (
        <NextUIProvider navigate={router.push} reducedMotion="user">
            <QueryProvider>
                <AuthProvider>
                    <TimeProvider>{children}</TimeProvider>
                </AuthProvider>
            </QueryProvider>
        </NextUIProvider>
    );
}
