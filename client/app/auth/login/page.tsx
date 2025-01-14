'use client';

import { Fragment, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { Endpoints } from '@coursefull';
import { useSession } from '@lib/supabase/SessionContext';
import LoginForm from '@components/Form/LoginForm';
import { Divider } from '@nextui-org/react';

import GoogleIcon from '@mui/icons-material/Google';
import Button from '@components/Button/Button';
import { useSupabase } from '@lib/supabase';
import { Provider } from '@supabase/supabase-js';

export default function Login() {
    const router = useRouter();
    const { session, loadingSession } = useSession()!;
    const supabase = useSupabase();

    useEffect(() => {
        if (!loadingSession && session) {
            router.push(Endpoints.DASHBOARD);
            return;
        }
    }, [session, loadingSession, router]);

    async function oauthSignIn(provider: Provider){
        const redirectTo = `${process.env.NEXT_PUBLIC_APP_URL}${Endpoints.OAUTH_CALLBACK}`;
        await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo,
                queryParams: {
                    actionType: "login"
                }
            }
        })
    }

    // TODO: Add "Forgot Password" menu

    return (
        <Fragment>
            <h1 data-testid="login-header">Log In to CourseFull</h1>
            <div className="flex gap-4">
                <Button
                    startContent={<GoogleIcon className="icon"></GoogleIcon>}
                    onPressEnd={() => {oauthSignIn("google")}}
                    isDisabled
                >
                    Google
                </Button>
            </div>
            <Divider className="my-2"></Divider>
            <LoginForm />
        </Fragment>
    );
}
