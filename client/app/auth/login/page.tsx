'use client';

import { Fragment, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@nextui-org/react';

import { Endpoints } from '@/lib/enums';
import { login } from '@/services/userService';
import Button from '@/components/Button/Button';
import { useSession } from '@/lib/session/sessionContext';

export default function Login() {
    const router = useRouter();
    const { session, loadingSession } = useSession()!;

    useEffect(() => {
        if (!loadingSession && session) {
            router.push(Endpoints.ROOT);
            return;
        }
    }, [session, loadingSession]);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

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
            <Button
                className="w-1/2 m-auto my-2"
                onClick={handleLogin}
                isLoading={loading}
                buttonType="confirm"
            >
                {loading ? 'Logging in...' : 'Log In'}
            </Button>
        </Fragment>
    );
}
