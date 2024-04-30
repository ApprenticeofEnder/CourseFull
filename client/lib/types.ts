import { ReactNode } from 'react';
import { Session } from '@supabase/supabase-js';

type ChildrenProps = {
    children: ReactNode;
};

type SessionProps = {
    session: Session;
};

export type { ChildrenProps, SessionProps };
