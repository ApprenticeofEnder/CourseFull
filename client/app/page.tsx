'use client';

import { motion, useMotionValue, type Variants } from 'motion/react';
import dynamic from 'next/dynamic';
import { Suspense, useEffect, useState } from 'react';

import Loading from '@app/loading';
import AnonHome from '@components/Home/AnonHome';
import { useSession } from '@lib/supabase/sessionContext';

const Home = dynamic(() => import('@components/Home/Home'));

export default function HomePage() {
    const [loading, setLoading] = useState(true);

    const { session, loadingSession } = useSession()!;

    const renderAnonHome = useMotionValue(true);
    const RenderedAnonHome = motion.create(AnonHome);

    useEffect(() => {
        setLoading(loadingSession);
        if (!session) {
            return;
        }
        renderAnonHome.set(false);
    }, [session, loadingSession]);

    return (
        <div className="flex flex-col justify-center w-full">
            <Suspense fallback={<Loading message="Good to see you!" />}>
                <RenderedAnonHome initial={{ opacity: 100 }}></RenderedAnonHome>
                {loading ? (
                    <Loading message="Good to see you!" />
                ) : session ? (
                    <Home session={session} />
                ) : (
                    <RenderedAnonHome />
                )}
            </Suspense>
        </div>
    );
}
