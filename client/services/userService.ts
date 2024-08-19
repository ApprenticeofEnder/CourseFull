import axios, { AxiosError } from 'axios';
import { supabase } from '@lib/supabase';
import { apiErrorHandler, authenticatedApiErrorHandler } from '@lib/helpers';
import { APIOnFailure, Endpoints } from '@coursefull';
import { Session } from '@supabase/supabase-js';
import { error } from 'console';

export async function createUser(
    first_name: string,
    last_name: string,
    email: string,
    password: string,
    onFailure: APIOnFailure
) {
    return apiErrorHandler(async () => {
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
            },
        };

        const apiResponse = await axios
            .post(Endpoints.API_USER, apiPostData, {
                validateStatus: (status) => {
                    return status === 201;
                },
            })
            .catch((error: AxiosError) => {
                console.error('Rails API error encountered.');
                console.error(error.toJSON());
                throw error;
            });
        return apiResponse;
    }, onFailure);
}

export async function login(
    email: string,
    password: string,
    onFailure: APIOnFailure
) {
    return apiErrorHandler(async () => {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) {
            throw new Error(error.message);
        }
        return undefined;
    }, onFailure);
}

export async function getProgress(session: Session, onFailure: APIOnFailure) {
    return authenticatedApiErrorHandler(
        async (session, headers) => {
            const apiResponse = await axios.get(Endpoints.API_PROGRESS, {
                headers,
                validateStatus: (status) => {
                    return status === 200;
                },
            });
            return apiResponse;
        },
        session,
        onFailure
    );
}

export async function getUserData(session: Session, onFailure: APIOnFailure) {
    return authenticatedApiErrorHandler(
        async (session, headers) => {
            const apiResponse = await axios.get(`${Endpoints.API_USER}/me`, {
                headers,
                validateStatus: (status) => {
                    return status === 200;
                },
            });
            return apiResponse;
        },
        session,
        onFailure
    );
}

export async function updateUserDetails(
    first_name: string,
    last_name: string,
    email: string,
    session: Session,
    onFailure: APIOnFailure
) {
    return authenticatedApiErrorHandler(
        async (session, headers) => {
            const apiResponse = await axios.put(
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
        session,
        onFailure
    );
}

export async function deleteUser(session: Session, onFailure: APIOnFailure) {
    return authenticatedApiErrorHandler(
        async (session, headers) => {
            const apiResponse = await axios.delete(`${Endpoints.API_USER}/me`, {
                headers,
                validateStatus: (status) => {
                    return status === 204;
                },
            });
            return apiResponse;
        },
        session,
        onFailure
    );
}
