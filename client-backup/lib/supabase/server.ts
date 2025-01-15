import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

import { AUTH_TOKEN_STORAGE_KEY } from '@lib/supabase/client';

export async function createClient() {
    const cookieStore = cookies();

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            auth: {
                storageKey: AUTH_TOKEN_STORAGE_KEY,
            },
            cookieOptions: {
                httpOnly: true,
                sameSite: true,
            },
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        );
                    } catch {
                        // The `setAll` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing
                        // user sessions.
                    }
                },
            },
        }
    );
}
