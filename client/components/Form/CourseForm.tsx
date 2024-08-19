import { Fragment } from 'react';
import { Input, Listbox, ListboxItem } from '@nextui-org/react';

import { ItemStatus } from '@coursefull';
import { classNames, createStatusObjects, onStatusChanged } from '@lib/helpers';

interface CourseFormProps {
    title: string;
    setTitle: (title: string) => void;
    code: string;
    setCode: (code: string) => void;
    status: ItemStatus;
    setStatus: (name: ItemStatus) => void;
}

export default function CourseForm({
    title,
    setTitle,
    code,
    setCode,
    status,
    setStatus,
}: CourseFormProps) {
    const statusObjects = createStatusObjects([
        ItemStatus.ACTIVE,
        ItemStatus.COMPLETE,
    ]);

    //TODO: Add client side validation

    return (
        <Fragment>
            <Input
                type="text"
                label="Course Title"
                placeholder="e.g. Introduction to Psychology..."
                value={title}
                onValueChange={setTitle}
            />
            <Input
                type="text"
                label="Course Code"
                placeholder="e.g PSYC 1001..."
                value={code}
                onValueChange={setCode}
            />
            <Listbox
                items={statusObjects}
                label="Status"
                topContent="Status"
                aria-label="Status"
                onAction={(newStatus) => {
                    onStatusChanged(newStatus, setStatus);
                }}
                itemClasses={{ base: 'data-[hover=true]:bg-primary-700 p-4' }}
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
                        >
                            {item.label}
                        </span>
                    </ListboxItem>
                )}
            </Listbox>
        </Fragment>
    );
}
