'use client';

import { Session, User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import {
    FC,
    ReactNode,
    createContext,
    useContext,
    useEffect,
    useState,
} from 'react';

export const AuthContext = createContext<{
    session: Session | null;
    user: User | null;
}>({ session: null, user: null });

const AuthProvider: FC<{ children: ReactNode }> = (props) => {
    const supabase = createClient();
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
        });

        const { data: authListener } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                setSession(session);
                setUser(session?.user ?? null);
            }
        );

        return () => {
            authListener.subscription.unsubscribe();
        };
    });

    const value = {
        session,
        user,
    };
    return <AuthContext.Provider value={value} {...props} />;
};

export function useSession() {
    return useContext(AuthContext);
}

export default AuthProvider;
