'use client';

import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Spacer from '@/components/Spacer';
import AnonHomeStatus from '@/components/HomeStatus/AnonHomeStatus';
import HomeStatus from '@/components/HomeStatus/HomeStatus';

import { useSupabaseSession } from '@/supabase';

export default function Home() {
    const session = useSupabaseSession();

    let statusScreen = <AnonHomeStatus />;

    if (session) {
        statusScreen = <HomeStatus session={session} />;
    }

    return (
        <main>
            <Navbar session={session} />
            <Spacer>
                <div className="relative py-10 flex justify-center h-dvh">
                    <div className="flex flex-col justify-center max-w-full w-1/2">
                        <h1>Hey, friend!</h1>
                        {statusScreen}
                    </div>
                </div>
            </Spacer>
        </main>
    );
}
