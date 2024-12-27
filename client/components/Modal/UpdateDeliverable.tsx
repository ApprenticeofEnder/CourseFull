import { Fragment, useState } from 'react';
import {
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ScrollShadow,
} from '@nextui-org/react';

import Button from '@components/Button/Button';
import { Deliverable, Updated, UpdateDeliverableModalProps } from '@coursefull';
import { updateDeliverable } from '@services/deliverableService';
import DeliverableForm from '../Form/DeliverableForm';
import assert from 'assert';

export default function UpdateDeliverableModal({
    session,
    deliverable,
}: UpdateDeliverableModalProps) {
    assert(deliverable);
    assert(deliverable.id);

    const [updatedDeliverable, setUpdatedDeliverable] =
        useState<Deliverable>(deliverable);

    const [isLoading, setIsLoading] = useState<boolean>(false);

    async function handleUpdateDeliverable(onClose: CallableFunction) {
        setIsLoading(true);
        await updateDeliverable(
            updatedDeliverable as Updated<Deliverable>,
            session
        );
        onClose();
        location.reload();
    }

    return (
        <ModalContent>
            {(onClose) => (
                <Fragment>
                    <ModalHeader className="flex flex-col justify-between gap-1">
                        <h3 className="text-left">Edit Deliverable</h3>
                        <h4>Goal: {deliverable.goal}%</h4>
                    </ModalHeader>
                    <ModalBody>
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
