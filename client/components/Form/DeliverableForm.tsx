import { DateValue, ZonedDateTime } from '@internationalized/date';
import {
    DatePicker,
    Input,
    Listbox,
    ListboxItem,
    Textarea,
} from '@nextui-org/react';
import { Fragment, Key, useEffect, useState } from 'react';

import {
    ItemStatus,
    DeliverableFormProps,
    DeliverableFormErrors,
} from '@coursefull';
import { classNames, createStatusObjects, onStatusChanged } from '@lib/helpers';
import { ZodIssue } from 'zod';

export default function DeliverableForm({
    deliverable,
    setDeliverable,
    zodError,
}: DeliverableFormProps) {
    const statusObjects = createStatusObjects([
        ItemStatus.ACTIVE,
        ItemStatus.COMPLETE,
    ]);

    const updateName = (name: string) => {
        setDeliverable((deliverable) => ({
            ...deliverable,
            name,
        }));
    };

    const updateStartDate = (start_date: DateValue) => {
        setDeliverable((deliverable) => ({
            ...deliverable,
            start_date: start_date as ZonedDateTime,
        }));
    };

    const updateDeadline = (deadline: DateValue) => {
        setDeliverable((deliverable) => ({
            ...deliverable,
            deadline: deadline as ZonedDateTime,
        }));
    };

    const updateWeight = (weight: string) => {
        setDeliverable((deliverable) => ({
            ...deliverable,
            weight: parseFloat(weight),
        }));
    };

    const updateMark = (mark: string) => {
        setDeliverable((deliverable) => ({
            ...deliverable,
            mark: parseFloat(mark),
        }));
    };

    const updateStatus = (newStatus: Key) => {
        let mark: string = deliverable.mark.toString();
        if (newStatus === ItemStatus.ACTIVE) {
            mark = '0';
        }
        onStatusChanged(newStatus, (status) => {
            setDeliverable((deliverable) => ({
                ...deliverable,
                mark: parseFloat(mark),
                status,
            }));
        });
    };

    const updateNotes = (notes: string) => {
        setDeliverable((deliverable) => ({
            ...deliverable,
            notes,
        }));
    };

    const getLastErrorMessage = (issues: ZodIssue[]) => {
        return issues.slice(-1).pop()?.message;
    };

    const [errors, setErrors] = useState<DeliverableFormErrors>({
        name: [],
        start_date: [],
        deadline: [],
        weight: [],
        mark: [],
        status: [],
        notes: [],
        custom: [],
    });

    useEffect(() => {
        console.log(zodError);
        let updatedErrors: DeliverableFormErrors = {
            name: [],
            start_date: [],
            deadline: [],
            weight: [],
            mark: [],
            status: [],
            notes: [],
            custom: [],
        };
        for (let issue of zodError?.issues || []) {
            issue.path.forEach((field) => {
                if (!updatedErrors[field as keyof DeliverableFormErrors]) {
                    return;
                }
                updatedErrors[field as keyof DeliverableFormErrors].push(issue);
            });
            if (issue.code === 'custom') {
                updatedErrors.custom.push(issue);
            }
        }
        setErrors(updatedErrors);
    }, [zodError]);

    return (
        <Fragment>
            <Input
                type="text"
                label="Name"
                placeholder="What's the name of the deliverable?"
                value={deliverable.name}
                onValueChange={updateName}
                isInvalid={errors.name.length > 0}
                errorMessage={getLastErrorMessage(errors.name)}
            />
            <div className="flex w-full flex-wrap gap-4">
                <DatePicker
                    label="Start Date"
                    value={deliverable.start_date}
                    onChange={updateStartDate}
                    isInvalid={errors.start_date.length > 0}
                    errorMessage={getLastErrorMessage(errors.start_date)}
                    granularity="minute"
                />

                <DatePicker
                    label="Deadline"
                    value={deliverable.deadline}
                    onChange={updateDeadline}
                    errorMessage={
                        getLastErrorMessage(errors.custom) ||
                        getLastErrorMessage(errors.deadline)
                    }
                    isInvalid={
                        errors.custom.length > 0 || errors.deadline.length > 0
                    }
                    granularity="minute"
                />
            </div>
            <Input
                type="number"
                label="Weight (%)"
                placeholder="How much is it worth?"
                value={deliverable.weight.toString()}
                onValueChange={updateWeight}
                errorMessage={getLastErrorMessage(errors.weight)}
                isInvalid={errors.weight.length > 0}
                min={0.1}
                max={100}
                step={0.1}
            />
            {deliverable.status === ItemStatus.ACTIVE ? (
                <p>
                    <strong>Hint:</strong>{' '}
                    {'Set the status to "Complete" to set the mark!'}
                </p>
            ) : (
                <Input
                    type="number"
                    label="Mark (%)"
                    placeholder="What was the final grade?"
                    value={deliverable.mark.toString()}
                    onValueChange={updateMark}
                    errorMessage={getLastErrorMessage(errors.mark)}
                    isInvalid={errors.mark.length > 0}
                    min={0}
                    max={100}
                    step={0.1}
                />
            )}
            <Listbox
                items={statusObjects}
                label="Status"
                topContent="Status"
                aria-label="Status"
                onAction={updateStatus}
                itemClasses={{ base: 'data-[hover=true]:bg-primary-700 p-4' }}
            >
                {(item) => (
                    <ListboxItem
                        key={item.key}
                        className={classNames(
                            deliverable.status === item.key
                                ? 'bg-primary-600'
                                : ''
                        )}
                    >
                        <span
                            className={
                                deliverable.status === item.key
                                    ? 'font-bold'
                                    : ''
                            }
                        >
                            {item.label}
                        </span>
                    </ListboxItem>
                )}
            </Listbox>
            <Textarea
                label="Notes"
                placeholder={
                    deliverable.status === ItemStatus.COMPLETE
                        ? "What went well with this deliverable?\n\nIf you didn't get the grade you wanted, what could make future ones go better?"
                        : "What's important about this particular deliverable?"
                }
                value={deliverable.notes}
                onValueChange={updateNotes}
                errorMessage={getLastErrorMessage(errors.notes)}
                isInvalid={errors.notes.length > 0}
            />
        </Fragment>
    );
}
