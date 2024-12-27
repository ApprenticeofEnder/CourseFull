'use client';

import { Input } from '@nextui-org/react';
import { Fragment, useState } from 'react';
import { z } from 'zod';

import { Endpoints } from '@coursefull';
import { login } from '@services/userService';
import Button from '@components/Button/Button';
import LinkButton from '@components/Button/LinkButton';
import { useRouter } from 'next/navigation';

interface LoginFormData {
    email: string;
    password: string;
}

const LoginFormSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

export default function LoginForm() {
    const router = useRouter();
    const [error, setError] = useState<any>(null);

    const [loginFormState, setLoginFormState] = useState<LoginFormData>({
        email: '',
        password: '',
    });

    function updatePassword(password: string) {
        setLoginFormState((currentState) => ({
            ...currentState,
            password,
        }));
    }

    function updateEmail(email: string) {
        setLoginFormState((currentState) => ({
            ...currentState,
            email,
        }));
    }
    const [loading, setLoading] = useState(false);

    async function handleLogin() {
        setLoading(true);
        try {
            const { email, password } = LoginFormSchema.parse(loginFormState);
            await login(email, password);
            router.push(Endpoints.ROOT);
        } catch (err) {
            setError(err);
        }
    }

    if (error) {
        throw error;
    }

    return (
        <Fragment>
            <Input
                type="email"
                label="Email"
                placeholder="Email"
                value={loginFormState.email}
                onValueChange={updateEmail}
                data-testid="login-email"
            />
            <Input
                type="password"
                label="Password"
                placeholder="Password"
                value={loginFormState.password}
                onValueChange={updatePassword}
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
