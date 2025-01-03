import { today, getLocalTimeZone, now } from '@internationalized/date';
import { useDateFormatter } from '@react-aria/i18n';

import Button from '@components/Button/Button';
import {
    DeletableProps,
    Deliverable,
    EditableProps,
    ItemStatus,
    SessionProps,
    Updated,
    ViewableProps,
} from '@coursefull';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import {
    ReadableStatus,
    classNames,
    determineGradeBGColour,
    determineGradeTextColour,
} from '@lib/helpers';
import { deleteDeliverable } from '@services/deliverableService';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useGradeColours, useTimeRemaining } from '@lib/hooks/ui';
import StatusChip from '@components/Chip/StatusChip';

interface DeliverableCardProps
    extends Updated<Deliverable>,
        ViewableProps,
        SessionProps {}

export default function DeliverableCard({
    id,
    name,
    mark,
    weight,
    status,
    goal,
    deadline,
    start_date,
    api_v1_course_id,
    session,
    handleView,
}: DeliverableCardProps) {
    let formatter = useDateFormatter({ dateStyle: 'short' });

    const { bgColour, textColour } = useGradeColours(goal, mark, status);

    const timeRemaining = useTimeRemaining(deadline, status);

    return (
        <div
            className={classNames(
                'card-primary hover:bg-primary-900 hover:cursor-pointer transition-colors',
                bgColour,
                textColour
            )}
            onClick={handleView}
        >
            <div className="flex flex-col justify-between gap-2">
                <div className="flex flex-wrap justify-between">
                    <h3 className="text-lg font-bold">{name}</h3>
                    <h3 className="text-lg font-bold">
                        {(status === ItemStatus.COMPLETE &&
                            mark &&
                            mark.toFixed(0)) ||
                            '--'}{' '}
                        / {goal} %
                    </h3>
                </div>

                <div className="flex justify-between items-end">
                    <h4>
                        <b>Deadline:</b> {formatter.format(deadline.toDate())}
                    </h4>
                    <StatusChip status={timeRemaining.status}></StatusChip>
                </div>
            </div>
        </div>
    );
}
