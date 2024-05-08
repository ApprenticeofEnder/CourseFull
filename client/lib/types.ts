import { ReactNode } from 'react';
import { Session } from '@supabase/supabase-js';

type ChildrenProps = {
    children: ReactNode;
};

type SessionProps = {
    session: Session;
};

interface SemesterProgress {
    semester: string;
    semesterId: string;
    average: number;
    numCourses: number;
    goal: number;
}

export type { ChildrenProps, SessionProps, SemesterProgress };
