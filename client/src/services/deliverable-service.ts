import { Session } from '@supabase/supabase-js';

import { convertDeliverableFromDto } from '@/lib/helpers/dto';
import { getApiHeaders } from '@/lib/helpers/service';
import { api } from '@/services';
import {
    Deliverable,
    DeliverableDto,
    Endpoints,
    Saved,
    SavedDeliverable,
} from '@/types';

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
    const headers = getApiHeaders(session);
    const { data } = await api.post<DeliverableDto>(
        Endpoints.Api.API_DELIVERABLES,
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
    }: Saved<DeliverableDto>,
    session: Session | null
): Promise<Deliverable> {
    const headers = getApiHeaders(session);
    const { data } = await api.put<DeliverableDto>(
        `${Endpoints.Api.API_DELIVERABLES}/${id}`,
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
    return convertDeliverableFromDto(data);
}

export async function getDeliverables(
    session: Session | null
): Promise<SavedDeliverable[]> {
    const headers = getApiHeaders(session);
    const { data } = await api.get<DeliverableDto[]>(
        Endpoints.Api.API_DELIVERABLES,
        {
            headers,
            validateStatus: (status) => {
                return status === 200;
            },
        }
    );
    const deliverables: SavedDeliverable[] = data.map((dto) => {
        return convertDeliverableFromDto(dto) as SavedDeliverable;
    });
    return deliverables;
}

export async function getDeliverable(
    id: string,
    session: Session | null
): Promise<SavedDeliverable> {
    const headers = getApiHeaders(session);
    const { data } = await api.get<DeliverableDto>(
        `${Endpoints.Api.API_DELIVERABLES}/${id}`,
        {
            headers,
            validateStatus: (status) => {
                return status === 200;
            },
        }
    );
    const deliverable = convertDeliverableFromDto(data) as SavedDeliverable;
    return deliverable;
}

export async function deleteDeliverable(
    id: string,
    session: Session | null
): Promise<void> {
    const headers = getApiHeaders(session);
    await api.delete(`${Endpoints.Api.API_DELIVERABLES}/${id}`, {
        headers,
        validateStatus: (status) => {
            return status === 204;
        },
    });
}
