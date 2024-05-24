import { Fragment, useState } from 'react';
import {
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Input,
    Textarea,
} from '@nextui-org/react';
import { Listbox, Transition } from '@headlessui/react';

import Button from '@/components/Button/Button';
import ConfirmButton from '@/components/Button/ConfirmButton';
import DisclosureButton from '@/components/Button/DisclosureButton';
import { ItemStatus } from '@/lib/enums';
import { ReadableStatus } from '@/lib/helpers';
import { SessionProps } from '@/lib/types';
import { createDeliverable } from '@/services/deliverableService';

interface DeliverableModalProps extends SessionProps {
    api_v1_course_id: string;
}

export default function CreateDeliverableModal({
    session,
    api_v1_course_id,
}: DeliverableModalProps) {
    const [name, setName] = useState<string>('');
    const [status, setStatus] = useState<ItemStatus>(ItemStatus.ACTIVE);
    const [weight, setWeight] = useState<string>('');
    const [mark, setMark] = useState<string>('0');
    const [notes, setNotes] = useState<string>('');

    function statusChanged(newStatus: ItemStatus) {
        setStatus(newStatus);
        if (newStatus === ItemStatus.ACTIVE) {
            setMark('0');
        }
    }

    const [isLoading, setIsLoading] = useState<boolean>(false);

    async function handleCreateDeliverable(onClose: CallableFunction) {
        setIsLoading(true);
        const { success } = await createDeliverable(
            {
                name,
                status,
                weight: parseFloat(weight),
                mark: 0,
                notes,
                api_v1_course_id,
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
                        Create New Deliverable
                    </ModalHeader>
                    <ModalBody>
                        <Input
                            type="text"
                            label="Name"
                            placeholder="What's the name of the deliverable?"
                            value={name}
                            onValueChange={setName}
                        />
                        <Input
                            type="number"
                            label="Weight (%)"
                            placeholder="How much is it worth?"
                            value={weight}
                            onValueChange={setWeight}
                            min={0}
                            max={100}
                        />
                        {status === ItemStatus.COMPLETE ? (
                            <Input
                                type="number"
                                label="Mark (%)"
                                placeholder="What was the final grade?"
                                value={mark}
                                onValueChange={setMark}
                                min={0}
                                max={100}
                            />
                        ) : (
                            <Fragment></Fragment>
                        )}
                        <Textarea
                            label="Notes"
                            placeholder="What's important about this particular deliverable?"
                            value={notes}
                            onValueChange={setNotes}
                        />
                        <Listbox value={status} onChange={statusChanged}>
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
                                    <div className="w-3/4">
                                        {[
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
                                handleCreateDeliverable(onClose);
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
