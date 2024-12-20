import { ItemStatus } from '@coursefull/enums.d';
import { Session } from '@supabase/supabase-js';
import { AxiosResponse } from 'axios';
import { ReactNode } from 'react';

export interface ChildrenProps {
    children: ReactNode;
}

export interface ModalProps {
    open: boolean;
}

export interface SessionProps {
    session: Session;
}

export interface UserDataProps {
    userData: User | null;
}

export interface SpacerProps extends ChildrenProps {
    className?: string;
}

export interface LoadingProps {
    message?: string;
}

export interface EditableProps {
    handleEdit: () => void;
}

export interface DeletableProps {
    handleDelete: () => void;
}

export interface SemesterProgressType {
    semester: string;
    semester_id: string;
    average: number;
    num_courses: number;
    num_graded_courses: number;
    goal: number;
    status: ItemStatus;
    grade_colour?: string;
}

export interface SemesterFormProps {
    name: string;
    setName: (name: string) => void;
    status: ItemStatus;
    setStatus: (name: ItemStatus) => void;
    goal: string;
    setGoal: (name: string) => void;
}

export interface CourseMultiCreateProps {
    courses: Partial<Course[]>;
    setCourses: (courses: Partial<Course[]>) => void;
    coursesRemaining: number;
    setCoursesRemaining: (coursesRemaining: number) => void;
    userData: User;
    loadingUserData: boolean;
}

export interface BaseAcademicItem {
    id?: string;
    api_v1_user_id?: string;
    status: ItemStatus;
}

export interface Semester extends BaseAcademicItem {
    name: string;
    goal: number;
    courses?: Course[];
}

export interface Course extends BaseAcademicItem {
    title: string;
    course_code: string;
    api_v1_semester_id?: string;
    goal?: number;
    grade?: number;
    deliverable_goal?: number;
    deliverables?: Deliverable[];
}

export interface Deliverable extends BaseAcademicItem {
    name: string;
    weight: number;
    mark: number;
    notes: string;
    api_v1_course_id?: string;
    goal?: number;
}

export interface APIServiceResponse {
    response?: AxiosResponse;
    success: boolean;
}

export interface User {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    supabase_id: string;
    courses_remaining: number;
    subscribed: boolean;
}

export interface BasicUserData {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    subscribed: boolean;
}

export interface Product {
    name: string;
    description: string;
    stripe_id: string;
    stripe_price: string;
    price: number;
}

export interface AuthHeaders {
    Authorization: string;
}

export type APIOnFailure = (
    error: AxiosError | Error,
    cameFromAxios: boolean
) => void;

export * from './cart.d';
export * from './enums.d';
