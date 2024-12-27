import { Fragment, Key } from 'react';
import { Input, Listbox, ListboxItem } from '@nextui-org/react';

import { ItemStatus, CourseFormProps } from '@coursefull';
import { classNames, createStatusObjects, onStatusChanged } from '@lib/helpers';

export default function CourseForm({ course, setCourse }: CourseFormProps) {
    const statusObjects = createStatusObjects([
        ItemStatus.ACTIVE,
        ItemStatus.COMPLETE,
    ]);

    //TODO: Add client side validation

    const updateTitle = (title: string) => {
        setCourse((course) => ({ ...course, title }));
    };

    const updateCourseCode = (course_code: string) => {
        setCourse((course) => ({ ...course, course_code }));
    };

    const updateStatus = (newStatus: Key) => {
        onStatusChanged(newStatus, (status) => {
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
                label="Course Title"
                placeholder="e.g. Introduction to Psychology..."
                value={course.title}
                onValueChange={updateTitle}
            />
            <Input
                type="text"
                label="Course Code"
                placeholder="e.g PSYC 1001..."
                value={course.course_code}
                onValueChange={updateCourseCode}
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
                            className={course.status === item.key ? 'font-bold' : ''}
                        >
                            {item.label}
                        </span>
                    </ListboxItem>
                )}
            </Listbox>
        </Fragment>
    );
}
