import { Endpoints, ItemStatus } from '@coursefull';
import { authenticatedApiErrorHandler } from '@lib/helpers';
import { Deliverable } from '@coursefull';
import { Session } from '@supabase/supabase-js';
import axios from 'axios';

export async function createDeliverable(
    { name, weight, mark, status, notes, api_v1_course_id }: Deliverable,
    session: Session | null,
    onFailure: (error: Error) => void
) {
    return authenticatedApiErrorHandler(
        async (session) => {
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
                    headers: {
                        Authorization: `Bearer ${session.access_token}`,
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
    onFailure: (error: Error) => void
) {
    return authenticatedApiErrorHandler(
        async (session) => {
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
                    headers: {
                        Authorization: `Bearer ${session.access_token}`,
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
    onFailure: (error: Error) => void
) {
    return authenticatedApiErrorHandler(
        async (session) => {
            return axios.get(Endpoints.API_DELIVERABLES, {
                headers: {
                    Authorization: `Bearer ${session.access_token}`,
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
    onFailure: (error: Error) => void
) {
    return authenticatedApiErrorHandler(
        async (session) => {
            return axios.get(`${Endpoints.API_DELIVERABLES}/${id}`, {
                headers: {
                    Authorization: `Bearer ${session.access_token}`,
                },
            });
        },
        session,
        onFailure
    );
}
