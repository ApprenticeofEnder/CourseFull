'use client'

import {
    Endpoints,
    BasicUserData,
    User,
    SemesterProgressType,
} from '@coursefull';
import { apiHandler, authenticatedApiHandler, sleep } from '@lib/helpers';
import { Session, SupabaseClient } from '@supabase/supabase-js';
import { api } from '@services';

export async function createUser({
    first_name,
    last_name,
    email,
    password,
    subscribed,
}: BasicUserData, supabase: SupabaseClient): Promise<void> {
    await apiHandler<User>(async () => {
        const supabaseResponse = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    first_name,
                    last_name,
                },
            },
        });
        if (supabaseResponse.error) {
            console.error('Supabase error encountered.');
            throw new Error(supabaseResponse.error.message);
        }

        const apiPostData = {
            api_v1_user: {
                first_name,
                last_name,
                email,
                supabase_id: supabaseResponse.data.user?.id,
                subscribed,
            },
        };

        const apiResponse = await api.post(Endpoints.API_USER, apiPostData, {
            validateStatus: (status) => {
                return status === 201;
            },
        });
        return apiResponse;
    });
}

export async function login(email: string, password: string, supabase: SupabaseClient): Promise<void> {
    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });
    if (error) {
        return Promise.reject(new Error(error.message));
    }
}

export async function getProgress(
    session: Session
): Promise<SemesterProgressType[]> {
    const res = await authenticatedApiHandler<SemesterProgressType[]>(
        async (session, headers) => {
            const apiResponse = await api.get<SemesterProgressType[]>(
                Endpoints.API_PROGRESS,
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
    return res.data;
}

export async function getUserData(session: Session): Promise<User> {
    const res = await authenticatedApiHandler<User>(
        async (session, headers) => {
            const apiResponse = await api.get<User>(
                `${Endpoints.API_USER}/me`,
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
    return res.data;
}

export async function updateUserDetails(
    first_name: string,
    last_name: string,
    email: string,
    session: Session
): Promise<User> {
    const res = await authenticatedApiHandler<User>(
        async (session, headers) => {
            // TODO: Add a method for Supabase as well
            const apiResponse = await api.put<User>(
                `${Endpoints.API_USER}/me`,
                {
                    api_v1_user: {
                        first_name,
                        last_name,
                        email,
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
    return res.data;
}

export async function deleteUser(
    session: Session
): Promise<void> {
    await authenticatedApiHandler(
        async (session, headers) => {
            const apiResponse = await api.delete(`${Endpoints.API_USER}/me`, {
                headers,
                validateStatus: (status) => {
                    return status === 204;
                },
            });
            return apiResponse;
        },
        session
    );
}
