'use client';
import Spacer from '@/components/Spacer';
import supabase, { useSupabaseSession } from '@/supabase';
import { Input } from '@nextui-org/react';

export default function Login() {
    const session = useSupabaseSession();
    return (
        <main>
            <Spacer>
                <Input type="email" label="Email" placeholder="Email" />
                <Input
                    type="password"
                    label="Password"
                    placeholder="Password"
                />
                {/* Email
                Password
                Maybe social auth (maybe)
                Submit Button */}
            </Spacer>
        </main>
    );
}
