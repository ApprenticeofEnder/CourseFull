import {
    APIOnFailure,
    APIServiceResponse,
    Course,
    Endpoints,
} from '@coursefull';
import { authenticatedApiErrorHandler } from '@lib/helpers';
import { Session } from '@supabase/supabase-js';
import axios from 'axios';
import { api } from '@services';

export async function createCourse(
    { title, course_code, status, api_v1_semester_id }: Course,
    session: Session | null,
    onFailure: APIOnFailure
): Promise<APIServiceResponse> {
    return authenticatedApiErrorHandler(
        async (session, headers) => {
            const response = await api.post(
                Endpoints.API_COURSES,
                {
                    api_v1_course: {
                        title,
                        course_code,
                        status,
                        api_v1_semester_id,
                    },
                },
                {
                    headers,
                    validateStatus: (status) => {
                        return status === 201;
                    },
                }
            );

            return response;
        },
        session,
        onFailure
    );
}

export async function getCourses(
    session: Session | null,
    onFailure: APIOnFailure
): Promise<APIServiceResponse> {
    return authenticatedApiErrorHandler(
        async (session, headers) => {
            return api.get(Endpoints.API_COURSES, {
                headers,
                validateStatus: (status) => {
                    return status === 200;
                },
            });
        },
        session,
        onFailure
    );
}

export async function getCourse(
    id: string,
    session: Session | null,
    onFailure: APIOnFailure
): Promise<APIServiceResponse> {
    return authenticatedApiErrorHandler(
        async (session, headers) => {
            return api.get(`${Endpoints.API_COURSES}/${id}`, {
                headers,
                validateStatus: (status) => {
                    return status === 200;
                },
            });
        },
        session,
        onFailure
    );
}

export async function updateCourse(
    { id, title, course_code, status }: Partial<Course>,
    session: Session | null,
    onFailure: APIOnFailure
): Promise<APIServiceResponse> {
    return authenticatedApiErrorHandler(
        async (session, headers) => {
            const apiResponse = await api.put(
                `${Endpoints.API_COURSES}/${id}`,
                {
                    api_v1_course: {
                        title,
                        course_code,
                        status,
                    },
                },
                {
                    headers,
                    validateStatus: (status) => {
                        return status === 200;
                    },
                }
            );
            return apiResponse;
        },
        session,
        onFailure
    );
}

export async function deleteCourse(
    id: string,
    session: Session | null,
    onFailure: APIOnFailure
): Promise<APIServiceResponse> {
    return authenticatedApiErrorHandler(
        async (session, headers) => {
            const apiResponse = await api.delete(
                `${Endpoints.API_COURSES}/${id}`,
                {
                    headers,
                    validateStatus: (status) => {
                        return status === 204;
                    },
                }
            );
            return apiResponse;
        },
        session,
        onFailure
    );
}
