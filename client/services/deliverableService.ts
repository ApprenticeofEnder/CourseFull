import { Endpoints, ItemStatus } from '@/lib/enums';
import { authenticatedApiErrorHandler } from '@/lib/helpers';
import { Deliverable } from '@/lib/types';
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
