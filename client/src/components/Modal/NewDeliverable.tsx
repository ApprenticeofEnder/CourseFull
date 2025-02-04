'use client';

import {
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
} from '@heroui/react';

import Button from '@/components/Button/Button';

import Modal, { type ModalProps } from './Modal';

interface NewDeliverableModalProps extends ModalProps {
    api_v1_course_id: string;
}

export default function NewDeliverableModal({
    api_v1_course_id,
    ...props
}: NewDeliverableModalProps) {
    return (
        <Modal {...props} isDismissable={false}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader>
                            <h3 className="text-left">
                                Create New Deliverable
                            </h3>
                        </ModalHeader>
                        <ModalBody>{api_v1_course_id}</ModalBody>
                        <ModalFooter>
                            <Button onPress={onClose}>Cancel</Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
