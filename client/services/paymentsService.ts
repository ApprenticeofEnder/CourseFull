import { Endpoints } from '@coursefull';
import { authenticatedApiErrorHandler } from '@lib/helpers';
import { CartItem } from '@coursefull';
import { Session } from '@supabase/supabase-js';
import axios, { AxiosError } from 'axios';

export async function createPayment(
    cart: CartItem[],
    session: Session | null,
    onFailure: (error: Error) => void
) {
    return authenticatedApiErrorHandler(
        async (session, headers) => {
            const products = cart.map((cartItem) => {
                return {
                    stripe_id: cartItem.product.stripe_id,
                    stripe_price: cartItem.product.stripe_price,
                    quantity: cartItem.quantity,
                };
            });
            const response = await axios.post(
                Endpoints.API_PAYMENTS,
                { products },
                {
                    headers,
                    validateStatus: (status) => {
                        return status === 200;
                    },
                }
            );
            return response;
            // try {

            // } catch (error: any) {
            //     const { response }: AxiosError = error;
            //     throw new Error(
            //         JSON.stringify({
            //             status: response?.status,
            //             data: response?.data,
            //         })
            //     );
            // }
        },
        session,
        onFailure
    );
}
