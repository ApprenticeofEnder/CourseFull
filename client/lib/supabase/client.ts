import { createClient, SupportedStorage } from '@supabase/supabase-js';
import { useMemo } from 'react';

const customStorageAdapter: SupportedStorage = {
    getItem: (key: string) => {
        return globalThis.localStorage.getItem(key);
    },
    setItem: (key: string, value: string) => {
        globalThis.localStorage.setItem(key, value);
    },
    removeItem: (key: string) => {
        globalThis.localStorage.removeItem(key);
    },
};
export const AUTH_TOKEN_STORAGE_KEY = 'sb-coursefull-auth-token';

export function getSupabaseClient() {
    console.info("Supabase client created.");
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
        {
            auth: {
                flowType: 'pkce',
                // storage: customStorageAdapter,
                storageKey: AUTH_TOKEN_STORAGE_KEY,
            },
        }
    );

    return supabase;
}

export function useSupabase() {
    return useMemo(getSupabaseClient, []);
}
