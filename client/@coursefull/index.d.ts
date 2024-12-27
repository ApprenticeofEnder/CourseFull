import { AxiosResponse } from 'axios';

import { ItemStatus } from './enums.d';

export * from './cart.d';
export * from './enums.d';
export * from './data.d';
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

export interface APIServiceResponse {
    response?: AxiosResponse;
    success: boolean;
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

export type APIOnFailure = (
    error: AxiosError | Error,
    cameFromAxios: boolean
) => void;
