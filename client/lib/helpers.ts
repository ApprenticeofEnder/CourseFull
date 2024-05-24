import { AxiosResponse } from 'axios';

import { APIServiceResponse } from '@/lib/types';
import { ItemStatus, Endpoints } from '@/lib/enums';
import { Session } from '@supabase/supabase-js';

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
    }
}

export function determineGradeColour(goal: number, grade: number) {
    if (grade > goal) {
        return 'text-success-500';
    } else if (grade == goal) {
        return 'text-warning-500';
    } else {
        return 'text-danger-400';
    }
}

function ensureError(value: unknown): Error {
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

export async function authenticatedApiErrorHandler(
    apiCall: (session: Session) => Promise<AxiosResponse | undefined>,
    session: Session | null,
    onFailure: (error: Error) => void
): Promise<APIServiceResponse> {
    try {
        if (!session) {
            throw new Error('Invalid session.');
        }
        const apiResponse = await apiCall(session);
        return { response: apiResponse, success: true };
    } catch (err: unknown) {
        const error = ensureError(err);
        console.error(error);
        onFailure(error);
        return { success: false };
    }
}

export async function apiErrorHandler(
    apiCall: () => Promise<AxiosResponse | undefined>,
    onFailure: (error: Error) => void
): Promise<APIServiceResponse> {
    try {
        const apiResponse = await apiCall();
        return { response: apiResponse, success: true };
    } catch (err: unknown) {
        const error = ensureError(err);
        console.error(error);
        onFailure(error);
        return { success: false };
    }
}

export function semesterURL(semesterId: string | undefined): string {
    try {
        let result = `${Endpoints.SEMESTER_DASHBOARD}/${semesterId}`;
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

export function courseURL(courseId: string) {
    try {
        let result = `${Endpoints.COURSE_DASHBOARD}/${courseId}`;
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
