import assert from 'assert';
import { Fragment, useState } from 'react';
import {
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ScrollShadow,
} from '@nextui-org/react';

import Button from '@components/Button/Button';
import DeliverableForm from '@components/Form/DeliverableForm';
import {
    Deliverable,
    DeliverableDto,
    Updated,
    UpdateDeliverableModalProps,
} from '@coursefull';
import { updateDeliverable } from '@services/deliverableService';
import { convertDeliverableToDto } from '@lib/dto';
import { DeliverableDtoSchema } from '@lib/validation';
import { ZodError } from 'zod';

export default function UpdateDeliverableModal({
    session,
    deliverable,
}: UpdateDeliverableModalProps) {
    assert(deliverable);
    assert(deliverable.id);

    const [updatedDeliverable, setUpdatedDeliverable] =
        useState<Deliverable>(deliverable);
    const [zodError, setZodError] = useState<ZodError | null>(null);

    const [isLoading, setIsLoading] = useState<boolean>(false);

    async function handleUpdateDeliverable(onClose: CallableFunction) {
        const dto = convertDeliverableToDto(deliverable);
        const parseResult = DeliverableDtoSchema.safeParse(dto);
        if(!parseResult.success){
            setZodError(parseResult.error);
            return;
        }
        setIsLoading(true);
        await updateDeliverable(
            parseResult.data as Updated<DeliverableDto>,
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
                            zodError={zodError}
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
