import { ZodIssue } from 'zod';
import { ItemStatus } from './enums.d';

export * from './cart.d';
export * from './data.d';
export * from './dto.d';
export * from './home-page.d';
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
    grade_colour?: GradeColours;
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

export interface GradeColours {
    bgColour: string;
    textColour: string;
}