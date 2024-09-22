import { createClient } from '@supabase/supabase-js';

const AUTH_TOKEN_STORAGE_KEY = 'sb-coursefull-auth-token';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    {
        auth: {
            storageKey: AUTH_TOKEN_STORAGE_KEY,
        },
    }
);

export default supabase;
export { AUTH_TOKEN_STORAGE_KEY };
