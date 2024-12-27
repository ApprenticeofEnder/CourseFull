import {
    APIOnFailure,
    APIServiceResponse,
    Deliverable,
    Endpoints,
    Updated,
} from '@coursefull';
import { authenticatedApiErrorHandler } from '@lib/helpers';
import { Session } from '@supabase/supabase-js';
import { api } from '@services';

export async function createDeliverable(
    {
        name,
        weight,
        mark,
        status,
        notes,
        start_date,
        deadline,
        api_v1_course_id,
    }: Deliverable,
    session: Session | null,
    onFailure: APIOnFailure
): Promise<APIServiceResponse> {
    return authenticatedApiErrorHandler(
        async (session, headers) => {
            return api.post(
                Endpoints.API_DELIVERABLES,
                {
                    api_v1_deliverable: {
                        name,
                        weight,
                        mark,
                        status,
                        notes,
                        start_date,
                        deadline,
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
    {
        id,
        name,
        weight,
        mark,
        status,
        notes,
        start_date,
        deadline,
    }: Updated<Deliverable>,
    session: Session | null,
    onFailure: APIOnFailure
): Promise<APIServiceResponse> {
    return authenticatedApiErrorHandler(
        async (session, headers) => {
            return api.put(
                `${Endpoints.API_DELIVERABLES}/${id}`,
                {
                    api_v1_deliverable: {
                        name,
                        weight,
                        mark,
                        status,
                        notes,
                        start_date,
                        deadline,
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
            return api.get(Endpoints.API_DELIVERABLES, {
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
            return api.get(`${Endpoints.API_DELIVERABLES}/${id}`, {
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
            const apiResponse = await api.delete(
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
