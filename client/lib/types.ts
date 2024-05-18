import { ReactNode } from 'react';
import { Session } from '@supabase/supabase-js';
import { AxiosResponse } from 'axios';
import { ItemStatus } from './enums';

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
    id: string;
    name: string;
    api_v1_user_id: string;
    status: ItemStatus;
    goal: number;
    courses: Course[];
}

interface Course {
    id: string;
    title: string;
    course_code: string;
    api_v1_semester_id: string;
    api_v1_user_id: string;
    status: ItemStatus;
    goal: number;
    grade: number;
    deliverable_goal: number;
    deliverables: Deliverable[];
}

interface Deliverable {
    id: string;
    name: string;
    weight: number;
    mark: number;
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
