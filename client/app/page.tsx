'use client';

import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Spacer from '@/components/Spacer';
import AnonHomeStatus from '@/components/HomeStatus/AnonHomeStatus';
import HomeStatus from '@/components/HomeStatus/HomeStatus';

import { useSupabaseSession } from '@/supabase';
import { useState } from 'react';
import { Spinner } from '@nextui-org/react';

export default function Home() {
    const [loading, setLoading] = useState(true);

    const [statusScreen, setStatusScreen] = useState(<AnonHomeStatus />);

    const session = useSupabaseSession((session) => {
        if (session) {
            setStatusScreen(<HomeStatus session={session} />);
        }
        setLoading(false);
    });

    return (
        <main>
            <Navbar session={session} />
            <Spacer className="overflow-auto sm:mt-20">
                <div className="relative py-10 flex justify-center h-dvh">
                    <div className="flex flex-col justify-center w-full">
                        <h1>Hey, friend!</h1>
                        {loading ? (
                            <Spinner label="One sec..." />
                        ) : (
                            statusScreen
                        )}
                    </div>
                </div>
            </Spacer>
        </main>
    );
}
