import DeliverableCard from '@/components/Card/Deliverable';
import { useSkeletonItems } from '@/lib/hooks/data';
import { SavedDeliverable } from '@/types';

interface UpcomingDeliverablesProps {
    upcomingDeliverables: SavedDeliverable[] | undefined;
    loadingDeliverables: boolean;
}

export default function UpcomingDeliverables({
    upcomingDeliverables,
    loadingDeliverables,
}: UpcomingDeliverablesProps) {
    const deliverablesToRender = useSkeletonItems(
        upcomingDeliverables,
        loadingDeliverables
    );

    if (deliverablesToRender.length === 0) {
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
                handleView={() => {}}
                showCourse
            />
        );
    });
}
