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

    const { bgColour, textColour } = useMemo(() => {
        if (!goal || goal == 0 || status !== ItemStatus.COMPLETE) {
            return {
                bgColour: 'bg-primary-800',
                textColour: 'text-text',
            };
        } else {
            return {
                bgColour: determineGradeBGColour(goal, mark),
                textColour: determineGradeTextColour(goal, mark),
            };
        }
    }, [goal, mark, status]);

    const { statusText, overdue } = useMemo(() => {
        const incomplete = status !== ItemStatus.COMPLETE;
        const deadlinePassed = deadline < now(getLocalTimeZone());
        if (incomplete && deadlinePassed) {
            return {
                statusText: 'Overdue',
                overdue: true,
            };
        }
        return {
            statusText: ReadableStatus(status),
            overdue: false,
        };
    }, [status, deadline]);

    return (
        <div className={classNames('card-primary hover:bg-primary-900 hover:cursor-pointer transition-colors', bgColour)} onClick={handleView}>
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
                    <div>
                        <h4
                            className={classNames(
                                overdue ? 'text-danger-400' : ''
                            )}
                        >
                            {statusText}
                        </h4>
                        <h4>
                            <b>Deadline:</b> {formatter.format(deadline.toDate())}
                        </h4>
                    </div>
                </div>
            </div>
        </div>
    );
}
