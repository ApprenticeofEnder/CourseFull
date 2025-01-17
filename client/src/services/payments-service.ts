import { Session } from '@supabase/supabase-js';

import { authenticatedApiHandler } from '@/lib/helpers';
import { api } from '@/services';
import { CartItem, Endpoints, PaymentLinkDto } from '@/types';

export async function createPayment(
    cart: CartItem[],
    session: Session | null
): Promise<PaymentLinkDto> {
    const { data } = await authenticatedApiHandler<PaymentLinkDto>(
        async (session, headers) => {
            const products = cart.map((cartItem) => {
                return {
                    stripe_id: cartItem.product.stripe_id,
                    stripe_price: cartItem.product.stripe_price,
                    quantity: cartItem.quantity,
                };
            });
            const response = await api.post<PaymentLinkDto>(
                Endpoints.API_PAYMENTS,
                { products },
                {
                    headers,
                }
            );
            return response;
        },
        session
    );
    return data;
}
