import { useState, useEffect } from 'react';
import type { Session } from '@supabase/supabase-js';
import supabase from '@/supabase/client';

export default function useSupabaseSession(
    onComplete: (session: Session | null) => void = (session) => {}
): Session | null {
    const [session, setSession] = useState<Session | null>(null);
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            onComplete(session);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            onComplete(session);
        });

        return () => subscription.unsubscribe();
    }, []);
    return session;
}
