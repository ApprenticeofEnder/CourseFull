import { useState, useEffect } from 'react';
import type { Session } from '@supabase/supabase-js';
import supabase from '@/supabase';

export default function useSupabaseSession(): Session | null {
    const [session, setSession] = useState<Session | null>(null);
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);
    return session;
}
