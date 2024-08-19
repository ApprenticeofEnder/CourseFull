'use client';
import axios, { AxiosResponse } from 'axios';
import { APIOnFailure, Endpoints, ItemStatus } from '@coursefull';
import { authenticatedApiErrorHandler, semesterURL } from '@lib/helpers';
import { Session } from '@supabase/supabase-js';
import { Semester } from '@coursefull';

export async function createSemester(
    { name, status, goal }: Semester,
    session: Session | null,
    onFailure: APIOnFailure
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
                    validateStatus: (status) => {
                        return status === 201;
                    },
                }
            );
            return apiResponse;
        },
        session,
        onFailure
    );
}

export async function getSemesters(
    session: Session | null,
    onFailure: APIOnFailure
) {
    return authenticatedApiErrorHandler(
        async (session, headers) => {
            return axios.get(Endpoints.API_SEMESTERS, {
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

export async function getSemester(
    id: string,
    session: Session | null,
    onFailure: APIOnFailure
) {
    return authenticatedApiErrorHandler(
        async (session, headers) => {
            return axios.get(`${Endpoints.API_SEMESTERS}/${id}`, {
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

export async function updateSemester(
    { id, name, status, goal }: Semester,
    session: Session | null,
    onFailure: APIOnFailure
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

export async function deleteSemester(
    id: string,
    session: Session | null,
    onFailure: APIOnFailure
) {
    return authenticatedApiErrorHandler(
        async (session, headers) => {
            const apiResponse = await axios.delete(
                `${Endpoints.API_SEMESTERS}/${id}`,
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
