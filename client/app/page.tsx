'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import Home from '@components/Home/Home';
import { useSession } from '@lib/supabase/sessionContext';
import { Endpoints } from '@coursefull';

export default function HomePage() {
    const router = useRouter();
    const { session, loadingSession } = useSession()!;

    useEffect(() => {
        if (!session) {
            return;
        }
        router.push(Endpoints.DASHBOARD)
    }, [session, loadingSession]);

    return (
        <div className="flex flex-col justify-center w-full">
            <Home />
        </div>
    );
}
