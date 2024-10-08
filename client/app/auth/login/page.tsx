'use client';

import { Fragment, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@nextui-org/react';

import { Endpoints } from '@coursefull';
import { login } from '@services/userService';
import Button from '@components/Button/Button';
import { useSession } from '@lib/supabase/sessionContext';
import LinkButton from '@components/Button/LinkButton';

export default function Login() {
    const router = useRouter();
    const { session, loadingSession } = useSession()!;

    useEffect(() => {
        if (!loadingSession && session) {
            router.push(Endpoints.ROOT);
            return;
        }
    }, [session, loadingSession, router]);

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
            <h1 data-testid="login-header">Log In to CourseFull</h1>
            <Input
                type="email"
                label="Email"
                placeholder="Email"
                value={email}
                onValueChange={setEmail}
                data-testid="login-email"
            />
            <Input
                type="password"
                label="Password"
                placeholder="Password"
                value={password}
                onValueChange={setPassword}
                data-testid="login-password"
            />
            <div className="flex gap-4">
                <LinkButton
                    className="basis-1/2 top-1"
                    href={Endpoints.SIGN_UP}
                    data-testid="signup-nav-button"
                >
                    Go to Signup
                </LinkButton>
                <Button
                    className="basis-1/2 top-1"
                    onClick={handleLogin}
                    isLoading={loading}
                    buttonType="confirm"
                    data-testid="login-button"
                >
                    {loading ? 'Logging in...' : 'Log In'}
                </Button>
            </div>
        </Fragment>
    );
}
