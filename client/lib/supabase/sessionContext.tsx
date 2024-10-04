'use client';

import { Session } from '@supabase/supabase-js';
import supabase from '@lib/supabase/client';
import {
    FC,
    ReactNode,
    createContext,
    useContext,
    useEffect,
    useState,
} from 'react';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { Endpoints } from '@coursefull';

export const SessionContext = createContext<{
    session: Session | null;
    loadingSession: boolean;
}>({ session: null, loadingSession: true });

const SessionProvider: FC<{ children: ReactNode }> = ({ children }) => {
    function loadSession(): Session | null {
        let authTokenData = window.localStorage.getItem(
            'sb-coursefull-auth-token'
        );
        if (authTokenData === null) {
            return null;
        }

        const session: Session = JSON.parse(authTokenData);
        return session;
    }

    const [session, setSession] = useState<Session | null>(null);
    const [loadingSession, setLoadingSession] = useState(true);
    useEffect(() => {
        // supabase.auth.setSession()
        console.info('Attempting to load session from local storage...');
        const loadedSession = loadSession();
        if (loadedSession !== null) {
            const { access_token, refresh_token } = loadedSession;
            console.info('Session loaded from local storage.');
            supabase.auth.setSession({
                access_token,
                refresh_token,
            });
        } else {
            console.info('No local session found.');
        }

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
    }, [session, loadingSession, router]);
}

export default SessionProvider;
