import { Fragment, Key, useState } from 'react';
import { Input, Listbox, ListboxItem } from '@nextui-org/react';

import { ItemStatus, CourseFormProps, CourseFormErrors } from '@coursefull';
import { classNames, createStatusObjects, onStatusChanged } from '@lib/helpers';
import { useForm } from 'react-hook-form';
import { CourseSchema, deliverableSchema } from '@lib/validation';
import { zodResolver } from '@hookform/resolvers/zod';

export default function CourseForm({ course, setCourse }: CourseFormProps) {
    const statusObjects = createStatusObjects([
        ItemStatus.ACTIVE,
        ItemStatus.COMPLETE,
    ]);

    //TODO: Add client side validation

    const {
        register,
        setValue,
        formState: { errors },
        control,
    } = useForm<CourseSchema>({
        resolver: zodResolver(deliverableSchema),
        defaultValues: course,
    });

    const updateTitle = (title: string) => {
        setValue('title', title, { shouldValidate: true });
        setCourse((course) => ({ ...course, title }));
    };

    const updateCourseCode = (course_code: string) => {
        setValue('course_code', course_code, { shouldValidate: true });
        setCourse((course) => ({ ...course, course_code }));
    };

    const updateStatus = (newStatus: Key) => {
        onStatusChanged(newStatus, (status) => {
            setValue('status', status, {
                shouldValidate: true,
            });
            setCourse((course) => ({
                ...course,
                status,
            }));
        });
    };

    return (
        <Fragment>
            <Input
                type="text"
                label="Course Code"
                placeholder="e.g PSYC 1001..."
                {...register('course_code')}
                onValueChange={updateCourseCode}
                isInvalid={!!errors.course_code}
                errorMessage={errors.course_code?.message}
            />
            <Input
                type="text"
                label="Course Title"
                placeholder="e.g. Introduction to Psychology..."
                {...register('title')}
                onValueChange={updateTitle}
                isInvalid={!!errors.title}
                errorMessage={errors.title?.message}
            />
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
                            course.status === item.key ? 'bg-primary-600' : ''
                        )}
                        textValue={item.label}
                    >
                        <span
                            className={
                                course.status === item.key ? 'font-bold' : ''
                            }
                        >
                            {item.label}
                        </span>
                    </ListboxItem>
                )}
            </Listbox>
        </Fragment>
    );
}
