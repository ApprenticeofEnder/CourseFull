import assert from 'assert';
import { Fragment, useMemo, useState } from 'react';
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
    SessionProps,
    Updated,
} from '@coursefull';
import { updateDeliverable } from '@services/deliverableService';
import { convertDeliverableToDto } from '@lib/dto';

interface UpdateDeliverableModalProps extends SessionProps {
    deliverable: Updated<Deliverable> | null;
    totalWeight: number;
}

export default function UpdateDeliverableModal({
    session,
    deliverable,
    totalWeight,
}: UpdateDeliverableModalProps) {
    assert(deliverable);
    assert(deliverable.id);

    const [updatedDeliverable, setUpdatedDeliverable] =
        useState<Deliverable>(deliverable);

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

    const isOverweight = useMemo(() => {
        return updatedDeliverable.weight + totalWeight > 100;
    }, [updatedDeliverable.weight, totalWeight]);

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
                            totalWeight={totalWeight}
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
                            isDisabled={isOverweight}
                        >
                            Save
                        </Button>
                    </ModalFooter>
                </Fragment>
            )}
        </ModalContent>
    );
}
