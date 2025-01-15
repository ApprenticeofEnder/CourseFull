'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';

import Loading from '@app/loading';
import { Endpoints } from '@coursefull';
import { createClient } from '@lib/supabase/client';
import { useQuery } from '@tanstack/react-query';

function AuthCallback() {
    const supabase = createClient();
    const router = useRouter();
    const searchParams = useSearchParams();
    const code = searchParams.get('code');
    const next = searchParams.get('next') ?? Endpoints.DASHBOARD;
    const actionType = searchParams.get('actionType');
    console.debug(actionType);

    if (!code) {
        throw new Error(`Auth code not present.`);
    }

    const {data: session, isLoading, error: authCodeError} = useQuery({
        queryKey: ["auth-code"],
        queryFn: async () => {
            const { error, data: { session } } = await supabase.auth.exchangeCodeForSession(code);
            if(error){
                throw error;
            }
            return session;
        }
    });
    if(authCodeError){
        throw authCodeError;
    }

    if(session){
        router.push(next);
    }


    return <div></div>;
}

export default function Page() {
    return (
        <Suspense fallback={<Loading />}>
            <AuthCallback />
        </Suspense>
    );
}
