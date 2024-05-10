import { AxiosResponse } from 'axios';
import { Fragment, useState } from 'react';
import {
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Input,
} from '@nextui-org/react';

import Button from '@/components/Button/Button';
import ConfirmButton from '@/components/Button/ConfirmButton';
import { Endpoints, Readable, SemesterStatus } from '@/lib/helpers';
import { SessionProps } from '@/lib/types';
import { Listbox, Transition } from '@headlessui/react';
import DisclosureButton from '../Button/DisclosureButton';
import { createSemester } from '@/services/semesterService';

export default function CreateSemesterModal({ session }: SessionProps) {
    const [semesterName, setSemesterName] = useState('');
    const [semesterGoal, setSemesterGoal] = useState('80');
    const [semesterStatus, setSemesterStatus] = useState<SemesterStatus>(
        SemesterStatus.NOT_STARTED
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
        const semesterData = response?.data;
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
                                Status:{' '}
                                {Readable<SemesterStatus>(semesterStatus)}
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
                                            SemesterStatus.NOT_STARTED,
                                            SemesterStatus.ACTIVE,
                                            SemesterStatus.COMPLETE,
                                        ].map((status) => {
                                            return (
                                                <Listbox.Option
                                                    as={Button}
                                                    value={status}
                                                    className="w-full my-2 mx-auto"
                                                >
                                                    {Readable<SemesterStatus>(
                                                        status
                                                    )}
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
