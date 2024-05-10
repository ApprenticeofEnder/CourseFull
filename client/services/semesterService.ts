'use client';
import axios, { AxiosResponse } from 'axios';
import { supabase, useSupabaseSession } from '@/supabase';
import { Endpoints, SemesterStatus, errorHandler } from '@/lib/helpers';
import { Session } from '@supabase/supabase-js';

export async function createSemester(
    name: string,
    goal: string,
    status: SemesterStatus,
    session: Session,
    onFailure: (error: unknown) => void
) {
    return errorHandler(async () => {
        const apiResponse = await axios.post(
            Endpoints.API_SEMESTERS,
            {
                api_v1_semester: {
                    name,
                    status,
                    goal: parseFloat(goal),
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
    }, onFailure);
}
