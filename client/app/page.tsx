'use client';

import { UserMetadata } from '@supabase/supabase-js';
import { Suspense, useEffect, useState } from 'react';

import Loading from '@app/loading';
import AnonHomeStatus from '@components/HomeStatus/AnonHomeStatus';
import HomeStatus from '@components/HomeStatus/HomeStatus';
import { useSession } from '@lib/supabase/sessionContext';

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
            <div className="relative py-10 flex justify-center mt-4 lg:mt-0 h-dvh">
                <div className="flex flex-col justify-center w-full">
                    <h1>Hey, {username}!</h1>
                    <Suspense fallback={<Loading message="Good to see you!" />}>
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
        </main>
    );
}
