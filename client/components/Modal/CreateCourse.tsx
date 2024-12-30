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
import { createCourse } from '@services/courseService';
import { getUserData } from '@services/userService';
import { CourseDtoSchema } from '@lib/validation';

interface CourseModalProps extends SessionProps {
    api_v1_semester_id: string;
}

export default function CreateCourseModal({
    session,
    api_v1_semester_id,
}: CourseModalProps) {
    const router = useRouter();
    const [course, setCourse] = useState<Course>({
        title: '',
        course_code: '',
        status: ItemStatus.ACTIVE,
        deliverables: [],
    });

    const [error, setError] = useState<any>(null);

    const [coursesRemaining, setCoursesRemaining] = useState(0);

    const [isLoading, setIsLoading] = useState<boolean>(false);

    // (error) => {
    //     setIsLoading(false);
    //     try {
    //         const errorData = JSON.parse(error.message);
    //         const outOfTicketsError =
    //             errorData.status === 403 &&
    //             errorData.data.error === 'No course tickets remaining.';
    //         if (!outOfTicketsError) {
    //             alert(`Something went wrong: ${error}`);
    //         } else {
    //             const buying = confirm(
    //                 "Whoops! Looks like you don't have room for any more courses. Buy some tickets to add more!"
    //             );
    //             if (buying) router.push(Endpoints.PRODUCTS);
    //         }
    //     } catch (err) {
    //         alert(`Something went wrong: ${error}`);
    //     } finally {
    //         onClose();
    //     }
    // }

    async function handleCreateCourse(onClose: CallableFunction) {
        try {
            setIsLoading(true);
            await createCourse(
                {
                    ...course,
                    api_v1_semester_id,
                },
                session
            );
            onClose();
            location.reload();
        } catch (err) {
            setError(err);
        }
    }

    let mounted = useRef(true);

    useEffect(() => {
        if (!session || !mounted.current) {
            return;
        }
        setIsLoading(true);

        async function getData() {
            const { courses_remaining } = await getUserData(session);
            setCoursesRemaining(courses_remaining);
            setIsLoading(false);
        }

        try {
            getData();
        } catch (err) {
            setError(err);
        }

        return () => {
            mounted.current = false;
        };
    }, [session]);

    if (error) {
        throw error;
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
                            You have {coursesRemaining} course(s) remaining on
                            your account.
                        </p>
                        <CourseForm course={course} setCourse={setCourse} />
                    </ModalBody>
                    <ModalFooter>
                        <Button onPress={onClose}>Close</Button>
                        <Button
                            onPress={() => {
                                handleCreateCourse(onClose);
                            }}
                            isLoading={isLoading}
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
