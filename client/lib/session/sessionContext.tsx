'use client';

import { Session } from '@supabase/supabase-js';
import supabase from '@/supabase/client';
import {
    FC,
    ReactNode,
    createContext,
    useContext,
    useEffect,
    useState,
} from 'react';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { Endpoints } from '@/lib/enums';

export const SessionContext = createContext<{
    session: Session | null;
    loadingSession: boolean;
}>({ session: null, loadingSession: true });

const SessionProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [loadingSession, setLoadingSession] = useState(true);
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setLoadingSession(false);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    return (
        <SessionContext.Provider value={{ session, loadingSession }}>
            {children}
        </SessionContext.Provider>
    );
};

export function useSession() {
    return useContext(SessionContext);
}

export function useProtectedEndpoint(
    session: Session | null,
    loadingSession: boolean,
    router: AppRouterInstance
) {
    useEffect(() => {
        if (!loadingSession && !session) {
            router.push(Endpoints.ROOT);
            return;
        }
    }, [session, loadingSession]);
}

export default SessionProvider;
