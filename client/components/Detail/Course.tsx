'use client';
import { Divider, Image } from '@nextui-org/react';

import {
    Course,
    DeletableProps,
    EditableProps,
    ExitProps,
    ItemStatus,
    SessionProps,
    Updated,
} from '@coursefull';

import Button from '@components/Button/Button';

import {
    ArrowRightIcon,
    CheckIcon,
    PencilIcon,
    TrashIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline';
import { classNames, courseURL } from '@lib/helpers';
import { useRouter } from 'next/navigation';
import StatusChip from '@components/Chip/StatusChip';
import { useGradeColours } from '@lib/hooks/ui';
import { useCourseComplete, useCourseDelete, useCourseQuery } from '@lib/query/course';

interface CourseDetailProps
    extends DeletableProps,
        EditableProps,
        ExitProps,
        SessionProps {
    course: Updated<Course>;
}

export default function CourseDetail({
    course,
    session,
    handleExit,
    handleEdit,
    handleDelete,
}: CourseDetailProps) {
    const { id, title, course_code, status, goal, grade, api_v1_semester_id } =
        course;
    const { data: courseData } = useCourseQuery(id, session);
    const deliverables = courseData?.deliverables || [];

    const courseComplete = useCourseComplete(id, api_v1_semester_id!, session);

    const courseDelete = useCourseDelete(
        id,
        course_code,
        api_v1_semester_id!,
        session
    );

    const router = useRouter();

    const { bgColour, textColour } = useGradeColours(goal, grade);

    const href = courseURL(id);

    return (
        <div
            className={classNames(
                'card-primary h-full flex flex-col gap-2',
                bgColour,
                textColour
            )}
        >
            <div className="flex justify-between items-start">
                <h2 className="text-left flex flex-col justify-start gap-2">
                    <span>{course_code}</span>
                    <StatusChip status={status} />
                </h2>
                <Button
                    endContent={<XMarkIcon className="h-6 w-6" />}
                    onPressEnd={handleExit}
                />
            </div>
            <h3 className="text-left">{title}</h3>
            <div className="grid grid-cols-2 min-w-fit w-1/4 !text-lg">
                <h4>Grade:</h4>
                <h4 className="text-right">
                    <span className="sr-only">Your grade is</span>
                    {grade !== undefined &&
                    deliverables.filter((deliverable) => {
                        return deliverable.status == ItemStatus.COMPLETE;
                    }).length > 0
                        ? grade.toFixed(1)
                        : '--'}{' '}
                    %
                </h4>
                <h4>Goal:</h4>
                <h4 className="text-right">
                    <span className="sr-only">Your goal is</span>
                    {goal!.toFixed(1)} %
                </h4>
                <h4>Deliverables:</h4>
                <h4 className="text-right">{deliverables.length}</h4>
            </div>
            <div className="flex flex-col gap-4 sm:mt-10">
                <Button
                    endContent={<ArrowRightIcon className="h-6 w-6" />}
                    onPressEnd={() => {
                        router.push(href);
                    }}
                >
                    Enter Course
                </Button>
                <Divider></Divider>
                <Button
                    endContent={<CheckIcon className="h-6 w-6" />}
                    onPressEnd={() => {
                        courseComplete.mutate(course);
                    }}
                >
                    Mark Completed
                </Button>
                <Button
                    endContent={<PencilIcon className="h-6 w-6" />}
                    onPressEnd={handleEdit}
                >
                    Edit
                </Button>
                <Button
                    endContent={<TrashIcon className="h-6 w-6" />}
                    onPressEnd={() => {
                        courseDelete.mutate(id);
                        handleDelete();
                    }}
                    buttonType="danger"
                    isLoading={courseDelete.isPending}
                >
                    Delete
                </Button>
            </div>
        </div>
    );
}
