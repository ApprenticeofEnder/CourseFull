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
    API_USER_CREATE = '/api/v1/users',
}
