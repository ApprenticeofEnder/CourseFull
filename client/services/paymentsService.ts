import { Endpoints } from '@/lib/enums';
import { authenticatedApiErrorHandler } from '@/lib/helpers';
import { Cart } from '@/lib/types';
import { Session } from '@supabase/supabase-js';
import axios, { AxiosError } from 'axios';

export async function createPayment(
    cart: Cart,
    session: Session | null,
    onFailure: (error: Error) => void
) {
    return authenticatedApiErrorHandler(
        async (session) => {
            return axios.post(Endpoints.API_PAYMENTS, cart, {
                headers: {
                    Authorization: `Bearer ${session.access_token}`,
                },
            });
        },
        session,
        onFailure
    );
}
