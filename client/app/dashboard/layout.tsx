'use client';
import Navbar from '@/components/Navbar';
import Spacer from '@/components/Spacer';
import { Endpoints } from '@/lib/enums';
import { useSupabaseSession } from '@/supabase';
import { useRouter } from 'next/navigation';
export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = useSupabaseSession();
    return (
        <main>
            <Navbar session={session} />
            <Spacer>{children}</Spacer>
        </main>
    );
}
