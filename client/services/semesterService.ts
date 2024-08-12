'use client';
import axios, { AxiosResponse } from 'axios';
import { supabase, useSupabaseSession } from '@/supabase';
import { Endpoints, ItemStatus } from '@/coursefull.d';
import { authenticatedApiErrorHandler } from '@/lib/helpers';
import { Session } from '@supabase/supabase-js';
import { Semester } from '@/coursefull.d';

export async function createSemester(
    { name, status, goal }: Semester,
    session: Session | null,
    onFailure: (error: Error) => void
) {
    return authenticatedApiErrorHandler(
        async (session) => {
            const apiResponse = await axios.post(
                Endpoints.API_SEMESTERS,
                {
                    api_v1_semester: {
                        name,
                        status,
                        goal,
                    },
                },
                {
                    headers: {
                        Authorization: `Bearer ${session.access_token}`,
                    },
                }
            );
            if (apiResponse.status !== 201) {
                throw apiResponse.data;
            }
            return apiResponse;
        },
        session,
        onFailure
    );
}

export async function getSemesters(
    session: Session | null,
    onFailure: (error: Error) => void
) {
    return authenticatedApiErrorHandler(
        async (session) => {
            return axios.get(Endpoints.API_SEMESTERS, {
                headers: {
                    Authorization: `Bearer ${session.access_token}`,
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
    onFailure: (error: Error) => void
) {
    return authenticatedApiErrorHandler(
        async (session) => {
            return axios.get(`${Endpoints.API_SEMESTERS}/${id}`, {
                headers: {
                    Authorization: `Bearer ${session.access_token}`,
                },
            });
        },
        session,
        onFailure
    );
}
