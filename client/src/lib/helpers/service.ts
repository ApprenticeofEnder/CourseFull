import { Session } from '@supabase/supabase-js';

import { AuthHeaders } from '@/types';

export function getApiHeaders(session: Session | null): Partial<AuthHeaders> {
    if (!session) {
        return {};
    }
    const headers: Partial<AuthHeaders> = {
        Authorization: `Bearer ${session.access_token}`,
    };
    return headers;
}
