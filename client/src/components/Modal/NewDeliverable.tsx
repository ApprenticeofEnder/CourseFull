'use client';

import {
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
} from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { getLocalTimeZone, now } from '@internationalized/date';
import { FormProvider, useForm } from 'react-hook-form';

import Button from '@/components/Button/Button';
import DeliverableForm from '@/components/Form/DeliverableForm';
import { DeliverableSchema, deliverableSchema } from '@/lib/validation';
import { ItemStatus } from '@/types';

import Modal, { type ModalProps } from './Modal';

interface NewDeliverableModalProps extends ModalProps {
    api_v1_course_id: string;
}

export default function NewDeliverableModal({
    api_v1_course_id,
    ...props
}: NewDeliverableModalProps) {
    const DEFAULT_DELIVERABLE: DeliverableSchema = {
        name: '',
        mark: 0,
        weight: 10,
        notes: '',
        status: ItemStatus.ACTIVE,
        start_date: now(getLocalTimeZone()),
        deadline: now(getLocalTimeZone()),
    };
    const formMethods = useForm<DeliverableSchema>({
        resolver: zodResolver(deliverableSchema),
        defaultValues: DEFAULT_DELIVERABLE,
        mode: 'onChange',
    });
    const {
        handleSubmit,
        formState: { isValid },
    } = formMethods;

    return (
        <Modal {...props} isDismissable={false}>
            <ModalContent>
                {(onClose) => (
                    <FormProvider {...formMethods}>
                        <ModalHeader>
                            <h3 className="text-left">
                                Create New Deliverable
                            </h3>
                        </ModalHeader>
                        <ModalBody>
                            <DeliverableForm />
                        </ModalBody>
                        <ModalFooter>
                            <Button onPress={onClose}>Cancel</Button>
                        </ModalFooter>
                    </FormProvider>
                )}
            </ModalContent>
        </Modal>
    );
}
