'use client';
import Button from '@/components/Button/Button';
import LinkButton from '@/components/Button/LinkButton';
import { createClient } from '@/lib/supabase/client';
import { Endpoints } from '@/types';
import { EnvelopeIcon } from '@heroicons/react/24/outline';
import { Google } from '@mui/icons-material';
import { Divider } from '@nextui-org/react';
import { Provider } from '@supabase/supabase-js';
import { Fragment, useCallback } from 'react';

export default function EmailLoginPage() {
    const supabase = createClient();

    // import { Checkbox } from "@nextui-org/react";
    // import { useState } from "react";

    // interface EmailSubscriptionProps {
    //   onSubscriptionChange?: (isSubscribed: boolean) => void;
    // }

    // export const EmailSubscription: React.FC<EmailSubscriptionProps> = ({
    //   onSubscriptionChange
    // }) => {
    //   const [isSubscribed, setIsSubscribed] = useState(false);

    //   const handleSubscriptionChange = (checked: boolean) => {
    //     setIsSubscribed(checked);
    //     onSubscriptionChange?.(checked);
    //   };

    //   return (
    //     <Checkbox
    //       isSelected={isSubscribed}
    //       onValueChange={handleSubscriptionChange}
    //       color="primary"
    //       className="max-w-md"
    //     >
    //       Yes, I want to receive marketing emails about product updates and offers
    //     </Checkbox>
    //   );
    // };
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
