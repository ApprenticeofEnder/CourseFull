// app/providers.tsx
'use client';

import { HeroUIProvider } from '@heroui/react';
import { useRouter } from 'next/navigation';

import QueryProvider from '@/lib/query/QueryContext';
import AuthProvider from '@/lib/supabase/SessionContext';
import TimeProvider from '@/lib/time/TimeContext';

// app/providers.tsx

export function Providers({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    return (
        <HeroUIProvider navigate={router.push} reducedMotion="user">
            <QueryProvider>
                <AuthProvider>
                    <TimeProvider>{children}</TimeProvider>
                </AuthProvider>
            </QueryProvider>
        </HeroUIProvider>
    );
}
