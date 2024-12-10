'use client';
import {
    APIOnFailure,
    APIServiceResponse,
    Endpoints,
    Semester,
} from '@coursefull';
import { authenticatedApiErrorHandler } from '@lib/helpers';
import { Session } from '@supabase/supabase-js';
import axios from 'axios';
import { api } from '@services';

export async function createSemester(
    { name, status, goal }: Semester,
    session: Session | null,
    onFailure: APIOnFailure
): Promise<APIServiceResponse> {
    return authenticatedApiErrorHandler(
        async (session, headers) => {
            const apiResponse = await api.post(
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
): Promise<APIServiceResponse> {
    return authenticatedApiErrorHandler(
        async (session, headers) => {
            return api.get(Endpoints.API_SEMESTERS, {
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
): Promise<APIServiceResponse> {
    return authenticatedApiErrorHandler(
        async (session, headers) => {
            return api.get(`${Endpoints.API_SEMESTERS}/${id}`, {
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
): Promise<APIServiceResponse> {
    return authenticatedApiErrorHandler(
        async (session, headers) => {
            const apiResponse = await api.put(
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
): Promise<APIServiceResponse> {
    return authenticatedApiErrorHandler(
        async (session, headers) => {
            const apiResponse = await api.delete(
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
