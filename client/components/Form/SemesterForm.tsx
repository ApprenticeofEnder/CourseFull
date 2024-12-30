import { Input, Listbox, ListboxItem } from '@nextui-org/react';
import { Fragment, Key } from 'react';

import { ItemStatus, SemesterFormProps } from '@coursefull';
import { classNames, createStatusObjects, onStatusChanged } from '@lib/helpers';

export default function SemesterForm({
    semester,
    setSemester,
}: SemesterFormProps) {
    const statusObjects = createStatusObjects([
        ItemStatus.NOT_STARTED,
        ItemStatus.ACTIVE,
        ItemStatus.COMPLETE,
    ]);

    //TODO: Add client side validation

    const updateName = (name: string) => {
        setSemester((semester) => ({ ...semester, name }));
    };

    const updateGoal = (goal: string) => {
        setSemester((semester) => ({ ...semester, goal: parseFloat(goal) }));
    };

    const updateStatus = (newStatus: Key) => {
        onStatusChanged(newStatus, (status) => {
            setSemester((semester) => ({
                ...semester,
                status,
            }));
        });
    };

    return (
        <Fragment>
            <Input
                type="text"
                label="Semester Name"
                placeholder="e.g. Fall 2024..."
                value={semester.name}
                onValueChange={updateName}
                data-testid="semester-name"
            />
            <Input
                type="number"
                label="Goal (%)"
                placeholder="Semester Goal"
                value={semester.goal.toString()}
                onValueChange={updateGoal}
                min={0}
                max={100}
                step={0.5}
            />
            <Listbox
                items={statusObjects}
                label="Status"
                topContent="Status"
                aria-label="Status"
                onAction={updateStatus}
                data-testid="semester-status"
                itemClasses={{ base: 'data-[hover=true]:bg-primary-700 p-4' }}
            >
                {(item) => (
                    <ListboxItem
                        key={item.key}
                        className={classNames(
                            semester.status === item.key ? 'bg-primary-600' : ''
                        )}
                        textValue={item.label}
                    >
                        <span
                            className={
                                semester.status === item.key ? 'font-bold' : ''
                            }
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
