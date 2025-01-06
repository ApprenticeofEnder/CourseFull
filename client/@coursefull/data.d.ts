import { ItemStatus } from '@coursefull/enums.d';
import { DateValue, ZonedDateTime } from '@internationalized/date';

export interface BaseAcademicItem {
    id?: string;
    api_v1_user_id?: string;
    status: ItemStatus;
}

export interface Semester extends BaseAcademicItem {
    name: string;
    goal: number;
    courses: Course[];
}

export interface Course extends BaseAcademicItem {
    title: string;
    course_code: string;
    api_v1_semester_id?: string;
    goal?: number;
    grade?: number;
    deliverable_goal?: number;
    deliverables: Deliverable[];
}

export interface Deliverable extends BaseAcademicItem {
    name: string;
    weight: number;
    mark: number;
    notes: string;
    start_date: ZonedDateTime;
    deadline: ZonedDateTime;
    api_v1_course_id?: string;
    goal?: number;
}

export type Updated<T extends BaseAcademicItem> = T & {
    id: string;
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

export interface Product {
    name: string;
    description: string;
    stripe_id: string;
    stripe_price: string;
    price: number;
}