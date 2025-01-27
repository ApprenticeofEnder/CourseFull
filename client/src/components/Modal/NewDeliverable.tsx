'use client';

import {
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalProps,
    useDisclosure,
} from '@heroui/react';
import { useRouter } from 'next/navigation';

import Button from '@/components/Button/Button';
import { Dispatcher } from '@/types';

interface NewDeliverableModalProps extends Omit<ModalProps, 'children'> {
    api_v1_course_id: string;
}

export default function NewDeliverableModal({
    isOpen,
    onOpenChange,
    api_v1_course_id,
    onClose,
}: NewDeliverableModalProps) {
    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            onClose={onClose}
            isDismissable={false}
        >
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
