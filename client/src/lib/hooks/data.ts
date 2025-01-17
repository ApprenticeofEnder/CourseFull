import { useMemo } from 'react';

import { ItemStatus, SavedDeliverable, SemesterProgressType } from '@/types';

export function useSkeletonItems<T>(
    items: T[] | undefined,
    loading: boolean
): T[] | null[] {
    return useMemo(() => {
        if (loading) {
            return Array(3).fill(null);
        }
        return items || [];
    }, [items, loading]);
}

export function useActiveSemester(
    progressData: SemesterProgressType[] | undefined
) {
    return useMemo(
        () =>
            progressData
                ?.filter((semester) => semester.status === ItemStatus.ACTIVE)
                .shift() || null,
        [progressData]
    );
}

export function useActiveDeliverables(
    deliverables: SavedDeliverable[] | undefined
) {
    return useMemo(() => {
        return deliverables?.filter(
            (deliverable) => deliverable.status === ItemStatus.ACTIVE
        );
    }, [deliverables]);
}
