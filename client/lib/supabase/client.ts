import { createClient } from '@supabase/supabase-js';
import { useMemo } from 'react';

export const AUTH_TOKEN_STORAGE_KEY = 'sb-coursefull-auth-token';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    {
        auth: {
            flowType: 'pkce',
            storageKey: AUTH_TOKEN_STORAGE_KEY,
        },
    }
);

export function getSupabaseClient(){
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
        {
            auth: {
                flowType: 'pkce',
                storageKey: AUTH_TOKEN_STORAGE_KEY,
            },
        }
    );

    return supabase;
}

export function useSupabase(){
    return useMemo(getSupabaseClient, []);
}

export default supabase;
