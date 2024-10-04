'use client';

import { Fragment, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from '@nextui-org/react';

import Button from '@components/Button/Button';
import CourseForm from '@components/Form/CourseForm';
import { SessionProps, User, Endpoints, ItemStatus } from '@coursefull';
import { createCourse } from '@services/courseService';
import { getUserData } from '@services/userService';

interface CourseModalProps extends SessionProps {
    api_v1_semester_id: string;
}

export default function CreateCourseModal({
    session,
    api_v1_semester_id,
}: CourseModalProps) {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [code, setCode] = useState('');
    const [status, setStatus] = useState<ItemStatus>(ItemStatus.ACTIVE);

    const [coursesRemaining, setCoursesRemaining] = useState(0);

    const [isLoading, setIsLoading] = useState<boolean>(false);

    async function handleCreateCourse(onClose: CallableFunction) {
        setIsLoading(true);
        const { response, success } = await createCourse(
            {
                title,
                course_code: code,
                status,
                api_v1_semester_id,
            },
            session,
            (error) => {
                setIsLoading(false);
                try {
                    const errorData = JSON.parse(error.message);
                    const outOfTicketsError =
                        errorData.status === 403 &&
                        errorData.data.error === 'No course tickets remaining.';
                    if (!outOfTicketsError) {
                        alert(`Something went wrong: ${error}`);
                    } else {
                        const buying = confirm(
                            "Whoops! Looks like you don't have room for any more courses. Buy some tickets to add more!"
                        );
                        if (buying) router.push(Endpoints.PRODUCTS);
                    }
                } catch (err) {
                    alert(`Something went wrong: ${error}`);
                } finally {
                    onClose();
                }
            }
        );
        if (!success) {
            return;
        }
        onClose();
        location.reload();
    }

    useEffect(() => {
        let mounted = true;
        setIsLoading(true);

        getUserData(session, (error) => {
            alert(`Something went wrong: ${error}`);
        })
            .then(({ response }) => {
                if (mounted) {
                    const user: User = response?.data;
                    setCoursesRemaining(user.courses_remaining);
                    setIsLoading(false);
                }
            })
            .catch();

        return () => {
            mounted = false;
        };
    }, [session]);

    return (
        <ModalContent>
            {(onClose) => (
                <Fragment>
                    <ModalHeader className="flex flex-col gap-1">
                        Create New Course
                    </ModalHeader>
                    <ModalBody>
                        <p>
                            You have {coursesRemaining} course(s) remaining on
                            your account.
                        </p>
                        <CourseForm
                            title={title}
                            setTitle={setTitle}
                            code={code}
                            setCode={setCode}
                            status={status}
                            setStatus={setStatus}
                        />
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
