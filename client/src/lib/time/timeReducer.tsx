import { SavedDeliverable } from '@/types';
import { TimeAction, TimeState } from '@/types/time';

export function deleteDeliverableIfExists(
    deliverables: SavedDeliverable[],
    id: string
): SavedDeliverable[] {
    return deliverables.filter((deliverable) => deliverable.id !== id);
}

export function findDeliverable(
    deliverables: SavedDeliverable[],
    id: string
): SavedDeliverable | undefined {
    return deliverables.filter((deliverable) => deliverable.id === id).pop();
}

export function timeReducer(state: TimeState, action: TimeAction): TimeState {
    switch (action.type) {
        case 'ADD_OVERDUE_DELIVERABLE': {
            const { id } = action.payload;
            const {
                deliverables: { overdue, urgent },
            } = state;
            const newUrgent = deleteDeliverableIfExists(urgent, id);
            const deliverableInOverdue = findDeliverable(overdue, id);
            const newOverdue = [...overdue, action.payload];
            return {
                ...state,
                deliverables: {
                    urgent: newUrgent,
                    overdue: deliverableInOverdue ? overdue : newOverdue,
                },
            };
        }
        case 'ADD_URGENT_DELIVERABLE': {
            const { id } = action.payload;
            const {
                deliverables: { overdue, urgent },
            } = state;

            const newOverdue = deleteDeliverableIfExists(overdue, id);
            const deliverableInUrgent = findDeliverable(urgent, id);
            const newUrgent = [...urgent, action.payload];
            return {
                ...state,
                deliverables: {
                    urgent: deliverableInUrgent ? urgent : newUrgent,
                    overdue: newOverdue,
                },
            };
        }
        case 'COMPLETE_DELIVERABLE': {
            const { id } = action.payload;
            const {
                deliverables: { overdue, urgent },
            } = state;
            const newUrgent = deleteDeliverableIfExists(urgent, id);
            const newOverdue = deleteDeliverableIfExists(overdue, id);
            return {
                ...state,
                deliverables: {
                    urgent: newUrgent,
                    overdue: newOverdue,
                },
            };
        }
        case 'CLEAR_DELIVERABLES': {
            return {
                ...state,
                deliverables: {
                    urgent: [],
                    overdue: [],
                },
            };
        }
    }
}
