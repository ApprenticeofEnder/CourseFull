import { Fragment, useState } from 'react';
import {
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from '@nextui-org/react';

import Button from '@components/Button/Button';
import { Deliverable, Updated, UpdateDeliverableModalProps} from '@coursefull';
import { updateDeliverable } from '@services/deliverableService';
import DeliverableForm from '../Form/DeliverableForm';
import assert from 'assert';

export default function UpdateDeliverableModal({
    session,
    deliverable,
}: UpdateDeliverableModalProps) {
    assert(deliverable);
    assert(deliverable.id);

    const [updatedDeliverable, setUpdatedDeliverable] = useState<Deliverable>(deliverable);

    const [isLoading, setIsLoading] = useState<boolean>(false);

    async function handleUpdateDeliverable(onClose: CallableFunction) {
        setIsLoading(true);
        const { success } = await updateDeliverable(
            updatedDeliverable as Updated<Deliverable>,
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
                            deliverable={updatedDeliverable}
                            setDeliverable={setUpdatedDeliverable}
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
