import { Deliverable } from '@/lib/types';
import Button from '@/components/Button/Button';
import { PencilIcon } from '@heroicons/react/24/outline';
import { ItemStatus } from '@/lib/enums';
import { ReadableStatus } from '@/lib/helpers';

export default function DeliverableCard({
    id,
    name,
    mark,
    weight,
    notes,
    status,
    goal,
}: Deliverable) {
    return (
        <div className="rounded-lg bg-primary-800 p-2 border-solid border-2 border-primary-500/10">
            <div className="flex justify-between">
                <div className="flex flex-col justify-between gap-2">
                    <h4>
                        {name} ({weight}%)
                    </h4>
                    <h4>{ReadableStatus(status)}</h4>
                </div>

                <div className="flex flex-col justify-between gap-2">
                    <h4>
                        {(status === ItemStatus.COMPLETE && mark) || '--'}% /{' '}
                        {goal}%
                    </h4>
                    <Button
                        endContent={
                            <PencilIcon className="h-6 w-6"></PencilIcon>
                        }
                    >
                        Edit
                    </Button>
                </div>
            </div>
        </div>
    );
}
