export enum Endpoints {
    LOGIN = '/auth/login',
    SIGN_UP = '/auth/signup',
    LOGOUT = '/auth/logout',
    EMAIL_VERIFY = '/auth/email-verify',
    ROOT = '/',
    DASHBOARD = '/dashboard',
    API_PROGRESS = '/api/v1/users/me/progress',
    API_SEMESTERS = '/api/v1/semesters',
    API_USER_CREATE = '/api/v1/users',
}

export enum SemesterStatus {
    NOT_STARTED = 'not_started',
    ACTIVE = 'active',
    COMPLETE = 'complete',
}
