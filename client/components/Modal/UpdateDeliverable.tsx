import { Fragment, useState } from 'react';
import {
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from '@nextui-org/react';

import Button from '@/components/Button/Button';
import { ItemStatus } from '@coursefull';
import { Deliverable, SessionProps } from '@coursefull';
import { updateDeliverable } from '@/services/deliverableService';
import DeliverableForm from '../Form/DeliverableForm';

interface EditDeliverableModalProps extends SessionProps {
    deliverable: Deliverable | null;
}

export default function UpdateDeliverableModal({
    session,
    deliverable,
}: EditDeliverableModalProps) {
    if (!deliverable) {
        return;
    }
    const [name, setName] = useState<string>(deliverable.name);
    const [status, setStatus] = useState<ItemStatus>(deliverable.status);
    const [weight, setWeight] = useState<string>(deliverable.weight.toString());
    const [mark, setMark] = useState<string>(deliverable.mark.toString());
    const [notes, setNotes] = useState<string>(deliverable.notes);

    const [isLoading, setIsLoading] = useState<boolean>(false);

    async function handleUpdateDeliverable(onClose: CallableFunction) {
        setIsLoading(true);
        const { success } = await updateDeliverable(
            {
                id: deliverable?.id,
                name,
                status,
                weight: parseFloat(weight),
                mark: parseFloat(mark),
                notes,
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
                        Edit Deliverable
                    </ModalHeader>
                    <ModalBody>
                        <h3>Goal: {deliverable.goal}%</h3>
                        <DeliverableForm
                            name={name}
                            setName={setName}
                            status={status}
                            setStatus={setStatus}
                            weight={weight}
                            setWeight={setWeight}
                            mark={mark}
                            setMark={setMark}
                            notes={notes}
                            setNotes={setNotes}
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button onPress={onClose}>Close</Button>
                        <Button
                            buttonType="confirm"
                            onPress={() => {
                                handleUpdateDeliverable(onClose);
                            }}
                            isLoading={isLoading}
                        >
                            Save
                        </Button>
                    </ModalFooter>
                </Fragment>
            )}
        </ModalContent>
    );
}
