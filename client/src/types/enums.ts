export enum AuthEndpoints {
    LOGIN = '/auth/login',
    EMAIL_LOGIN = '/auth/login/email',
    SIGN_UP = '/auth/signup',
    EMAIL_SIGNUP = '/auth/signup/email',
    LOGOUT = '/auth/logout',
    EMAIL_VERIFY = '/auth/email-verify',
    OAUTH_CALLBACK = '/auth/callback',
}

export enum DashboardEndpoints {
    DASHBOARD = '/dashboard',
    SEMESTER_DASHBOARD = '/dashboard/semesters',
    COURSE_DASHBOARD = '/dashboard/courses',
}

export enum LegalEndpoints {
    TERMS_OF_SERVICE = '/legal/terms-of-service',
    PRIVACY_POLICY = '/legal/privacy-policy',
}

export enum ApiEndpoints {
    API_PROGRESS = '/api/v1/users/me/progress',
    API_SEMESTERS = '/api/v1/semesters',
    API_COURSES = '/api/v1/courses',
    API_USER = '/api/v1/users',
    API_DELIVERABLES = '/api/v1/deliverables',
    API_PRODUCTS = '/api/v1/products',
    API_PAYMENTS = '/api/v1/payments',
}

export enum PageEndpoints {
    PRODUCTS = '/products',
    CHECKOUT = '/payments/checkout',
    SETTINGS = '/settings',
    CONTACT = '/contact',
    HOME = '/',
}

export enum ItemStatus {
    NOT_STARTED = 'not_started',
    ACTIVE = 'active',
    COMPLETE = 'complete',
    URGENT = 'urgent',
    OVERDUE = 'overdue',
}