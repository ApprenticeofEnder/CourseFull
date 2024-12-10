import {
    APIOnFailure,
    APIServiceResponse,
    CartItem,
    Endpoints,
} from '@coursefull';
import { authenticatedApiErrorHandler } from '@lib/helpers';
import { Session } from '@supabase/supabase-js';
import axios from 'axios';
import { api } from '@services';

export async function createPayment(
    cart: CartItem[],
    session: Session | null,
    onFailure: APIOnFailure
): Promise<APIServiceResponse> {
    return authenticatedApiErrorHandler(
        async (session, headers) => {
            const products = cart.map((cartItem) => {
                return {
                    stripe_id: cartItem.product.stripe_id,
                    stripe_price: cartItem.product.stripe_price,
                    quantity: cartItem.quantity,
                };
            });
            const response = await api.post(
                Endpoints.API_PAYMENTS,
                { products },
                {
                    headers,
                }
            );
            return response;
        },
        session,
        onFailure
    );
}
