import { ZodIssue } from 'zod';
import { ItemStatus } from './enums.d';

export * from './cart.d';
export * from './data.d';
export * from './dto.d';
export * from './enums.d';
export * from './props.d';

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

export interface BasicUserData {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    subscribed: boolean;
}

export interface AuthHeaders {
    Authorization: string;
}

export interface DeliverableFormErrors {
    name: ZodIssue[],
    start_date: ZodIssue[],
    deadline: ZodIssue[],
    weight: ZodIssue[],
    mark: ZodIssue[],
    status: ZodIssue[],
    notes: ZodIssue[],
    custom: ZodIssue[]
}

export interface CourseFormErrors {
    title: ZodIssue[],
    course_code: ZodIssue[],
    status: ZodIssue[],
}