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
    console.log(user);
    return (
        <main>
            <Navbar />
            <Spacer>
                <div>
                    <h1>Hey, friend!</h1>
                    {user ? <HomeStatus user={user} /> : <AnonHomeStatus />}
                </div>
            </Spacer>
        </main>
    );
}
