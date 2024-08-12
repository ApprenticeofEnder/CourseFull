import { Fragment } from 'react';
import { Input, Listbox, ListboxItem } from '@nextui-org/react';

import { ItemStatus } from '@coursefull';
import { classNames, createStatusObjects, onStatusChanged } from '@lib/helpers';

interface SemesterFormProps {
    name: string;
    setName: (name: string) => void;
    status: ItemStatus;
    setStatus: (name: ItemStatus) => void;
    goal: string;
    setGoal: (name: string) => void;
}

export default function SemesterForm({
    name,
    setName,
    goal,
    setGoal,
    status,
    setStatus,
}: SemesterFormProps) {
    const statusObjects = createStatusObjects([
        ItemStatus.NOT_STARTED,
        ItemStatus.ACTIVE,
        ItemStatus.COMPLETE,
    ]);

    //TODO: Add client side validation

    return (
        <Fragment>
            <Input
                type="text"
                label="Semester Name"
                placeholder="e.g. Fall 2024..."
                value={name}
                onValueChange={setName}
                data-testid="semester-name"
            />
            <Input
                type="number"
                label="Goal (%)"
                placeholder="Semester Goal"
                value={goal}
                onValueChange={setGoal}
                min={0}
                max={100}
            />
            <Listbox
                items={statusObjects}
                label="Status"
                topContent="Status"
                aria-label="Status"
                onAction={(newStatus) => {
                    onStatusChanged(newStatus, setStatus);
                }}
                data-testid="semester-status"
            >
                {(item) => (
                    <ListboxItem
                        key={item.key}
                        className={classNames(
                            status === item.key ? 'bg-primary-600' : ''
                        )}
                    >
                        <span
                            className={status === item.key ? 'font-bold' : ''}
                            data-testid={`semester-status-${item.key}`}
                        >
                            {item.label}
                        </span>
                    </ListboxItem>
                )}
            </Listbox>
        </Fragment>
    );
}
