'use client';
import Navbar from '@/components/Navbar';
import Spacer from '@/components/Spacer';
import { useSupabaseSession } from '@/supabase';
export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = useSupabaseSession();
    return (
        <main>
            <Navbar session={session} />
            <Spacer className="overflow-auto mt-20">{children}</Spacer>
        </main>
    );
}
