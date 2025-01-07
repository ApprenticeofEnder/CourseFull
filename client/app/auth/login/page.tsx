'use client';

import { Fragment, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { Endpoints } from '@coursefull';
import { useSession } from '@lib/supabase/SessionContext';
import LoginForm from '@components/Form/LoginForm';
import { Metadata } from 'next';

export default function Login() {
    const router = useRouter();
    const { session, loadingSession } = useSession()!;

    useEffect(() => {
        if (!loadingSession && session) {
            router.push(Endpoints.DASHBOARD);
            return;
        }
    }, [session, loadingSession, router]);

    return (
        <Fragment>
            <h1 data-testid="login-header">Log In to CourseFull</h1>
            <LoginForm/>
        </Fragment>
    );
}
