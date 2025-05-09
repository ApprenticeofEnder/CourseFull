import { Fragment, useMemo, useState } from 'react';
import { getLocalTimeZone, now } from '@internationalized/date';
import {
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from '@nextui-org/react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import Button from '@components/Button/Button';
import { ItemStatus, SessionProps, type Deliverable } from '@coursefull';
import { createDeliverable } from '@services/deliverableService';
import DeliverableForm from '@components/Form/DeliverableForm';
import { convertDeliverableToDto } from '@lib/dto';

interface DeliverableModalProps extends SessionProps {
    api_v1_course_id: string;
    totalWeight: number;
}

export default function CreateDeliverableModal({
    session,
    api_v1_course_id,
    totalWeight,
}: DeliverableModalProps) {
    const [deliverable, setDeliverable] = useState<Deliverable>({
        name: '',
        status: ItemStatus.ACTIVE,
        weight: 0,
        mark: 0,
        notes: '',
        start_date: now(getLocalTimeZone()),
        deadline: now(getLocalTimeZone()).set({hour: 23, minute: 59}),
    });

    const queryClient = useQueryClient();

    const deliverableCreate = useMutation({
        mutationFn: (deliverable: Deliverable) => {
            const dto = convertDeliverableToDto(deliverable);
            return createDeliverable(
                {
                    ...dto,
                    api_v1_course_id,
                },
                session
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['course'] });
        },
    });
    if (deliverableCreate.error) {
        throw deliverableCreate.error;
    }

    const isOverweight = useMemo(() => {
        return deliverable.weight + totalWeight > 100;
    }, [deliverable.weight, totalWeight]);

    return (
        <ModalContent>
            {(onClose) => (
                <Fragment>
                    <ModalHeader className="flex flex-col gap-1">
                        Create New Deliverable
                    </ModalHeader>
                    <ModalBody>
                        <DeliverableForm
                            totalWeight={totalWeight}
                            deliverable={deliverable}
                            setDeliverable={setDeliverable}
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button onPress={onClose}>Close</Button>
                        <Button
                            onPress={() => {
                                deliverableCreate.mutate(deliverable, {
                                    onSuccess: onClose,
                                });
                            }}
                            isLoading={deliverableCreate.isPending}
                            isDisabled={isOverweight}
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
