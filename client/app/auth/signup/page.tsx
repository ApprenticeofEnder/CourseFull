'use client';

import { Fragment, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { Endpoints } from '@coursefull';
import { useSession } from '@lib/supabase/SessionContext';
import SignupForm from '@components/Form/SignupForm';

// TODO: Add Google Oauth
// TODO: Add Discord Oauth
// TODO: Add Microsoft Oauth
// TODO: Add Apple Oauth

export default function Signup() {
    const router = useRouter();
    const { session, loadingSession } = useSession();

    useEffect(() => {
        if (!loadingSession && session) {
            router.push(Endpoints.DASHBOARD);
            return;
        }
    }, [session, loadingSession, router]);

    return (
        <Fragment>
            <h1 data-testid="signup-header">Sign up for CourseFull</h1>
            <SignupForm/>
        </Fragment>
    );
}
