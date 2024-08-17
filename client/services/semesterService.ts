'use client';
import axios, { AxiosResponse } from 'axios';
import { Endpoints, ItemStatus } from '@coursefull';
import { authenticatedApiErrorHandler, semesterURL } from '@lib/helpers';
import { Session } from '@supabase/supabase-js';
import { Semester } from '@coursefull';

export async function createSemester(
    { name, status, goal }: Semester,
    session: Session | null,
    onFailure: (error: Error) => void
) {
    return authenticatedApiErrorHandler(
        async (session, headers) => {
            const apiResponse = await axios.post(
                Endpoints.API_SEMESTERS,
                {
                    api_v1_semester: {
                        name,
                        status,
                        goal,
                    },
                },
                {
                    headers,
                }
            );
            if (apiResponse.status !== 201) {
                throw apiResponse.data;
            }
            return apiResponse;
        },
        session,
        onFailure
    );
}

export async function getSemesters(
    session: Session | null,
    onFailure: (error: Error) => void
) {
    return authenticatedApiErrorHandler(
        async (session, headers) => {
            return axios.get(Endpoints.API_SEMESTERS, {
                headers,
            });
        },
        session,
        onFailure
    );
}

export async function getSemester(
    id: string,
    session: Session | null,
    onFailure: (error: Error) => void
) {
    return authenticatedApiErrorHandler(
        async (session, headers) => {
            return axios.get(`${Endpoints.API_SEMESTERS}/${id}`, {
                headers,
            });
        },
        session,
        onFailure
    );
}

export async function updateSemester(
    { id, name, status, goal }: Semester,
    session: Session | null,
    onFailure: (error: Error) => void
) {
    return authenticatedApiErrorHandler(
        async (session, headers) => {
            const apiResponse = await axios.put(
                `${Endpoints.API_SEMESTERS}/${id}`,
                {
                    api_v1_semester: {
                        name,
                        status,
                        goal,
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

export async function deleteSemester(
    id: string,
    session: Session | null,
    onFailure: (error: Error) => void
) {
    return authenticatedApiErrorHandler(
        async (session, headers) => {
            const apiResponse = await axios.delete(
                `${Endpoints.API_SEMESTERS}/${id}`,
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
