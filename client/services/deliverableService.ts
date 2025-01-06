import { Deliverable, DeliverableDto, Endpoints, Updated } from '@coursefull';
import { authenticatedApiHandler } from '@lib/helpers';
import { Session } from '@supabase/supabase-js';
import { api } from '@services';
import { convertDeliverableFromDto } from '@lib/dto';

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
    }: DeliverableDto,
    session: Session | null
): Promise<Deliverable> {
    const { data } = await authenticatedApiHandler<DeliverableDto>(
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
    return convertDeliverableFromDto(data);
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
    }: Updated<DeliverableDto>,
    session: Session | null
): Promise<Deliverable> {
    const { data } = await authenticatedApiHandler<DeliverableDto>(
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
        session
    );
    return convertDeliverableFromDto(data);
}

export async function getDeliverables(
    session: Session | null
): Promise<Deliverable[] | null> {
    const { data } = await authenticatedApiHandler<DeliverableDto[]>(
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
    const deliverables: Deliverable[] = data.map(convertDeliverableFromDto);
    return deliverables;
}

export async function getDeliverable(
    id: string,
    session: Session | null
): Promise<Deliverable> {
    const { data } = await authenticatedApiHandler<DeliverableDto>(
        async (session, headers) => {
            return api.get<DeliverableDto>(
                `${Endpoints.API_DELIVERABLES}/${id}`,
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
    const deliverable = convertDeliverableFromDto(data);
    return deliverable;
}

export async function deleteDeliverable(
    id: string,
    session: Session | null
): Promise<void> {
    await authenticatedApiHandler(
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
        session
    );
}
