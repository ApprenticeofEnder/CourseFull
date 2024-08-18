import { Endpoints, ItemStatus } from '@coursefull';
import { authenticatedApiErrorHandler } from '@lib/helpers';
import { Course } from '@coursefull';
import { Session } from '@supabase/supabase-js';
import axios, { AxiosError } from 'axios';

export async function createCourse(
    { title, course_code, status, api_v1_semester_id }: Course,
    session: Session | null,
    onFailure: (error: Error) => void
) {
    return authenticatedApiErrorHandler(
        async (session, headers) => {
            try {
                const response = await axios.post(
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
                    }
                );

                return response;
            } catch (error: any) {
                const { response }: AxiosError = error;
                throw new Error(
                    JSON.stringify({
                        status: response?.status,
                        data: response?.data,
                    })
                );
            }
        },
        session,
        onFailure
    );
}

export async function getCourses(
    session: Session | null,
    onFailure: (error: Error) => void
) {
    return authenticatedApiErrorHandler(
        async (session, headers) => {
            return axios.get(Endpoints.API_COURSES, {
                headers,
            });
        },
        session,
        onFailure
    );
}

export async function getCourse(
    id: string,
    session: Session | null,
    onFailure: (error: Error) => void
) {
    return authenticatedApiErrorHandler(
        async (session, headers) => {
            return axios.get(`${Endpoints.API_COURSES}/${id}`, {
                headers,
            });
        },
        session,
        onFailure
    );
}

export async function updateCourse(
    { id, title, course_code, status }: Partial<Course>,
    session: Session | null,
    onFailure: (error: Error) => void
) {
    return authenticatedApiErrorHandler(
        async (session, headers) => {
            const apiResponse = await axios.put(
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
                }
            );

            if (apiResponse.status !== 200) {
                throw apiResponse.data;
            }
            return apiResponse;
        },
        session,
        onFailure
    );
}

export async function deleteCourse(
    id: string,
    session: Session | null,
    onFailure: (error: Error) => void
) {
    return authenticatedApiErrorHandler(
        async (session, headers) => {
            const apiResponse = await axios.delete(
                `${Endpoints.API_COURSES}/${id}`,
                {
                    headers,
                }
            );

            if (apiResponse.status !== 204) {
                throw apiResponse.data;
            }
            return apiResponse;
        },
        session,
        onFailure
    );
}
