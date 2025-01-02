import {
    DateValue,
    ZonedDateTime,
} from '@internationalized/date';
import {
    DatePicker,
    Input,
    Listbox,
    ListboxItem,
    Textarea,
} from '@nextui-org/react';
import { Fragment, Key, useEffect } from 'react';

import {
    ItemStatus,
    DeliverableFormProps,
} from '@coursefull';
import { classNames, createStatusObjects, onStatusChanged } from '@lib/helpers';
import { DeliverableSchema, deliverableSchema } from '@lib/validation';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

export default function DeliverableForm({
    deliverable,
    setDeliverable,
    setIsValid
}: DeliverableFormProps) {
    const statusObjects = createStatusObjects([
        ItemStatus.ACTIVE,
        ItemStatus.COMPLETE,
    ]);

    const {
        register,
        setValue,
        formState: { errors, isValid },
        control,
    } = useForm<DeliverableSchema>({
        resolver: zodResolver(deliverableSchema),
        defaultValues: deliverable,
    });

    const updateName = (name: string) => {
        setValue('name', name, { shouldValidate: true });
        setDeliverable((deliverable) => ({
            ...deliverable,
            name,
        }));
    };

    const updateStartDate = (startDateValue: DateValue) => {
        const start_date: ZonedDateTime = startDateValue as ZonedDateTime;
        setValue('start_date', start_date, { shouldValidate: true });
        setDeliverable((deliverable) => ({
            ...deliverable,
            start_date,
        }));
    };

    const updateDeadline = (deadlineValue: DateValue) => {
        const deadline: ZonedDateTime = deadlineValue as ZonedDateTime;
        setValue('deadline', deadline, { shouldValidate: true });
        setDeliverable((deliverable) => ({
            ...deliverable,
            deadline,
        }));
    };

    const updateWeight = (weightValue: string) => {
        const weight: number = parseFloat(weightValue);
        setValue('weight', weight, { shouldValidate: true });
        setDeliverable((deliverable) => ({
            ...deliverable,
            weight,
        }));
    };

    const updateMark = (markValue: string) => {
        const mark: number = parseFloat(markValue);
        setValue('mark', mark, { shouldValidate: true });
        setDeliverable((deliverable) => ({
            ...deliverable,
            mark,
        }));
    };

    const updateStatus = (newStatus: Key) => {
        let mark = deliverable.mark;
        if (newStatus === ItemStatus.ACTIVE) {
            mark = 0;
        }
        setValue('mark', mark, { shouldValidate: true });
        onStatusChanged(newStatus, (status) => {
            setValue('status', status, { shouldValidate: true });
            setDeliverable((deliverable) => ({
                ...deliverable,
                mark,
                status,
            }));
        });
    };

    const updateNotes = (notes: string) => {
        setValue('notes', notes, { shouldValidate: true });
        setDeliverable((deliverable) => ({
            ...deliverable,
            notes,
        }));
    };

    useEffect(() => {
        setIsValid(isValid);
    }, [setIsValid, isValid]);

    return (
        <Fragment>
            <Input
                type="text"
                label="Name"
                placeholder="What's the name of the deliverable?"
                {...register('name')}
                onValueChange={updateName}
                isInvalid={!!errors.name}
                errorMessage={errors.name?.message}
            />
            <div className="flex w-full flex-wrap gap-4">
                <Controller
                    control={control}
                    name="start_date"
                    render={({ field }) => (
                        <DatePicker
                            label="Start Date"
                            value={field.value}
                            onChange={(date) => {
                                updateStartDate(date);
                                field.onChange(date);
                            }}
                            isInvalid={!!errors.start_date}
                            errorMessage={errors.start_date?.message}
                            granularity="minute"
                        />
                    )}
                />
                <Controller
                    control={control}
                    name="deadline"
                    render={({ field }) => (
                        <DatePicker
                            label="Deadline"
                            value={field.value}
                            onChange={(date) => {
                                updateDeadline(date);
                                field.onChange(date);
                            }}
                            errorMessage={
                                errors.root?.message || errors.deadline?.message
                            }
                            isInvalid={!!errors.root || !!errors.deadline}
                            granularity="minute"
                        />
                    )}
                />
            </div>
            <Input
                type="number"
                label="Weight (%)"
                placeholder="How much is it worth?"
                {...register('weight')}
                onValueChange={updateWeight}
                errorMessage={errors.weight?.message}
                isInvalid={!!errors.weight}
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
                    {...register('mark')}
                    onValueChange={updateMark}
                    errorMessage={errors.mark?.message}
                    isInvalid={!!errors.mark}
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
                {...register('notes')}
                onValueChange={updateNotes}
                errorMessage={errors.notes?.message}
                isInvalid={!!errors.notes}
            />
        </Fragment>
    );
}
