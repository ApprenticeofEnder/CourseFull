import axios from 'axios';
import { Fragment, useEffect, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { PlusIcon } from '@heroicons/react/24/outline';
import {
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    useDisclosure,
} from '@nextui-org/react';

import { Endpoints } from '@/lib/helpers';
import { Semester, SemesterProgressType, SessionProps } from '@/lib/types';
import Progress from '@/components/Card/SemesterProgress';
import DisclosureButton from '@/components/Button/DisclosureButton';
import Button from '@/components/Button/Button';
import ConfirmButton from '@/components/Button/ConfirmButton';
import CreateSemesterModal from '@/components/Modal/CreateSemester';
import LinkButton from '../Button/LinkButton';

export default function HomeStatus({ session }: SessionProps) {
    const [progress, setProgress] = useState<SemesterProgressType[]>([
        {
            semester: 'TEST SEMESTER',
            semesterId: 'EEEE',
            average: 78.2,
            numCourses: 4,
            goal: 80.0,
        },
    ]);

    const [semesters, setSemesters] = useState<Semester[]>([
        { name: 'Hello', id: 'AAAA', status: 'active', goal: 80.0 },
    ]);

    const [selectedSemester, setSelectedSemester] = useState<Semester | null>(
        null
    );

    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    useEffect(() => {
        async function requestProgress() {
            const { data } = await axios.get(Endpoints.API_PROGRESS, {
                headers: {
                    Authorization: `Bearer ${session.access_token}`,
                },
            });
            setProgress(data);
        }

        async function requestSemesters() {
            const { data } = await axios.get(Endpoints.API_SEMESTERS, {
                headers: {
                    Authorization: `Bearer ${session.access_token}`,
                },
            });
            setSemesters(data);
        }

        requestProgress()
            .then(requestSemesters)
            .catch((err) => {
                alert('Error:' + err.message);
            });
    }, []);
    return (
        <Fragment>
            <div className="flex flex-row justify-center gap-8 m-5">
                {progress?.length ? (
                    progress.map((semesterProgress: SemesterProgressType) => {
                        return (
                            <Progress
                                {...semesterProgress}
                                key={semesterProgress.semester}
                            ></Progress>
                        );
                    })
                ) : (
                    <p>No progress made.</p>
                )}
            </div>

            <div className="w-full flex justify-center gap-4">
                <div className="w-3/4">
                    {semesters.length ? (
                        <Listbox
                            value={selectedSemester}
                            onChange={setSelectedSemester}
                        >
                            <Listbox.Button
                                as={DisclosureButton}
                                className="w-full my-2"
                            >
                                {selectedSemester?.name || 'Select a Semester'}
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
                                    <div className="w-3/4">
                                        {semesters.map((semester) => (
                                            <Listbox.Option
                                                as={Button}
                                                key={semester.id}
                                                value={semester}
                                                className="w-full my-2 mx-auto"
                                            >
                                                {semester.name}
                                            </Listbox.Option>
                                        ))}
                                        <Listbox.Button
                                            as={ConfirmButton}
                                            endContent={
                                                <PlusIcon className="h-6 w-6"></PlusIcon>
                                            }
                                            className="w-full my-2 mx-auto"
                                            onPressEnd={onOpen}
                                        >
                                            Create New Semester
                                        </Listbox.Button>
                                    </div>
                                </Listbox.Options>
                            </Transition>
                        </Listbox>
                    ) : (
                        <ConfirmButton
                            endContent={
                                <PlusIcon className="h-6 w-6"></PlusIcon>
                            }
                            className="w-full"
                            onPressEnd={onOpen}
                        >
                            Create New Semester
                        </ConfirmButton>
                    )}
                </div>
                {/* Probably going to redirect to the currently selected semester */}
                <LinkButton confirm href={Endpoints.ROOT} className="my-2">
                    Let's go!
                </LinkButton>
            </div>
            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                className="bg-sky-100"
            >
                <CreateSemesterModal session={session} />
            </Modal>
        </Fragment>
    );
}
