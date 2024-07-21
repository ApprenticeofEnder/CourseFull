import { AxiosResponse } from 'axios';
import { Fragment, useState } from 'react';
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
import { ItemStatus } from '@/lib/enums';
import { ReadableStatus } from '@/lib/helpers';
import { SessionProps } from '@/lib/types';
import { createSemester } from '@/services/semesterService';

export default function CreateSemesterModal({ session }: SessionProps) {
    const [name, setName] = useState('');
    const [goal, setGoal] = useState('80');
    const [status, setStatus] = useState<ItemStatus>(ItemStatus.NOT_STARTED);

    const [isLoading, setIsLoading] = useState<boolean>(false);

    async function handleCreateSemester(onClose: CallableFunction) {
        setIsLoading(true);
        const { success } = await createSemester(
            {
                name,
                goal: parseFloat(goal),
                status,
            },
            session,
            (error) => {
                alert(`Something went wrong: ${error}`);
                setIsLoading(false);
            }
        );
        if (!success) {
            return;
        }
        onClose();
        location.reload();
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
                            label="Semester name"
                            placeholder="Fall 2024..."
                            value={name}
                            onValueChange={setName}
                        />
                        <Input
                            type="number"
                            label="goal"
                            placeholder="Semester goal"
                            value={goal}
                            onValueChange={setGoal}
                            min={0}
                            max={100}
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
                                            ItemStatus.NOT_STARTED,
                                            ItemStatus.ACTIVE,
                                            ItemStatus.COMPLETE,
                                        ].map((status) => {
                                            return (
                                                <Listbox.Option
                                                    as={Button}
                                                    key={status}
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
                        <Button
                            onPress={() => {
                                handleCreateSemester(onClose);
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
