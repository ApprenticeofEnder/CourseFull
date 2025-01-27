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

interface NewCourseModalProps {
    api_v1_semester_id: string;
}

export default function NewCourseModal({
    api_v1_semester_id,
}: NewCourseModalProps) {
    const router = useRouter();
    const { isOpen, onOpenChange, onClose } = useDisclosure({
        defaultOpen: true,
        onClose() {
            router.back();
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
                            <h3 className="text-left">Create New Course</h3>
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
