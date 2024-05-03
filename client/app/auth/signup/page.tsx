'use client';

import { Fragment, useState } from 'react';
import { Input } from '@nextui-org/react';
import { useRouter } from 'next/navigation';

import ConfirmButton from '@/components/Button/ConfirmButton';
import { Endpoints } from '@/lib/helpers';
import supabase, { useSupabaseSession } from '@/supabase';

export default function Signup() {
    const session = useSupabaseSession();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    async function supabaseSignUp() {
        setLoading(true);
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });
        setLoading(false);
        if (error) {
            alert(`Something went wrong: ${error.message}`);
            return;
        }
        router.push(Endpoints.ROOT);
    }

    if (session) {
        router.push(Endpoints.ROOT);
    }

    return (
        <Fragment>
            <h1>Sign up for CourseFull</h1>
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
                className="w-1/2 m-auto my-2"
                onPressEnd={supabaseSignUp}
                isLoading={loading}
            >
                {loading ? 'Signing up...' : 'Sign Up'}
            </ConfirmButton>
        </Fragment>
    );
}
