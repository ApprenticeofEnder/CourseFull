import { NextResponse } from 'next/server';
// The client you created from the Server-Side Auth instructions
import { createClient } from '@/lib/supabase/server';
import { Endpoints } from '@/types';
import { Provider } from '@supabase/supabase-js';
import { createUser, getUserData } from '@/services/user-service';
import { isAxiosError } from 'axios';

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get('code');
    // if "next" is in param, use it as the redirect URL
    const next = searchParams.get('next') ?? Endpoints.Dashboard.DASHBOARD;
    const subscribed =
        searchParams.get('subscribed-to-marketing') === 'true';

    if (!code) {
        console.warn('No auth code present.');
        return NextResponse.redirect(`${origin}/auth/auth-code-error`);
    }

    const supabase = await createClient();
    const {
        error: authCodeError,
        data: { session },
    } = await supabase.auth.exchangeCodeForSession(code);
    if (authCodeError || !session) {
        console.warn(authCodeError);
        return NextResponse.redirect(`${origin}/auth/auth-code-error`);
    }

    await supabase.auth.setSession(session);

    const provider: Provider = session.user.app_metadata.provider! as Provider;

    switch (provider) {
        case 'google':
            const [first_name, last_name] =
                session.user.user_metadata.full_name.split(' ');
            console.log(first_name, last_name);
            await supabase.auth.updateUser({
                data: {
                    first_name,
                    last_name,
                },
            });
            break;
    }

    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();
    if (error || !user) {
        console.warn(error);
        return NextResponse.redirect(`${origin}/error`);
    }

    try {
        // If the user doesn't exist in api_v1_users, this will throw an error
        await getUserData(session);
    } catch (error) {
        if (!isAxiosError(error)) {
            console.warn(error);
            return NextResponse.redirect(`${origin}/error`);
        }

        console.log('User not found in DB, creating.');

        await createUser({
            supabase_id: user.id,
            email: user.email!,
            first_name: user.user_metadata.first_name,
            last_name: user.user_metadata.last_name,
            subscribed,
        });
    }

    const forwardedHost = request.headers.get('x-forwarded-host'); // original origin before load balancer
    const isLocalEnv = process.env.NODE_ENV === 'development';
    if (isLocalEnv) {
        // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
        return NextResponse.redirect(`${origin}${next}`);
    } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
    } else {
        return NextResponse.redirect(`${origin}${next}`);
    }
}
