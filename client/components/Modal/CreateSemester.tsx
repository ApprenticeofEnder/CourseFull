import { AxiosResponse } from 'axios';
import { Fragment, useState } from 'react';
import {
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Input,
} from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { Listbox, Transition } from '@headlessui/react';

import Button from '@/components/Button/Button';
import ConfirmButton from '@/components/Button/ConfirmButton';
import DisclosureButton from '@/components/Button/DisclosureButton';
import { Endpoints, ItemStatus } from '@/lib/enums';
import { ReadableStatus } from '@/lib/helpers';
import { Semester, SessionProps } from '@/lib/types';
import { createSemester } from '@/services/semesterService';

export default function CreateSemesterModal({ session }: SessionProps) {
    const router = useRouter();
    const [semesterName, setSemesterName] = useState('');
    const [semesterGoal, setSemesterGoal] = useState('80');
    const [semesterStatus, setSemesterStatus] = useState<ItemStatus>(
        ItemStatus.NOT_STARTED
    );

    const [isLoading, setIsLoading] = useState<boolean>(false);

    async function handleCreateSemester() {
        setIsLoading(true);
        const { response, success } = await createSemester(
            semesterName,
            semesterGoal,
            semesterStatus,
            session,
            (error) => {
                alert(`Something went wrong: ${error}`);
                setIsLoading(false);
            }
        );
        if (!success) {
            return;
        }
        const semesterData: Semester = response?.data;
        router.push(`${Endpoints.SEMESTER_DASHBOARD}/${semesterData.id}`);
    }

    return (
        <ModalContent>
            {(onClose) => (
                <Fragment>
                    <ModalHeader className="flex flex-col gap-1">
                        Create New Semester
                    </ModalHeader>
                    <ModalBody>
                        <Input
                            type="text"
                            label="Semester Name"
                            placeholder="Fall 2024..."
                            value={semesterName}
                            onValueChange={setSemesterName}
                        />
                        <Input
                            type="number"
                            label="Goal"
                            placeholder="Semester Goal"
                            value={semesterGoal}
                            onValueChange={setSemesterGoal}
                            min={0}
                            max={100}
                        />
                        <Listbox
                            value={semesterStatus}
                            onChange={setSemesterStatus}
                        >
                            <Listbox.Button
                                as={DisclosureButton}
                                className="w-full my-2"
                            >
                                Status: {ReadableStatus(semesterStatus)}
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
                                        {[
                                            ItemStatus.NOT_STARTED,
                                            ItemStatus.ACTIVE,
                                            ItemStatus.COMPLETE,
                                        ].map((status) => {
                                            return (
                                                <Listbox.Option
                                                    as={Button}
                                                    value={status}
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
                        <ConfirmButton
                            onPress={() => {
                                handleCreateSemester();
                                onClose();
                            }}
                            isLoading={isLoading}
                        >
                            Create!
                        </ConfirmButton>
                    </ModalFooter>
                </Fragment>
            )}
        </ModalContent>
    );
}
