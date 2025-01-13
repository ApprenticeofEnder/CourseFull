'use client';

import { Session } from '@supabase/supabase-js';
import { AUTH_TOKEN_STORAGE_KEY, useSupabase } from '@lib/supabase/client';
import {
    FC,
    ReactNode,
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';
import { Endpoints } from '@coursefull';
import { useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export const SessionContext = createContext<{
    session: Session | null;
    loadingSession: boolean;
}>({ session: null, loadingSession: true });

const SessionProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const supabase = useSupabase();
    function loadSession(): Session | null {
        let authTokenData = window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
        if (authTokenData === null) {
            return null;
        }

        const session: Session = JSON.parse(authTokenData);
        return session;
    }

    // const [session, setSession] = useState<Session | null>(null);
    // const [loadingSession, setLoadingSession] = useState(true);

    useEffect(() => {
        console.info('Attempting to load session from local storage...');
        let authTokenData = window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
        if (authTokenData === null) {
            console.info('No local session found.');
            return;
        }
        console.info('Session found.');
        const session: Session = JSON.parse(authTokenData);
        supabase.auth.setSession(session);
    }, [supabase]);

    const queryClient = useQueryClient();
    const { data, isLoading, error } = useQuery({
        queryKey: ['session'],
        queryFn: async () => {
            const { data, error } = await supabase.auth.getSession();
            if (error) {
                throw error;
            }
            return data.session;
        },
    });
    if (error) {
        throw error;
    }

    const session = useMemo(() => {
        if (!data) {
            return null;
        }
        return data;
    }, [data]);

    useEffect(() => {
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((event, newSession) => {
            if (event === 'INITIAL_SESSION') {
                return;
            }
            const isSameUser = newSession?.user.email === session?.user.email;
            if (event === 'SIGNED_IN' && isSameUser) {
                return;
            }

            queryClient.invalidateQueries({ queryKey: ['session'] });
            if (event !== 'SIGNED_OUT') {
                return;
            }

            // In this case we're in the SIGNED_OUT event
            [window.localStorage, window.sessionStorage].forEach((storage) => {
                Object.entries(storage).forEach(([key]) => {
                    storage.removeItem(key);
                });
            });
        });

        return () => subscription.unsubscribe();
    }, [supabase, queryClient, session]);

    return (
        <SessionContext.Provider value={{ session, loadingSession: isLoading }}>
            {children}
        </SessionContext.Provider>
    );
};

export function useSession() {
    return useContext(SessionContext);
}

export function useProtectedEndpoint(
    session: Session | null,
    loadingSession: boolean
) {
    const router = useRouter();
    useEffect(() => {
        if (!loadingSession && !session) {
            router.push(Endpoints.ROOT);
            return;
        }
    }, [session, loadingSession, router]);
}

export default SessionProvider;
