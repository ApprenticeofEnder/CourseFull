'use client';
import { Image } from '@nextui-org/react';

import {
    Course,
    DeletableProps,
    EditableProps,
    ExitProps,
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

interface CourseDetailProps
    extends DeletableProps,
        EditableProps,
        ExitProps,
        SessionProps {
    course: Updated<Course>;
}

export default function CourseDetail({
    course: { id, title, course_code, status, goal, grade, api_v1_semester_id },
    session,
    handleExit,
    handleEdit,
    handleDelete,
}: CourseDetailProps) {
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

    const router = useRouter();

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
                'card-primary h-full',
                bgColour
            )}
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
                <Link href={href} color="foreground" underline="hover">
                    <h3 className="text-left">{course_code}</h3>
                </Link>
                <h4 className="text-left">{title}</h4>
                <h4 className="text-left italic">{ReadableStatus(status)}</h4>
            </div>
            <div className="flex gap-4">
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
