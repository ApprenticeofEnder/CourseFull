import { ItemStatus } from '@coursefull';
import { getLocalTimeZone, now, ZonedDateTime } from '@internationalized/date';
import { ReadableStatus } from '@lib/helpers';
import StatusChip from '@components/Chip/StatusChip';
import { useMemo } from 'react';

interface GradeColours {
    bgColour: string;
    textColour: string;
}

export function useGradeColours(
    goal: number | undefined,
    grade: number | undefined,
    deliverableStatus?: ItemStatus // Only use this for deliverables
): GradeColours {
    return useMemo(() => {
        const defaultResult = {
            // For some reason this is a very light colour
            // and yet the success/danger colours are the inverse?
            bgColour: 'bg-primary-800',
            textColour: 'text-text',
        };
        if (goal === undefined || grade === undefined || grade === 0) {
            return defaultResult;
        }
        if (deliverableStatus && deliverableStatus !== ItemStatus.COMPLETE) {
            return defaultResult;
        }
        let indicator: string = 'danger';
        if (grade >= goal) {
            indicator = 'success';
        } else if (goal - grade <= 5) {
            indicator = 'warning';
        } else {
            indicator = 'danger';
        }
        return {
            bgColour: `bg-${indicator}-200`,
            textColour: `text-${indicator}-800`,
        };
    }, [goal, grade, deliverableStatus]);
}

export function useDeliverableStatus(
    status: ItemStatus,
    deadline: ZonedDateTime
) {
    return useMemo(() => {
        const incomplete = status !== ItemStatus.COMPLETE;
        const deadlinePassed = deadline < now(getLocalTimeZone());
        if (incomplete && deadlinePassed) {
            return {
                status: ItemStatus.OVERDUE
            };
        }
        return {
            status,
        };
    }, [status, deadline]);
}
