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
import { SavedCourse } from '@/types';

interface EditCourseModalProps extends Omit<ModalProps, 'children'> {
    course: SavedCourse | undefined;
}

export default function EditCourseModal({
    course,
    isOpen,
    onOpenChange,
    onClose,
}: EditCourseModalProps) {
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
                                Edit {course?.course_code}
                            </h3>
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
