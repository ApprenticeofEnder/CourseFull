import { Dispatch, Fragment, SetStateAction } from 'react';
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
import { Deliverable, SessionProps } from '@/lib/types';
import { updateDeliverable } from '@/services/deliverableService';

// const [name, setName] = useState<string>(deliverable.name);
// const [status, setStatus] = useState<ItemStatus>(deliverable.status);
// const [weight, setWeight] = useState<string>(deliverable.weight.toString());
// const [mark, setMark] = useState<string>(deliverable.mark.toString());
// const [notes, setNotes] = useState<string>(deliverable.notes);

interface DeliverableFormProps {
    name: string;
    setName: Dispatch<SetStateAction<string>>;
    status: ItemStatus;
    setStatus: Dispatch<SetStateAction<ItemStatus>>;
    weight: string;
    setWeight: Dispatch<SetStateAction<string>>;
    mark: string;
    setMark: Dispatch<SetStateAction<string>>;
    notes: string;
    setNotes: Dispatch<SetStateAction<string>>;
}

export default function DeliverableForm({
    name,
    setName,
    weight,
    setWeight,
    status,
    setStatus,
    mark,
    setMark,
    notes,
    setNotes,
}: DeliverableFormProps) {
    function statusChanged(newStatus: ItemStatus) {
        setStatus(newStatus);
        if (newStatus === ItemStatus.ACTIVE) {
            setMark('0');
        }
    }

    return (
        <Fragment>
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
                <Fragment />
            )}
            <Textarea
                label="Notes"
                placeholder="What's important about this particular deliverable?"
                value={notes}
                onValueChange={setNotes}
            />
            <Listbox value={status} onChange={statusChanged}>
                <Listbox.Button as={DisclosureButton} className="w-full my-2">
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
                            {[ItemStatus.ACTIVE, ItemStatus.COMPLETE].map(
                                (status) => {
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
                                }
                            )}
                        </div>
                    </Listbox.Options>
                </Transition>
            </Listbox>
            {status === ItemStatus.ACTIVE && (
                <p>
                    <strong>Hint:</strong> Set the status to "Complete" to set
                    the mark!
                </p>
            )}
        </Fragment>
    );
}
