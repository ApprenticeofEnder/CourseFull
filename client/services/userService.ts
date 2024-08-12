import axios from 'axios';
import { supabase } from '@/supabase';
import { apiErrorHandler, authenticatedApiErrorHandler } from '@/lib/helpers';
import { Endpoints } from '@coursefull';
import { Session } from '@supabase/supabase-js';

export async function createUser(
    first_name: string,
    last_name: string,
    email: string,
    password: string,
    onFailure: (error: Error) => void
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

        const apiResponse = await axios.post(Endpoints.API_USER, apiPostData);

        if (apiResponse.status !== 201) {
            console.error('Rails API error encountered.');
            throw apiResponse.data;
        }
        return apiResponse;
    }, onFailure);
}

export async function login(
    email: string,
    password: string,
    onFailure: (error: Error) => void
) {
    return apiErrorHandler(async () => {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) {
            throw error.message;
        }
        return undefined;
    }, onFailure);
}

export async function getProgress(
    session: Session,
    onFailure: (error: Error) => void
) {
    return authenticatedApiErrorHandler(
        async (session) => {
            const apiResponse = await axios.get(Endpoints.API_PROGRESS, {
                headers: {
                    Authorization: `Bearer ${session.access_token}`,
                },
            });

            if (apiResponse.status !== 200) {
                throw apiResponse.data;
            }
            return apiResponse;
        },
        session,
        onFailure
    );
}

export async function getUserData(
    session: Session,
    onFailure: (error: Error) => void
) {
    return authenticatedApiErrorHandler(
        async (session) => {
            const apiResponse = await axios.get(`${Endpoints.API_USER}/me`, {
                headers: {
                    Authorization: `Bearer ${session.access_token}`,
                },
            });

            if (apiResponse.status !== 200) {
                throw apiResponse.data;
            }
            return apiResponse;
        },
        session,
        onFailure
    );
}
