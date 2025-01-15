'use client';
import Button from '@/components/Button/Button';
import LinkButton from '@/components/Button/LinkButton';
import { createClient } from '@/lib/supabase/client';
import { Endpoints } from '@/types';
import { EnvelopeIcon } from '@heroicons/react/24/outline';
import { Google } from '@mui/icons-material';
import { Checkbox, Divider } from '@nextui-org/react';
import { Provider } from '@supabase/supabase-js';
import { useCallback, useState } from 'react';

export default function SignupPage() {
    // TODO: Add Notion Oauth (Priority 1)
    // TODO: Add Microsoft Oauth (Priority 2)
    // TODO: Add Discord Oauth (Priority 3)
    const supabase = createClient();
    const [isSubscribed, setIsSubscribed] = useState(false);
    const oauth = useCallback(
        (provider: Provider) => {
            const redirectTo = `${process.env.NEXT_PUBLIC_APP_URL}${Endpoints.Auth.OAUTH_CALLBACK}`;
            supabase.auth.signInWithOAuth({
                provider,
                options: {
                    redirectTo: `${redirectTo}?subscribed-to-marketing=${isSubscribed}`,
                },
            });
        },
        [supabase, isSubscribed]
    );

    return (
        <>
            <h2>Sign Up for CourseFull</h2>
            <Checkbox
                isSelected={isSubscribed}
                onValueChange={setIsSubscribed}
                data-testid="signup-subscribe"
                classNames={{
                    wrapper:
                        'border-2 border-primary rounded-full group-data-[selected=true]:border-transparent',
                }}
            >
                I want to get emails from CourseFull, including resources for
                academic success, product updates, and promotional offers.
            </Checkbox>
            <Button
                startContent={<Google className="icon" />}
                onPress={() => oauth('google')}
            >
                Continue with Google
            </Button>
            <Divider />
            <LinkButton
                startContent={<EnvelopeIcon className="icon"></EnvelopeIcon>}
                href={`${Endpoints.Auth.EMAIL_SIGNUP}?subscribed=${isSubscribed}`}
            >
                Continue with Email
            </LinkButton>
        </>
    );
}
