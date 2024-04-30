'use client';
import Spacer from '@/components/Spacer';
import useSupabaseSession from '@/supabase/useSupabaseSession';

export default function Login() {
    const session = useSupabaseSession();
    return (
        <main>
            <Spacer>Henlo</Spacer>
            {/* Email
            Password
            Maybe social auth (maybe)
            Submit Button */}
        </main>
    );
}
