'use client';

import { UserMetadata } from '@supabase/supabase-js';
import { Suspense, useEffect, useState } from 'react';
import { ScrollShadow } from '@nextui-org/react';

import Loading from '@app/loading';
import AnonHome from '@components/Home/AnonHome';
import Home from '@components/Home/Home';
import { useSession } from '@lib/supabase/sessionContext';

export default function HomePage() {
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
        <div className="flex flex-col justify-center w-full">
            <Suspense fallback={<Loading message="Good to see you!" />}>
                {loading ? (
                    <Loading message="Good to see you!" />
                ) : session ? (
                    <Home session={session} />
                ) : (
                    <AnonHome />
                )}
            </Suspense>
        </div>
    );
}
