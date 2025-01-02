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
    api_v1_semester_id,
    session,
    handleView,
}: CourseCardProps) {
    const router = useRouter();
    const queryClient = useQueryClient();
    const courseDelete = useMutation({
        mutationFn: (id: string) => {
            const confirmDelete = confirm(
                `Are you sure you want to delete ${course_code}? All of its deliverables will be deleted, and you will not get a refund for the course ticket you used to buy it.`
            );
            if (!confirmDelete) {
                return Promise.resolve();
            }
            return deleteCourse(id, session);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['semester', api_v1_semester_id!],
            });
            queryClient.invalidateQueries({
                queryKey: ['course', id],
            });
        },
    });
    if (courseDelete.error) {
        throw courseDelete.error;
    }

    const bgColour = useMemo(() => {
        if (goal === undefined || grade === undefined || grade === 0) {
            return 'bg-primary-800';
        } else {
            return determineGradeBGColour(goal, grade);
        }
    }, [goal, grade]);

    const href = courseURL(id);

    return (
        <div
            className={classNames(
                'card-primary hover:bg-primary-900 hover:cursor-pointer transition-colors flex flex-col gap-4 justify-between',
                bgColour
            )}
            onClick={(e) => {
                switch(e.detail){
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
            <div className="flex justify-between">
                <h4>Goal: {goal}%</h4>
                <h4>Grade: {(grade && Math.round(grade)) || '--'}%</h4>
            </div>
            {/* <div className="flex justify-center">
                <Image
                    width={300}
                    alt="NextUI hero Image"
                    src={''}
                    // isLoading={true}
                />
            </div> */}
            <div>
                <h3 className="text-left">{course_code}</h3>
                <h4 className="text-left">{title}</h4>
                <h4 className="text-left italic">{ReadableStatus(status)}</h4>
            </div>
        </div>
    );
}
