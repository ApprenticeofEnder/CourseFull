import { ZonedDateTime } from '@internationalized/date';

import { SavedDeliverable } from '@/types/data';

export type TimeAction =
    | {
          type: 'ADD_OVERDUE_DELIVERABLE';
          payload: SavedDeliverable;
      }
    | {
          type: 'ADD_URGENT_DELIVERABLE';
          payload: SavedDeliverable;
      }
    | {
          type: 'COMPLETE_DELIVERABLE';
          payload: SavedDeliverable;
      }
    | { type: 'CLEAR_DELIVERABLES' };

export interface TimeState {
    deliverables: {
        overdue: SavedDeliverable[];
        urgent: SavedDeliverable[];
    };
    time: ZonedDateTime;
}
