import { AxiosResponse } from 'axios';
import { ServiceResponse } from './types';

/**
 * @param classes Tailwind CSS class strings as arguments
 * @returns A space separated list of classes,
 * or an empty string if no classes are available.
 */
export function classNames(...classes: string[]): string {
    return classes.filter(Boolean).join(' ');
}

export enum Endpoints {
    LOGIN = '/auth/login',
    SIGN_UP = '/auth/signup',
    LOGOUT = '/auth/logout',
    EMAIL_VERIFY = '/auth/email-verify',
    ROOT = '/',
    API_PROGRESS = '/api/v1/users/me/progress',
    API_SEMESTERS = '/api/v1/semesters',
    API_USER_CREATE = '/api/v1/users',
}

export enum SemesterStatus {
    NOT_STARTED = 'not_started',
    ACTIVE = 'active',
    COMPLETE = 'complete',
}

export function Readable<SemesterStatus>(status: SemesterStatus) {
    if (status === SemesterStatus.NOT_STARTED) return 'Not started';
    if (status === SemesterStatus.ACTIVE) return 'Active';
    if (status === SemesterStatus.COMPLETE) return 'Completed';
}

export async function errorHandler(
    apiCall: () => Promise<AxiosResponse | undefined>,
    onFailure: (error: unknown) => void
): Promise<ServiceResponse> {
    try {
        return { response: await apiCall(), success: true };
    } catch (error) {
        onFailure(error);
        return { success: false };
    }
}
