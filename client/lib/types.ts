import { ReactNode } from 'react';
import { Session } from '@supabase/supabase-js';
import { AxiosResponse } from 'axios';

type ChildrenProps = {
    children: ReactNode;
};

type ModalProps = {
    open: boolean;
};

interface SessionProps {
    session: Session;
}

interface SemesterProgressType {
    semester: string;
    semesterId: string;
    average: number;
    numCourses: number;
    goal: number;
}

interface Semester {
    name: string;
    id: string;
    status: string;
    goal: number;
}

interface APIServiceResponse {
    response?: AxiosResponse;
    success: boolean;
}

export type {
    ChildrenProps,
    SessionProps,
    SemesterProgressType,
    Semester,
    ModalProps,
    APIServiceResponse,
};
