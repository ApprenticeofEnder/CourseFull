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
    semester_id: string;
    average: number;
    num_courses: number;
    goal: number;
    grade_colour?: string;
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
    api_v1_semester_id: string;
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
}

export interface Product {
    name: string;
    description: string;
    stripe_id: string;
    stripe_price: string;
    price: number;
}

export interface CartItem {
    stripe_id: string;
    stripe_price: string;
    quantity: number;
}

export interface Cart {
    products: CartItem[];
}

export type { ChildrenProps, ModalProps };
