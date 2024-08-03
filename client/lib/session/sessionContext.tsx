'use client';

import { Session } from '@supabase/supabase-js';
import supabase from '@/supabase/client';
import {
    FC,
    ReactNode,
    Dispatch,
    useReducer,
    createContext,
    useContext,
    useMemo,
    useEffect,
    useState,
} from 'react';
import CartProvider from '../cart/cartContext';

export const SessionContext = createContext<{
    session: Session | null;
    loadingSession: boolean;
} | null>(null);

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

export default SessionProvider;
