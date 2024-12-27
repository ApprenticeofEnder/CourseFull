import { Fragment, useState } from 'react';
import {
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from '@nextui-org/react';
import {parseDate, getLocalTimeZone, now} from "@internationalized/date";

import Button from '@components/Button/Button';
import { ItemStatus, SessionProps, type Deliverable } from '@coursefull';
import { createDeliverable } from '@services/deliverableService';
import DeliverableForm from '@components/Form/DeliverableForm';

interface DeliverableModalProps extends SessionProps {
    api_v1_course_id: string;
}

export default function CreateDeliverableModal({
    session,
    api_v1_course_id,
}: DeliverableModalProps) {
    const [deliverable, setDeliverable] = useState<Deliverable>({
        name: "",
        status: ItemStatus.ACTIVE,
        weight: 0,
        mark: 0,
        notes: "",
        start_date: now(getLocalTimeZone()),
        deadline: now(getLocalTimeZone())
    });

    const [isLoading, setIsLoading] = useState<boolean>(false);

    async function handleCreateDeliverable(onClose: CallableFunction) {
        setIsLoading(true);
        await createDeliverable(
            {
                ...deliverable,
                api_v1_course_id,
            },
            session
        );
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
                        <DeliverableForm
                            deliverable={deliverable}
                            setDeliverable={setDeliverable}
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button onPress={onClose}>Close</Button>
                        <Button
                            onPress={() => {
                                handleCreateDeliverable(onClose);
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
