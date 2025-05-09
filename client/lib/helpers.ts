import { AxiosError, AxiosResponse, isAxiosError } from 'axios';
import {
    ItemStatus,
    Endpoints,
    AuthHeaders,
} from '@coursefull';
import { Session } from '@supabase/supabase-js';
import { Key } from 'react';

/**
 * @param classes Tailwind CSS class strings as arguments
 * @returns A space separated list of classes,
 * or an empty string if no classes are available.
 */
export function classNames(...classes: string[]): string {
    return classes.filter(Boolean).join(' ');
}

export function ReadableStatus(status: ItemStatus) {
    switch (status) {
        case ItemStatus.NOT_STARTED:
            return 'Not started';
        case ItemStatus.ACTIVE:
            return 'Active';
        case ItemStatus.COMPLETE:
            return 'Completed';
        case ItemStatus.OVERDUE:
            return 'Overdue';
    }
}

export function createStatusObjects(statuses: ItemStatus[]) {
    return statuses.map((status) => ({
        key: status,
        label: ReadableStatus(status),
    }));
}

/**
 * Use alongside NextUI's Listbox component.
 *
 * @param newStatus a Key that maps to an ItemStatus enum
 * @param setStatus a function that has a similar interface to the function component of useState
 */
export function onStatusChanged(
    newStatus: Key,
    setStatus: (status: ItemStatus) => void
) {
    switch (newStatus) {
        case ItemStatus.NOT_STARTED:
            setStatus(ItemStatus.NOT_STARTED);
            break;
        case ItemStatus.ACTIVE:
            setStatus(ItemStatus.ACTIVE);
            break;
        case ItemStatus.COMPLETE:
            setStatus(ItemStatus.COMPLETE);
            break;
        default:
            break;
    }
}

export function determineGradeTextColour(goal: number, grade: number) {
    if (grade >= goal) {
        return 'text-success-800';
    } else if (goal - grade <= 5) {
        return 'text-warning-800';
    } else {
        return 'text-danger-800';
    }
}

export function determineGradeBGColour(goal: number, grade: number) {
    if (grade >= goal) {
        return 'bg-success-200';
    } else if (goal - grade <= 5) {
        return 'bg-warning-200';
    } else {
        return 'bg-danger-200';
    }
}

export function ensureError(value: unknown): AxiosError | Error {
    if (value instanceof Error) return value;

    let stringified = '[Unable to stringify the thrown value]';
    try {
        stringified = JSON.stringify(value);
    } catch {}

    const error = new Error(
        `This value was thrown as is, not through an Error: ${stringified}`
    );
    return error;
}

export async function authenticatedApiHandler<T>(
    apiCall: (
        session: Session,
        headers: Partial<AuthHeaders>
    ) => Promise<AxiosResponse<T, any>>,
    session: Session | null
): Promise<AxiosResponse<T, any>> {
    try {
        if (!session) {
            throw new Error('Invalid session.');
        }
        const headers: Partial<AuthHeaders> = {
            Authorization: `Bearer ${session.access_token}`,
        };
        const apiResponse = await apiCall(session, headers);
        return apiResponse;
    } catch (err: unknown) {
        const error = ensureError(err);
        return Promise.reject(error);
    }
}

export async function apiHandler<T>(
    apiCall: () => Promise<AxiosResponse<T, any>>
): Promise<AxiosResponse<T, any>> {
    try {
        const apiResponse = await apiCall();
        return apiResponse;
    } catch (err: unknown) {
        const error = ensureError(err);
        return Promise.reject(error);
    }
}

export function semesterURL(semesterId: string | undefined): string {
    try {
        let result = `${Endpoints.SEMESTER_DASHBOARD}?id=${semesterId}`;
        if (!semesterId) {
            throw new Error(`Invalid Semester ID: ${semesterId}`);
        }
        return result;
    } catch (err) {
        const error = ensureError(err);
        console.error(error);
        return '#';
    }
}

export function courseURL(courseId: string | undefined) {
    try {
        let result = `${Endpoints.COURSE_DASHBOARD}?id=${courseId}`;
        if (!courseId) {
            throw new Error(`Invalid Course ID: ${courseId}`);
        }
        return result;
    } catch (err) {
        const error = ensureError(err);
        console.error(error);
        return '#';
    }
}

export const validateEmail = (email: string) =>
    email.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i);

export const validatePassword = (password: string) => {
    return password.match(/^.*(?=.{10,})(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/i);
};

export const validateName = (name: string) => {
    return name.match(/^.{2,150}$/i);
};

export const priceFormatter = new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
});

export async function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
