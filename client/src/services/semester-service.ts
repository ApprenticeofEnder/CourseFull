'use client';

import { Session } from '@supabase/supabase-js';

import { getApiHeaders } from '@/lib/helpers';
import { convertSemesterFromDto } from '@/lib/helpers/dto';
import { api } from '@/services';
import { Endpoints, SavedSemester, Semester, SemesterDto } from '@/types';

export async function createSemester(
    { name, status, goal }: Semester,
    session: Session | null
): Promise<SavedSemester> {
    const headers = getApiHeaders(session);
    const { data } = await api.post<SemesterDto>(
        Endpoints.Api.API_SEMESTERS,
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
    const semester = convertSemesterFromDto(data) as SavedSemester;
    return semester;
}

export async function getSemesters(
    session: Session | null
): Promise<SavedSemester[]> {
    const headers = getApiHeaders(session);
    const { data } = await api.get<SemesterDto[]>(Endpoints.Api.API_SEMESTERS, {
        headers,
        validateStatus: (status) => {
            return status === 200;
        },
    });
    const semesters: SavedSemester[] = data.map((dto) => {
        return convertSemesterFromDto(dto) as SavedSemester;
    });
    return semesters;
}

export async function getSemester(
    id: string,
    session: Session | null
): Promise<SavedSemester> {
    const headers = getApiHeaders(session);
    const { data } = await api.get<SemesterDto>(
        `${Endpoints.Api.API_SEMESTERS}/${id}`,
        {
            headers,
            validateStatus: (status) => {
                return status === 200;
            },
        }
    );
    const semester = convertSemesterFromDto(data) as SavedSemester;
    return semester;
}

export async function updateSemester(
    { id, name, status, goal }: SavedSemester,
    session: Session | null
): Promise<SavedSemester> {
    const headers = getApiHeaders(session);
    const { data } = await api.put<SemesterDto>(
        `${Endpoints.Api.API_SEMESTERS}/${id}`,
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
    const semester = convertSemesterFromDto(data) as SavedSemester;
    return semester;
}

export async function deleteSemester(
    id: string,
    session: Session | null
): Promise<void> {
    const headers = getApiHeaders(session);
    await api.delete(`${Endpoints.Api.API_SEMESTERS}/${id}`, {
        headers,
        validateStatus: (status) => {
            return status === 204;
        },
    });
}
