export enum Endpoints {
    LOGIN = '/auth/login',
    SIGN_UP = '/auth/signup',
    LOGOUT = '/auth/logout',
    EMAIL_VERIFY = '/auth/email-verify',
    ROOT = '/',
    DASHBOARD = '/dashboard',
    SEMESTER_DASHBOARD = '/dashboard/semesters',
    COURSE_DASHBOARD = '/dashboard/courses',
    API_PROGRESS = '/api/v1/users/me/progress',
    API_SEMESTERS = '/api/v1/semesters',
    API_COURSES = '/api/v1/courses',
    API_USER = '/api/v1/users',
}

export enum ItemStatus {
    NOT_STARTED = 'not_started',
    ACTIVE = 'active',
    COMPLETE = 'complete',
}
