import { createBrowserClient } from '@supabase/ssr';

export const AUTH_TOKEN_STORAGE_KEY = 'sb-coursefull-auth-token';

export function createClient() {
    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            auth: {
                flowType: 'pkce',
                // storage: customStorageAdapter,
                storageKey: AUTH_TOKEN_STORAGE_KEY,
            },
        }
    );
}
