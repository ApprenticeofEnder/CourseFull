import { Deliverable } from '@/lib/types';
import Button from '@/components/Button/Button';
import { PencilIcon } from '@heroicons/react/24/outline';
import { ItemStatus } from '@/lib/enums';
import { ReadableStatus, classNames } from '@/lib/helpers';

interface DeliverableCardProps extends Deliverable {
    handleEdit: () => void;
}

export default function DeliverableCard({
    id,
    name,
    mark,
    weight,
    status,
    goal,
    handleEdit,
}: DeliverableCardProps) {
    let bgColour = 'bg-primary-800';
    if (!goal || goal == 0 || status !== ItemStatus.COMPLETE) {
        //mostly so TypeScript doesn't freak out
    } else if (mark > goal) {
        bgColour = 'bg-success-200';
    } else if (mark == goal) {
        bgColour = 'bg-warning-200';
    } else if (mark < goal) {
        bgColour = 'bg-danger-200';
    }
    return (
        <div
            className={classNames(
                bgColour,
                'rounded-lg p-2 border-solid border-2 border-primary-500/10 font-bold'
            )}
        >
            <div className="flex justify-between">
                <div className="flex flex-col justify-between gap-2">
                    <h3 className="text-lg">
                        {name} ({weight}%)
                    </h3>
                    <h4>{ReadableStatus(status)}</h4>
                </div>

                <div className="flex flex-col justify-between gap-2 w-32">
                    <h4 className="px-2 flex justify-between">
                        <span>
                            {(status === ItemStatus.COMPLETE && mark) || '--'}%
                        </span>
                        <span>/</span>
                        <span>{goal}%</span>
                    </h4>
                    <Button
                        endContent={
                            <PencilIcon className="h-6 w-6"></PencilIcon>
                        }
                        onPressEnd={handleEdit}
                    >
                        Edit
                    </Button>
                </div>
            </div>
        </div>
    );
}
