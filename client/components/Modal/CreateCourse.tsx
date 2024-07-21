'use client';

import { Fragment, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Input,
} from '@nextui-org/react';
import { Listbox, Transition } from '@headlessui/react';

import Button from '@/components/Button/Button';
import DisclosureButton from '@/components/Button/DisclosureButton';
import { Endpoints, ItemStatus } from '@/lib/enums';
import { ReadableStatus } from '@/lib/helpers';
import { SessionProps, User } from '@/lib/types';
import { createCourse } from '@/services/courseService';
import { getUserData } from '@/services/userService';

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
                    onClose();
                } catch (err) {
                    alert(`Something went wrong: ${error}`);
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
    }, []);

    return (
        <ModalContent>
            {(onClose) => (
                <Fragment>
                    <ModalHeader className="flex flex-col gap-1">
                        Create New Course
                    </ModalHeader>
                    <ModalBody>
                        <p>
                            You have {coursesRemaining} courses remaining on
                            your account.
                        </p>
                        <Input
                            type="text"
                            label="Course Title"
                            placeholder="Introduction to Psychology..."
                            value={title}
                            onValueChange={setTitle}
                        />
                        <Input
                            type="text"
                            label="Course Code"
                            placeholder="PSYC 1001..."
                            value={code}
                            onValueChange={setCode}
                        />
                        <Listbox value={status} onChange={setStatus}>
                            <Listbox.Button
                                as={DisclosureButton}
                                className="w-full my-2"
                            >
                                Status: {ReadableStatus(status)}
                            </Listbox.Button>
                            <Transition
                                enter="transition ease-out duration-200"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                                leave="transition ease-in duration-200"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <Listbox.Options className="w-full flex justify-center">
                                    <div className="w-full">
                                        {[
                                            ItemStatus.ACTIVE,
                                            ItemStatus.COMPLETE,
                                        ].map((status) => {
                                            return (
                                                <Listbox.Option
                                                    as={Button}
                                                    value={status}
                                                    key={status}
                                                    className="w-full my-2 mx-auto"
                                                >
                                                    {ReadableStatus(status)}
                                                </Listbox.Option>
                                            );
                                        })}
                                    </div>
                                </Listbox.Options>
                            </Transition>
                        </Listbox>
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
