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

export interface SessionProps {
    session: Session;
}

export interface SemesterProgressType {
    semester: string;
    semesterId: string;
    average: number;
    num_courses: number;
    goal: number;
}

export interface Semester {
    id: string;
    name: string;
    api_v1_user_id: string;
    status: ItemStatus;
    goal: number;
    courses: Course[];
}

export interface Course {
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

export interface Deliverable {
    id: string;
    name: string;
    weight: number;
    mark: number;
}

export interface APIServiceResponse {
    response?: AxiosResponse;
    success: boolean;
}

export type { ChildrenProps, ModalProps };
