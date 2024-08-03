'use client';

import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Spacer from '@/components/Spacer';
import AnonHomeStatus from '@/components/HomeStatus/AnonHomeStatus';
import HomeStatus from '@/components/HomeStatus/HomeStatus';

import { Suspense, useEffect, useState } from 'react';
import { Spinner } from '@nextui-org/react';
import { useSession } from '@/lib/session/sessionContext';
import { UserMetadata } from '@supabase/supabase-js';
import Loading from '@/app/loading';

export default function Home() {
    const [loading, setLoading] = useState(true);

    const { session, loadingSession } = useSession()!;

    const [username, setUsername] = useState('friend');

    useEffect(() => {
        setLoading(loadingSession);
        if (!session) {
            return;
        }
        const metadata: UserMetadata = session.user.user_metadata;
        setUsername(metadata.first_name);
    }, [session, loadingSession]);

    return (
        <main>
            <Spacer className="overflow-auto">
                <div className="relative py-10 flex justify-center mt-4 lg:mt-0 h-dvh">
                    <div className="flex flex-col justify-center w-full">
                        <h1>Hey, {username}!</h1>
                        <Suspense
                            fallback={<Loading message="Good to see you!" />}
                        >
                            {loading ? (
                                <Loading message="Good to see you!" />
                            ) : session ? (
                                <HomeStatus session={session} />
                            ) : (
                                <AnonHomeStatus />
                            )}
                        </Suspense>
                    </div>
                </div>
            </Spacer>
        </main>
    );
}
