'use client';

import {
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    useDisclosure,
} from '@heroui/react';
import { useRouter } from 'next/navigation';

import Button from '@/components/Button/Button';
import { Endpoints } from '@/types';

export default function NewSemesterModal({}) {
    const router = useRouter();
    const { isOpen, onOpenChange, onClose } = useDisclosure({
        defaultOpen: true,
        onClose() {
            router.push(Endpoints.Page.DASHBOARD);
        },
    });
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
                            <h3 className="text-left">Create New Semester</h3>
                        </ModalHeader>
                        <ModalBody>Neener Neener</ModalBody>
                        <ModalFooter>
                            <Button onPress={onClose}>Cancel</Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
