import { Endpoints, ItemStatus } from '@/lib/enums';
import { authenticatedApiErrorHandler } from '@/lib/helpers';
import { Course } from '@/lib/types';
import { Session } from '@supabase/supabase-js';
import axios, { AxiosError } from 'axios';

export async function createCourse(
    { title, course_code, status, api_v1_semester_id }: Course,
    session: Session | null,
    onFailure: (error: Error) => void
) {
    return authenticatedApiErrorHandler(
        async (session) => {
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
                        headers: {
                            Authorization: `Bearer ${session.access_token}`,
                        },
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
        async (session) => {
            return axios.get(Endpoints.API_COURSES, {
                headers: {
                    Authorization: `Bearer ${session.access_token}`,
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
    onFailure: (error: Error) => void
) {
    return authenticatedApiErrorHandler(
        async (session) => {
            return axios.get(`${Endpoints.API_COURSES}/${id}`, {
                headers: {
                    Authorization: `Bearer ${session.access_token}`,
                },
            });
        },
        session,
        onFailure
    );
}
