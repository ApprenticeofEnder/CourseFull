import {
    Endpoints,
    Product,
} from '@coursefull';
import { authenticatedApiHandler } from '@lib/helpers';
import { Session } from '@supabase/supabase-js';
import { api } from '@services';

export async function getProducts(
    session: Session | null
): Promise<Product[]> {
    const { data } = await authenticatedApiHandler<Product[]>(
        async (session, headers) => {
            return api.get<Product[]>(Endpoints.API_PRODUCTS, {
                headers,
                validateStatus: (status) => {
                    return status === 200;
                },
            });
        },
        session
    );
    return data;
}
