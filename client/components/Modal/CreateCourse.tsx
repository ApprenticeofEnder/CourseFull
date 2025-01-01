'use client';

import { Fragment, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from '@nextui-org/react';

import Button from '@components/Button/Button';
import CourseForm from '@components/Form/CourseForm';
import { SessionProps, ItemStatus, Course } from '@coursefull';
import { createCourse as courseCreate, createCourse } from '@services/courseService';
import { getUserData } from '@services/userService';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

interface CourseModalProps extends SessionProps {
    api_v1_semester_id: string;
}

export default function CreateCourseModal({
    session,
    api_v1_semester_id,
}: CourseModalProps) {
    const [course, setCourse] = useState<Course>({
        title: '',
        course_code: '',
        status: ItemStatus.ACTIVE,
        deliverables: [],
    });

    const queryClient = useQueryClient();

    const userResult = useQuery({
        queryKey: ['user'],
        queryFn: () => {
            return getUserData(session);
        },
    });
    if(userResult.error){
        throw userResult.error;
    }

    const courseCreate = useMutation({
        mutationFn: (course: Course) => {
            return createCourse(
                {
                    ...course,
                    api_v1_semester_id,
                },
                session
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['semester', api_v1_semester_id]})
        },
    });
    if (courseCreate.error) {
        throw courseCreate.error;
    }

    return (
        <ModalContent>
            {(onClose) => (
                <Fragment>
                    <ModalHeader className="flex flex-col gap-1">
                        <h3 className="text-left">Create New Course</h3>
                    </ModalHeader>
                    <ModalBody>
                        <p>
                            You have {userResult.data?.courses_remaining || 0} course(s) remaining on
                            your account.
                        </p>
                        <CourseForm course={course} setCourse={setCourse} />
                    </ModalBody>
                    <ModalFooter>
                        <Button onPress={onClose}>Close</Button>
                        <Button
                            onPress={() => {
                                courseCreate.mutate(course, {
                                    onSuccess: onClose
                                })
                            }}
                            isLoading={courseCreate.isPending}
                            buttonType="confirm"
                        >
                            Create!
                        </Button>
                    </ModalFooter>
                </Fragment>
            )}
        </ModalContent>
    );
}
