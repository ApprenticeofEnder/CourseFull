'use client';
import { Image } from '@nextui-org/react';

import {
    Course,
    DeletableProps,
    EditableProps,
    SessionProps,
} from '@coursefull';

import Button from '@components/Button/Button';
import Link from '@components/Link';

import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import {
    ReadableStatus,
    classNames,
    courseURL,
    determineGradeBGColour,
} from '@lib/helpers';
import { deleteCourse } from '@services/courseService';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface CourseCardProps
    extends Course,
        DeletableProps,
        EditableProps,
        SessionProps {}

export default function CourseCard({
    id,
    title,
    course_code,
    status,
    goal,
    grade,
    session,
    handleEdit,
    handleDelete,
}: CourseCardProps) {
    const router = useRouter();

    const [deleteLoading, setDeleteLoading] = useState(false);

    async function handleDeleteCourse() {
        const confirmDelete = confirm(
            `Are you sure you want to delete ${course_code}? All of its deliverables will be deleted, and you will not get a refund for the course ticket you used to buy it.`
        );
        if (!confirmDelete) {
            return;
        }
        setDeleteLoading(true);
        await deleteCourse(id!, session);
        handleDelete();
    }

    let bgColour = 'bg-primary-800';
    if (goal === undefined || grade === undefined || grade === 0) {
        //mostly so TypeScript doesn't freak out
    } else {
        bgColour = determineGradeBGColour(goal, grade);
    }

    const href = courseURL(id);

    return (
        <div
            className={classNames(
                'card-primary hover:bg-primary-900 hover:cursor-pointer transition-colors',
                bgColour
            )}
            onClick={() => {
                router.push(href);
            }}
        >
            <div className="flex justify-between">
                <h4>Goal: {goal}%</h4>
                <h4>Grade: {(grade && Math.round(grade)) || '--'}%</h4>
            </div>
            <div className="flex justify-center">
                <Image
                    width={300}
                    alt="NextUI hero Image"
                    src={''}
                    // isLoading={true}
                />
            </div>

            <Link href={href} color="foreground" underline="hover">
                <h3 className="text-left">{course_code}</h3>
            </Link>
            <h4 className="text-left">{title}</h4>
            <h4 className="text-left italic">{ReadableStatus(status)}</h4>

            <div className="flex my-2 gap-4">
                <Button
                    endContent={<PencilIcon className="h-6 w-6" />}
                    onPressEnd={handleEdit}
                    className="top-1 basis-1/2"
                >
                    Edit
                </Button>
                <Button
                    className="top-1 basis-1/2"
                    endContent={<TrashIcon className="h-6 w-6" />}
                    onPressEnd={handleDeleteCourse}
                    buttonType="danger"
                    isLoading={deleteLoading}
                >
                    Delete
                </Button>
            </div>
        </div>
    );
}
