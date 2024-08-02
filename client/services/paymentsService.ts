import { Endpoints } from '@/lib/enums';
import { authenticatedApiErrorHandler } from '@/lib/helpers';
import { CartItem } from '@/lib/types';
import { Session } from '@supabase/supabase-js';
import axios, { AxiosError } from 'axios';

export async function createPayment(
    cart: CartItem[],
    session: Session | null,
    onFailure: (error: Error) => void
) {
    return authenticatedApiErrorHandler(
        async (session) => {
            const products = cart.map((cartItem) => {
                return {
                    stripe_id: cartItem.product.stripe_id,
                    stripe_price: cartItem.product.stripe_price,
                    quantity: cartItem.quantity,
                };
            });
            return axios.post(
                Endpoints.API_PAYMENTS,
                { products },
                {
                    headers: {
                        Authorization: `Bearer ${session.access_token}`,
                    },
                }
            );
        },
        session,
        onFailure
    );
}
