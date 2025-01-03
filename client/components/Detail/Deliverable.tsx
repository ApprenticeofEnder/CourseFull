import { useDateFormatter } from '@react-aria/i18n';
import { differenceInDays, setDay } from 'date-fns';

import Button from '@components/Button/Button';
import {
    DeletableProps,
    Deliverable,
    EditableProps,
    ExitProps,
    ItemStatus,
    SessionProps,
    Updated,
} from '@coursefull';
import { PencilIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { classNames } from '@lib/helpers';
import { deleteDeliverable } from '@services/deliverableService';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
    useTimeRemaining,
    useGradeColours,
} from '@lib/hooks/ui';
import StatusChip from '@components/Chip/StatusChip';
import { Divider } from '@nextui-org/react';

interface DeliverableDetailProps
    extends DeletableProps,
        EditableProps,
        ExitProps,
        SessionProps {
    deliverable: Updated<Deliverable>;
}

export default function DeliverableDetail({
    deliverable: {
        id,
        name,
        start_date,
        deadline,
        status,
        goal,
        weight,
        mark,
        notes,
        api_v1_course_id,
    },
    session,
    handleEdit,
    handleExit,
    handleDelete,
}: DeliverableDetailProps) {
    let formatter = useDateFormatter({
        dateStyle: 'short',
        timeStyle: 'short',
    });

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

    const { bgColour, textColour } = useGradeColours(goal, mark, status);

    const timeRemaining = useTimeRemaining(deadline, status);

    return (
        <div
            className={classNames(
                'card-primary h-full flex flex-col gap-2',
                bgColour,
                textColour
            )}
        >
            <div className="flex justify-between items-start">
                <h2 className="text-left flex flex-col justify-start gap-2">
                    <span>{name}</span>{' '}
                    <StatusChip status={timeRemaining.status} />
                </h2>
                <Button
                    endContent={<XMarkIcon className="h-6 w-6" />}
                    onPressEnd={handleExit}
                    className="top-1"
                />
            </div>
            <div className="grid grid-cols w-full gap-x-4 !text-lg">
                <h4>Grade:</h4>
                <h4 className="text-right">
                    <span className="sr-only">Your grade is</span>
                    {mark !== undefined && status == ItemStatus.COMPLETE
                        ? mark.toFixed(1)
                        : '--'}{' '}
                    %
                </h4>
                <h4>Goal:</h4>
                <h4 className="text-right">
                    <span className="sr-only">Your goal is</span>
                    {goal!.toFixed(1)} %
                </h4>
                <h4>Weight:</h4>
                <h4 className="text-right">
                    {weight && weight.toFixed(1)} %
                </h4>
                <Divider className="my-2 col-span-2"></Divider>
                <h4>Time Remaining:</h4>
                <h4 className="text-right">{timeRemaining.message}</h4>
                <h4>Deadline:</h4>
                <h4 className="text-right">
                    {formatter.format(deadline.toDate())}
                </h4>
                <h4>Start Date:</h4>
                <h4 className="text-right">
                    {formatter.format(start_date.toDate())}
                </h4>
            </div>
            <Divider className="my-2"></Divider>
            <div>
                {notes ||
                    'No notes for this deliverable. Might be a good time to add anything important!'}
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mt-10">
                <Button
                    endContent={<PencilIcon className="h-6 w-6" />}
                    onPressEnd={handleEdit}
                    className="top-1 w-fit sm:basis-1/2"
                >
                    <span className="hidden sm:inline">Edit</span>
                </Button>
                <Button
                    endContent={<TrashIcon className="h-6 w-6" />}
                    onPressEnd={() => {
                        deliverableDelete.mutate(id);
                    }}
                    className="top-1 w-fit sm:basis-1/2"
                    buttonType="danger"
                >
                    <span className="hidden sm:inline">Delete</span>
                </Button>
            </div>
        </div>
    );
}
