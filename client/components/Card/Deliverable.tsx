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
        DeletableProps,
        EditableProps,
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
    handleEdit,
    handleDelete,
}: DeliverableCardProps) {
    let formatter = useDateFormatter({ dateStyle: 'short' });

    const queryClient = useQueryClient();
    const deliverableDelete = useMutation({
        mutationFn: (id: string) => {
            const confirmDelete = confirm(
                `Are you sure you want to delete ${name}?`
            );
            if (!confirmDelete) {
                return Promise.resolve();
            }
            return deleteDeliverable(id, session);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['course', api_v1_course_id!],
            });
            queryClient.invalidateQueries({
                queryKey: ['deliverable', id],
            });
            handleDelete();
        },
    });
    if (deliverableDelete.error) {
        throw deliverableDelete.error;
    }

    const {
        bgColour,
        textColour
    } = useMemo(()=>{
        if (!goal || goal == 0 || status !== ItemStatus.COMPLETE) {
            return {
                bgColour: 'bg-primary-800',
                textColour: 'text-text'
            }
        } else {
            return {
                bgColour: determineGradeBGColour(goal, mark),
                textColour: determineGradeTextColour(goal, mark)
            }
        }
    },[goal, mark, status])

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

    async function handleDeleteDeliverable() {
        const confirmDelete = confirm(
            `Are you sure you want to delete ${name}?`
        );
        if (!confirmDelete) {
            return;
        }
        await deleteDeliverable(id!, session);
        handleDelete();
    }

    return (
        <div className={classNames('card-primary', bgColour)}>
            <div className="flex flex-col justify-between gap-2">
                <div className="flex justify-between">
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
                        <h4>
                            <b>Status:</b>{' '}
                            <span
                                className={classNames(
                                    overdue ? 'text-danger-400' : ''
                                )}
                            >
                                {statusText}
                            </span>
                        </h4>
                        <h4>
                            <b>Start Date:</b>{' '}
                            {formatter.format(start_date.toDate())}
                        </h4>
                        <h4>
                            <b>Deadline:</b>{' '}
                            {formatter.format(deadline.toDate())}
                        </h4>
                        <h4>
                            <b>Weight:</b> {weight && weight.toFixed(1)}%
                        </h4>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            endContent={<PencilIcon className="h-6 w-6" />}
                            onPressEnd={handleEdit}
                            className="top-1"
                        >
                            <span className="hidden sm:inline">Edit</span>
                        </Button>
                        <Button
                            endContent={<TrashIcon className="h-6 w-6" />}
                            onPressEnd={()=>{
                                deliverableDelete.mutate(id);
                            }}
                            className="top-1"
                            buttonType="danger"
                        >
                            <span className="hidden sm:inline">Delete</span>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
