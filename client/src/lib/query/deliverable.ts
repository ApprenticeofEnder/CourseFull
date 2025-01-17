import { Session } from '@supabase/supabase-js';
import { useQuery } from '@tanstack/react-query';

import { useActiveDeliverables } from '@/lib/hooks/data';
import { getDeliverables } from '@/services/deliverable-service';

export function useDeliverablesQuery(session: Session | null) {
    const {
        data: deliverables,
        isLoading: loadingDeliverables,
        error,
    } = useQuery({
        queryKey: ['deliverables'],
        queryFn: () => {
            return getDeliverables(session);
        },
        enabled: !!session,
    });
    if (error) {
        throw error;
    }

    return {
        deliverables,
        loadingDeliverables,
    };
}

export function useUpcomingDeliverablesQuery(session: Session | null) {
    const {
        data: deliverables,
        isLoading: loadingDeliverables,
        error,
    } = useQuery({
        queryKey: ['deliverables', 'upcoming'],
        queryFn: () => {
            return getDeliverables(session);
        },
        enabled: !!session,
    });
    if (error) {
        throw error;
    }

    const upcomingDeliverables = useActiveDeliverables(deliverables);

    return {
        upcomingDeliverables,
        loadingDeliverables,
    };
}
