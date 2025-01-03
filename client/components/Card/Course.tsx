'use client';
import { Image } from '@nextui-org/react';

import {
    Course,
    DeletableProps,
    EditableProps,
    SessionProps,
    Updated,
    ViewableProps,
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
import { useMemo, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useGradeColours } from '@lib/hooks/ui';
import StatusChip from '@components/Chip/StatusChip';

interface CourseCardProps
    extends Updated<Course>,
        ViewableProps,
        SessionProps {}

export default function CourseCard({
    id,
    title,
    course_code,
    status,
    goal,
    grade,
    handleView,
}: CourseCardProps) {
    const router = useRouter();

    const { bgColour, textColour } = useGradeColours(goal, grade);

    const href = courseURL(id);

    return (
        <div
            className={classNames(
                'card-primary hover:bg-primary-900 hover:cursor-pointer transition-colors flex flex-col gap-4 justify-between',
                bgColour,
                textColour
            )}
            onClick={(e) => {
                switch (e.detail) {
                    case 1:
                        setTimeout(handleView, 200);
                        break;
                    case 2:
                        router.push(href);
                        break;
                    default:
                        router.push(href);
                }
            }}
        >
            <div className="flex flex-col justify-between gap-2">
                <div className="flex flex-wrap justify-between">
                    <h3 className="text-lg font-bold">{course_code}</h3>
                    <h3 className="text-lg font-bold">
                        {(grade && Math.round(grade)) || '--'} / {goal} %
                    </h3>
                </div>

                <div className="flex justify-between items-end">
                    <h4>{title}</h4>
                    <StatusChip status={status}></StatusChip>
                </div>
            </div>
        </div>
    );
}
