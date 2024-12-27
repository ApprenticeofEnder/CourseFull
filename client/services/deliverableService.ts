import {
    Deliverable,
    DeliverableDto,
    Endpoints,
    Updated,
} from '@coursefull';
import { authenticatedApiHandler } from '@lib/helpers';
import { Session } from '@supabase/supabase-js';
import { api } from '@services';
import { convertDeliverableDto } from '@lib/dto';

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
    session: Session | null
): Promise<Deliverable | null> {
    const res = await authenticatedApiHandler<DeliverableDto>(
        async (session, headers) => {
            return api.post<DeliverableDto>(
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
        session
    );
    const {data} = res;
    return convertDeliverableDto(data);
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
    session: Session | null
): Promise<Deliverable> {
    const res = await authenticatedApiHandler<DeliverableDto>(
        async (session, headers) => {
            return api.put<DeliverableDto>(
                `${Endpoints.API_DELIVERABLES}/${id}`,
                {
                    api_v1_deliverable: {
                        name,
                        weight,
                        mark,
                        status,
                        notes,
                        start_date: start_date.toString(),
                        deadline: deadline.toString(),
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
        session
    );
    const {data} = res;
    return convertDeliverableDto(data);
}

export async function getDeliverables(
    session: Session | null
): Promise<Deliverable[] | null> {
    const res = await authenticatedApiHandler<DeliverableDto[]>(
        async (session, headers) => {
            return api.get<DeliverableDto[]>(Endpoints.API_DELIVERABLES, {
                headers,
                validateStatus: (status) => {
                    return status === 200;
                },
            });
        },
        session
    );

    const { data } = res;
    const deliverables: Deliverable[] = data.map(convertDeliverableDto);
    return deliverables;
}

export async function getDeliverable(
    id: string,
    session: Session | null
): Promise<Deliverable> {
    const res = await authenticatedApiHandler(
        async (session, headers) => {
            return api.get(`${Endpoints.API_DELIVERABLES}/${id}`, {
                headers,
                validateStatus: (status) => {
                    return status === 200;
                },
            });
        },
        session
    );
    const { data } = res;
    const deliverable = convertDeliverableDto(data);
    return deliverable;
}

export async function deleteDeliverable(
    id: string,
    session: Session | null
): Promise<null> {
    const res = await authenticatedApiHandler<null>(
        async (session, headers) => {
            const apiResponse = await api.delete<null>(
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
        session
    );
    return res.data;
}
