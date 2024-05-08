'use client';

import ConfirmButton from '@/components/Button/ConfirmButton';
import { Endpoints } from '@/lib/helpers';
import { supabase, useSupabaseSession } from '@/supabase';
import { Fragment, useState } from 'react';
import { Input } from '@nextui-org/react';
import { useRouter } from 'next/navigation';

export default function Login() {
    const session = useSupabaseSession();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    async function supabaseLogin() {
        setLoading(true);
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) {
            alert(`Something went wrong: ${error.message}`);
            setLoading(false);
            return;
        }
        router.push(Endpoints.ROOT);
    }

    if (session) {
        router.push(Endpoints.ROOT);
    }

    return (
        <Fragment>
            <h1>Log In to CourseFull</h1>
            <Input
                type="email"
                label="Email"
                placeholder="Email"
                value={email}
                onValueChange={setEmail}
            />
            <Input
                type="password"
                label="Password"
                placeholder="Password"
                value={password}
                onValueChange={setPassword}
            />
            <ConfirmButton
                className="button-confirm w-1/2 m-auto my-2"
                onClick={supabaseLogin}
                isLoading={loading}
            >
                {loading ? 'Logging in...' : 'Log In'}
            </ConfirmButton>
        </Fragment>
    );
}
