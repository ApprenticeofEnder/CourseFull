'use client';
import {
    APIOnFailure,
    Endpoints,
    Semester,
    SemesterDto,
} from '@coursefull';
import { authenticatedApiHandler } from '@lib/helpers';
import { Session } from '@supabase/supabase-js';
import { api } from '@services';
import { convertSemesterDto } from '@lib/dto';

export async function createSemester(
    { name, status, goal }: Semester,
    session: Session | null
): Promise<Semester> {
    const { data } = await authenticatedApiHandler<SemesterDto>(
        async (session, headers) => {
            const apiResponse = await api.post<SemesterDto>(
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
        session
    );
    const semester = convertSemesterDto(data);
    return semester;
}

export async function getSemesters(
    session: Session | null
): Promise<Semester[]> {
    const { data } = await authenticatedApiHandler<SemesterDto[]>(
        async (session, headers) => {
            return api.get<SemesterDto[]>(Endpoints.API_SEMESTERS, {
                headers,
                validateStatus: (status) => {
                    return status === 200;
                },
            });
        },
        session
    );
    const semesters: Semester[] = data.map(convertSemesterDto);
    return semesters;
}

export async function getSemester(
    id: string,
    session: Session | null
): Promise<Semester> {
    const { data } = await authenticatedApiHandler<SemesterDto>(
        async (session, headers) => {
            return api.get<SemesterDto>(`${Endpoints.API_SEMESTERS}/${id}`, {
                headers,
                validateStatus: (status) => {
                    return status === 200;
                },
            });
        },
        session
    );
    const semester = convertSemesterDto(data);
    return semester;
}

export async function updateSemester(
    { id, name, status, goal }: Semester,
    session: Session | null
): Promise<Semester> {
    const { data } = await authenticatedApiHandler<SemesterDto>(
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
        session
    );
    const semester = convertSemesterDto(data);
    return semester;
}

export async function deleteSemester(
    id: string,
    session: Session | null
): Promise<void> {
    await authenticatedApiHandler(
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
        session
    );
}
