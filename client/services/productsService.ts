import { Endpoints } from '@coursefull';
import { authenticatedApiErrorHandler } from '@lib/helpers';
import { Session } from '@supabase/supabase-js';
import axios, { AxiosError } from 'axios';

export async function getProducts(
    session: Session | null,
    onFailure: (error: Error) => void
) {
    return authenticatedApiErrorHandler(
        async (session, headers) => {
            return axios.get(Endpoints.API_PRODUCTS, {
                headers,
            });
        },
        session,
        onFailure
    );
}
