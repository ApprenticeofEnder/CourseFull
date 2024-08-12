import { Fragment } from 'react';
import { Input, Listbox, ListboxItem, Textarea } from '@nextui-org/react';

import { ItemStatus } from '@/coursefull.d';
import {
    classNames,
    createStatusObjects,
    onStatusChanged,
} from '@/lib/helpers';

interface DeliverableFormProps {
    name: string;
    setName: (name: string) => void;
    status: ItemStatus;
    setStatus: (status: ItemStatus) => void;
    weight: string;
    setWeight: (weight: string) => void;
    mark: string;
    setMark: (mark: string) => void;
    notes: string;
    setNotes: (notes: string) => void;
}

export default function DeliverableForm({
    name,
    setName,
    weight,
    setWeight,
    status,
    setStatus,
    mark,
    setMark,
    notes,
    setNotes,
}: DeliverableFormProps) {
    const statusObjects = createStatusObjects([
        ItemStatus.ACTIVE,
        ItemStatus.COMPLETE,
    ]);

    //TODO: Add client side validation

    return (
        <Fragment>
            <Input
                type="text"
                label="Name"
                placeholder="What's the name of the deliverable?"
                value={name}
                onValueChange={setName}
            />
            <Input
                type="number"
                label="Weight (%)"
                placeholder="How much is it worth?"
                value={weight}
                onValueChange={setWeight}
                min={0}
                max={100}
            />
            <Textarea
                label="Notes"
                placeholder={
                    status === ItemStatus.COMPLETE
                        ? "What went well with this deliverable?\n\nIf you didn't get the grade you wanted, what could make future ones go better?"
                        : "What's important about this particular deliverable?"
                }
                value={notes}
                onValueChange={setNotes}
            />
            <Listbox
                items={statusObjects}
                label="Status"
                topContent="Status"
                aria-label="Status"
                onAction={(newStatus) => {
                    if (newStatus === ItemStatus.ACTIVE) {
                        setMark('0');
                    }
                    onStatusChanged(newStatus, setStatus);
                }}
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

            {status === ItemStatus.ACTIVE ? (
                <p>
                    <strong>Hint:</strong> Set the status to "Complete" to set
                    the mark!
                </p>
            ) : (
                <Input
                    type="number"
                    label="Mark (%)"
                    placeholder="What was the final grade?"
                    value={mark}
                    onValueChange={setMark}
                    min={0}
                    max={100}
                />
            )}
        </Fragment>
    );
}
