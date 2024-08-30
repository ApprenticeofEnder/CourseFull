import Button from '@components/Button/Button';
import {
    DeletableProps,
    Deliverable,
    EditableProps,
    ItemStatus,
    SessionProps,
} from '@coursefull';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import {
    ReadableStatus,
    classNames,
    determineGradeBGColour,
    determineGradeTextColour,
} from '@lib/helpers';
import { deleteDeliverable } from '@services/deliverableService';

interface DeliverableCardProps
    extends Deliverable,
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
    session,
    handleEdit,
    handleDelete,
}: DeliverableCardProps) {
    let bgColour = 'bg-primary-800';
    let textColour = '';
    if (!goal || goal == 0 || status !== ItemStatus.COMPLETE) {
        //mostly so TypeScript doesn't freak out
    } else {
        bgColour = determineGradeBGColour(goal, mark);
        textColour = determineGradeTextColour(goal, mark);
    }

    async function handleDeleteDeliverable() {
        const confirmDelete = confirm(
            `Are you sure you want to delete ${name}?`
        );
        if (!confirmDelete) {
            return;
        }
        const { success } = await deleteDeliverable(id!, session, (error) => {
            alert(`Something went wrong: ${error.message}`);
        });
        if (!success) {
            return;
        }
        handleDelete();
    }

    return (
        <div
            className={classNames(
                bgColour,
                'rounded-lg p-2 border-solid border-2 border-primary-500/10'
            )}
        >
            <div className="flex justify-between">
                <div className="flex flex-col justify-between basis-1/2">
                    <h3 className="text-lg text-left font-bold">
                        {name} ({weight && weight.toFixed(1)}%)
                    </h3>
                    <div className="flex flex-col gap-4">
                        <h4 className="font-bold basis-3/4">
                            {(status === ItemStatus.COMPLETE &&
                                mark &&
                                mark.toFixed(1)) ||
                                '--'}{' '}
                            / {goal} %
                        </h4>
                        <h4 className="italic">{ReadableStatus(status)}</h4>
                    </div>
                </div>

                <div className="flex flex-col justify-center">
                    <div className="flex flex-col sm:flex-row gap-2">
                        <Button
                            endContent={<PencilIcon className="h-6 w-6" />}
                            onPressEnd={handleEdit}
                            className="top-1"
                        >
                            <span className="hidden sm:inline">Edit</span>
                        </Button>
                        <Button
                            endContent={<TrashIcon className="h-6 w-6" />}
                            onPressEnd={handleDeleteDeliverable}
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
