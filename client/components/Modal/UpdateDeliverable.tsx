import assert from 'assert';
import { Fragment, useState } from 'react';
import {
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from '@nextui-org/react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

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

export default function UpdateDeliverableModal({
    session,
    deliverable,
}: UpdateDeliverableModalProps) {
    assert(deliverable);
    assert(deliverable.id);

    const [updatedDeliverable, setUpdatedDeliverable] =
        useState<Deliverable>(deliverable);

    const [isValid, setIsValid] = useState<boolean>(false);

    const queryClient = useQueryClient();

    const deliverableUpdate = useMutation({
        mutationFn: (deliverable: Deliverable) => {
            const dto = convertDeliverableToDto(deliverable);
            return updateDeliverable(
                {
                    ...dto,
                } as Updated<DeliverableDto>,
                session
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['course'] });
        },
    });
    if (deliverableUpdate.error) {
        throw deliverableUpdate.error;
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
                            setIsValid={setIsValid}
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button onPress={onClose}>Close</Button>
                        <Button
                            buttonType="confirm"
                            onPress={() => {
                                deliverableUpdate.mutate(updatedDeliverable, {
                                    onSuccess: onClose,
                                });
                            }}
                            isLoading={deliverableUpdate.isPending}
                            isDisabled={!isValid}
                        >
                            Save
                        </Button>
                    </ModalFooter>
                </Fragment>
            )}
        </ModalContent>
    );
}
