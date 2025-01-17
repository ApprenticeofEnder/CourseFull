import { Session } from '@supabase/supabase-js';

import { authenticatedApiHandler } from '@/lib/helpers';
import { api } from '@/services';
import { Endpoints, Product } from '@/types';

export async function getProducts(session: Session | null): Promise<Product[]> {
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
