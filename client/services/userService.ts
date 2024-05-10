import axios from 'axios';
import { supabase } from '@/supabase';
import { Endpoints, errorHandler } from '@/lib/helpers';
import { Session } from '@supabase/supabase-js';

export async function createUser(
    first_name: string,
    last_name: string,
    email: string,
    password: string,
    onFailure: (error: unknown) => void
) {
    return errorHandler(async () => {
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
            throw supabaseResponse.error.message;
        }

        const apiPostData = {
            api_v1_user: {
                first_name,
                last_name,
                email,
                supabase_id: supabaseResponse.data.user?.id,
            },
        };

        const apiResponse = await axios.post(
            Endpoints.API_USER_CREATE,
            apiPostData
        );

        if (apiResponse.status !== 201) {
            throw apiResponse.data;
        }
        return apiResponse;
    }, onFailure);
}

export async function login(
    email: string,
    password: string,
    onFailure: (error: unknown) => void
) {
    return errorHandler(async () => {
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
    onFailure: (error: unknown) => void
) {
    async function apiCall() {
        const apiResponse = await axios.get(Endpoints.API_PROGRESS, {
            headers: {
                Authorization: `Bearer ${session.access_token}`,
            },
        });

        if (apiResponse.status !== 201) {
            throw apiResponse.data;
        }
        return apiResponse;
    }
    return errorHandler(apiCall, onFailure);
}
