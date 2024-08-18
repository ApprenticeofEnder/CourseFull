'use client';
import { Image } from '@nextui-org/react';

import { Course, DeletableProps, EditableProps } from '@coursefull';

import LinkButton from '@components/Button/LinkButton';
import Button from '@components/Button/Button';
import Link from '@components/Link';

import {
    ReadableStatus,
    classNames,
    courseURL,
    determineGradeBGColour,
} from '@lib/helpers';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

interface CourseCardProps extends Course, DeletableProps, EditableProps {}

export default function CourseCard({
    id,
    title,
    course_code,
    status,
    goal,
    grade,
    handleEdit,
    handleDelete,
}: CourseCardProps) {
    const [deleteLoading, setDeleteLoading] = useState(false);

    let bgColour = 'bg-primary-800';
    if (goal === undefined || grade === undefined || grade === 0) {
        //mostly so TypeScript doesn't freak out
    } else {
        bgColour = determineGradeBGColour(goal, grade);
    }
    return (
        <div
            className={classNames(
                'rounded-lg p-2 border-solid border-2 border-primary-500/10',
                bgColour
            )}
        >
            <div className="flex justify-between">
                <h4>Goal: {goal}%</h4>
                <h4>Grade: {grade || '--'}%</h4>
            </div>
            <div className="flex justify-center">
                <Image
                    width={300}
                    alt="NextUI hero Image"
                    src={''}
                    // isLoading={true}
                />
            </div>

            <Link href={courseURL(id)} color="foreground" underline="hover">
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
                    onPressEnd={() => {
                        setDeleteLoading(true);
                        handleDelete();
                    }}
                    buttonType="danger"
                    isLoading={deleteLoading}
                >
                    Delete
                </Button>
            </div>
        </div>
    );
}
