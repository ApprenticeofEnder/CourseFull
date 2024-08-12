import { Deliverable } from '@/coursefull.d';
import Button from '@/components/Button/Button';
import { PencilIcon } from '@heroicons/react/24/outline';
import { ItemStatus } from '@/coursefull.d';
import {
    ReadableStatus,
    classNames,
    determineGradeBGColour,
    determineGradeTextColour,
} from '@/lib/helpers';

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
    let textColour = '';
    if (!goal || goal == 0 || status !== ItemStatus.COMPLETE) {
        //mostly so TypeScript doesn't freak out
    } else {
        bgColour = determineGradeBGColour(goal, mark);
        textColour = determineGradeTextColour(goal, mark);
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
                        {name} ({weight}%)
                    </h3>
                    <div className="flex flex-col gap-4">
                        <h4 className="font-bold basis-3/4">
                            {(status === ItemStatus.COMPLETE && mark) || '--'} /{' '}
                            {goal} %
                        </h4>
                        <h4 className="italic">{ReadableStatus(status)}</h4>
                    </div>
                </div>

                <div className="flex flex-col justify-center gap-2 w-32">
                    <Button
                        endContent={
                            <PencilIcon className="h-6 w-6"></PencilIcon>
                        }
                        onPressEnd={handleEdit}
                        className="top-1"
                    >
                        Edit
                    </Button>
                </div>
            </div>
        </div>
    );
}
