import { Fragment, useState } from 'react';
import { getLocalTimeZone, now } from '@internationalized/date';
import {
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from '@nextui-org/react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ZodError } from 'zod';

import Button from '@components/Button/Button';
import { ItemStatus, SessionProps, type Deliverable } from '@coursefull';
import { createDeliverable } from '@services/deliverableService';
import DeliverableForm from '@components/Form/DeliverableForm';
import { convertDeliverableToDto } from '@lib/dto';
import { deliverableDtoSchema, DeliverableDtoSchema, deliverableSchema, DeliverableSchema } from '@lib/validation';

interface DeliverableModalProps extends SessionProps {
    api_v1_course_id: string;
}

export default function CreateDeliverableModal({
    session,
    api_v1_course_id,
}: DeliverableModalProps) {
    const [deliverable, setDeliverable] = useState<Deliverable>({
        name: '',
        status: ItemStatus.ACTIVE,
        weight: 0,
        mark: 0,
        notes: '',
        start_date: now(getLocalTimeZone()),
        deadline: now(getLocalTimeZone()),
    });

    const [zodError, setZodError] = useState<ZodError | null>(null);

    const [isLoading, setIsLoading] = useState<boolean>(false);

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
        }
    });
    if (deliverableCreate.error){
        throw deliverableCreate.error;
    }

    async function handleCreateDeliverable(onClose: CallableFunction) {
        const dto = convertDeliverableToDto(deliverable);
        const parseResult = deliverableDtoSchema.safeParse(dto);
        if (!parseResult.success) {
            setZodError(parseResult.error);
            return;
        }
        setIsLoading(true);
        await createDeliverable(
            {
                ...parseResult.data!,
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
                            zodError={zodError}
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
