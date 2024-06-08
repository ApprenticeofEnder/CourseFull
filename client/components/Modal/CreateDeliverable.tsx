import { Fragment, useState } from 'react';
import {
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from '@nextui-org/react';

import Button from '@/components/Button/Button';
import ConfirmButton from '@/components/Button/ConfirmButton';
import { ItemStatus } from '@/lib/enums';
import { SessionProps } from '@/lib/types';
import { createDeliverable } from '@/services/deliverableService';
import DeliverableForm from '../Form/DeliverableForm';

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

    const [isLoading, setIsLoading] = useState<boolean>(false);

    async function handleCreateDeliverable(onClose: CallableFunction) {
        setIsLoading(true);
        const { success } = await createDeliverable(
            {
                name,
                status,
                weight: parseFloat(weight),
                mark: parseFloat(mark),
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
