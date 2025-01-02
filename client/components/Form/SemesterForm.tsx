import { Input, Listbox, ListboxItem } from '@nextui-org/react';
import { Fragment, Key, useEffect } from 'react';

import { ItemStatus, SemesterFormProps } from '@coursefull';
import { classNames, createStatusObjects, onStatusChanged } from '@lib/helpers';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { semesterSchema, SemesterSchema } from '@lib/validation';

export default function SemesterForm({
    semester,
    setSemester,
    setIsValid
}: SemesterFormProps) {
    const statusObjects = createStatusObjects([
        ItemStatus.NOT_STARTED,
        ItemStatus.ACTIVE,
        ItemStatus.COMPLETE,
    ]);

    const {
        register,
        setValue,
        formState: { errors, isValid },
        control,
    } = useForm<SemesterSchema>({
        resolver: zodResolver(semesterSchema),
        defaultValues: semester,
    });

    const updateName = (name: string) => {
        setValue('name', name, { shouldValidate: true });
        setSemester((semester) => ({ ...semester, name }));
    };

    const updateGoal = (goalValue: string) => {
        const goal: number = parseFloat(goalValue);
        setValue('goal', goal, { shouldValidate: true });
        setSemester((semester) => ({ ...semester, goal }));
    };

    const updateStatus = (newStatus: Key) => {
        onStatusChanged(newStatus, (status) => {
            setValue('status', status, { shouldValidate: true });
            setSemester((semester) => ({
                ...semester,
                status,
            }));
        });
    };

    useEffect(() => {
        setIsValid(isValid);
    }, [setIsValid, isValid]);

    return (
        <Fragment>
            <Input
                type="text"
                label="Semester Name"
                placeholder="e.g. Fall 2024..."
                {...register('name')}
                onValueChange={updateName}
                isInvalid={!!errors.name}
                errorMessage={errors.name?.message}
                data-testid="semester-name"
            />
            <Input
                type="number"
                label="Goal (%)"
                placeholder="Semester Goal"
                {...register('goal')}
                onValueChange={updateGoal}
                isInvalid={!!errors.goal}
                errorMessage={errors.goal?.message}
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
