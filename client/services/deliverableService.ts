import {
    APIOnFailure,
    APIServiceResponse,
    Deliverable,
    Endpoints,
} from '@coursefull';
import { authenticatedApiErrorHandler } from '@lib/helpers';
import { Session } from '@supabase/supabase-js';
import axios from 'axios';

export async function createDeliverable(
    { name, weight, mark, status, notes, api_v1_course_id }: Deliverable,
    session: Session | null,
    onFailure: APIOnFailure
): Promise<APIServiceResponse> {
    return authenticatedApiErrorHandler(
        async (session, headers) => {
            return axios.post(
                Endpoints.API_DELIVERABLES,
                {
                    api_v1_deliverable: {
                        name,
                        weight,
                        mark,
                        status,
                        notes,
                        api_v1_course_id,
                    },
                },
                {
                    headers,
                    validateStatus: (status) => {
                        return status === 201;
                    },
                }
            );
        },
        session,
        onFailure
    );
}

export async function updateDeliverable(
    { id, name, weight, mark, status, notes }: Deliverable,
    session: Session | null,
    onFailure: APIOnFailure
): Promise<APIServiceResponse> {
    return authenticatedApiErrorHandler(
        async (session, headers) => {
            return axios.put(
                `${Endpoints.API_DELIVERABLES}/${id}`,
                {
                    api_v1_deliverable: {
                        name,
                        weight,
                        mark,
                        status,
                        notes,
                    },
                },
                {
                    headers,
                    validateStatus: (status) => {
                        return status === 200;
                    },
                }
            );
        },
        session,
        onFailure
    );
}

export async function getDeliverables(
    session: Session | null,
    onFailure: APIOnFailure
): Promise<APIServiceResponse> {
    return authenticatedApiErrorHandler(
        async (session, headers) => {
            return axios.get(Endpoints.API_DELIVERABLES, {
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

export async function getDeliverable(
    id: string,
    session: Session | null,
    onFailure: APIOnFailure
): Promise<APIServiceResponse> {
    return authenticatedApiErrorHandler(
        async (session, headers) => {
            return axios.get(`${Endpoints.API_DELIVERABLES}/${id}`, {
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

export async function deleteDeliverable(
    id: string,
    session: Session | null,
    onFailure: APIOnFailure
): Promise<APIServiceResponse> {
    return authenticatedApiErrorHandler(
        async (session, headers) => {
            const apiResponse = await axios.delete(
                `${Endpoints.API_DELIVERABLES}/${id}`,
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
