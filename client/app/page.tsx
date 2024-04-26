import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Spacer from '@/components/Spacer';
import { createClient } from '@/supabase/client';
import AnonHomeStatus from '@/components/HomeStatus/AnonHomeStatus';
import HomeStatus from '@/components/HomeStatus/HomeStatus';
export default async function Home() {
    const supabase = createClient();
    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();
    return (
        <main>
            <Navbar />
            <Spacer>
                <div className="relative py-10 flex justify-center h-dvh">
                    <div className="flex flex-col justify-center max-w-full">
                        <h1 className="text-6xl text-center">Hey, friend!</h1>
                        {user ? <HomeStatus user={user} /> : <AnonHomeStatus />}
                    </div>
                </div>
            </Spacer>
        </main>
    );
}
