'use client';

import { Fragment, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@nextui-org/react';

import ConfirmButton from '@/components/Button/ConfirmButton';
import { Endpoints } from '@/lib/enums';
import { login } from '@/services/userService';
import { SessionProps } from '@/lib/types';
import { useSupabaseSession } from '@/supabase';

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    useSupabaseSession((session) => {
        if (session) {
            router.push(Endpoints.ROOT);
        }
    });

    async function handleLogin() {
        setLoading(true);

        const { success } = await login(email, password, (error) => {
            alert(`Something went wrong: ${error}`);
            setLoading(false);
        });
        if (success) {
            router.push(Endpoints.ROOT);
        }
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
                onClick={handleLogin}
                isLoading={loading}
            >
                {loading ? 'Logging in...' : 'Log In'}
            </ConfirmButton>
        </Fragment>
    );
}
