'use client';

import DeliverableCard from '@/components/Card/Deliverable';
import { useSkeletonItems } from '@/lib/hooks/data';
import { useUpcomingDeliverablesQuery } from '@/lib/query/deliverable';
import { useSession } from '@/lib/supabase/SessionContext';

export default function Page() {
    const { session } = useSession();
    const { upcomingDeliverables, loadingDeliverables } =
        useUpcomingDeliverablesQuery(session);
    const deliverablesToRender = useSkeletonItems(
        upcomingDeliverables,
        loadingDeliverables
    );

    if (!loadingDeliverables && deliverablesToRender?.length === 0) {
        return (
            <h4 className="text-center text-xl">
                No deliverables upcoming. Hooray!
            </h4>
        );
    }

    return deliverablesToRender.map((deliverable, index) => {
        return (
            <DeliverableCard
                key={deliverable?.id ?? index}
                deliverable={deliverable}
                isLoading={loadingDeliverables}
                onPress={() => {}}
                isPressable
                showCourse
            />
        );
    });
}
