import { APIOnFailure, APIServiceResponse, Endpoints } from '@coursefull';
import { authenticatedApiErrorHandler } from '@lib/helpers';
import { Session } from '@supabase/supabase-js';
import axios from 'axios';

export async function getProducts(
    session: Session | null,
    onFailure: APIOnFailure
): Promise<APIServiceResponse> {
    return authenticatedApiErrorHandler(
        async (session, headers) => {
            return axios.get(Endpoints.API_PRODUCTS, {
                headers,
                validateStatus: (status) => {
                    return status === 200;
                },
            });
        },
        session,
        onFailure
    );
}
