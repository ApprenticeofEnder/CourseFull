'use client';

import { EnvelopeIcon } from '@heroicons/react/24/outline';
import { Divider } from '@heroui/react';
import { Google } from '@mui/icons-material';
import { Provider } from '@supabase/supabase-js';
import { Fragment, useCallback } from 'react';

import Button from '@/components/Button/Button';
import LinkButton from '@/components/Button/LinkButton';
import { createClient } from '@/lib/supabase/client';
import { Endpoints } from '@/types';

export default function EmailLoginPage() {
    const supabase = createClient();

    const oauth = useCallback(
        (provider: Provider) => {
            const redirectTo = `${process.env.NEXT_PUBLIC_APP_URL}${Endpoints.Auth.OAUTH_CALLBACK}`;
            supabase.auth.signInWithOAuth({
                provider,
                options: {
                    redirectTo,
                },
            });
        },
        [supabase]
    );

    return (
        <Fragment>
            <h2>Log In to CourseFull</h2>
            <Button
                startContent={<Google className="icon" />}
                onPress={() => oauth('google')}
            >
                Continue with Google
            </Button>
            <Divider />
            <LinkButton
                startContent={<EnvelopeIcon className="icon"></EnvelopeIcon>}
                href={Endpoints.Auth.EMAIL_LOGIN}
            >
                Continue with Email
            </LinkButton>
        </Fragment>
    );
}
