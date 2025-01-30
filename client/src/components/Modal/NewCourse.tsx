'use client';

import {
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
} from '@heroui/react';

import Button from '@/components/Button/Button';
import { ModalProps } from '@/types';

interface NewCourseModalProps extends ModalProps {
    api_v1_semester_id: string;
}

export default function NewCourseModal({
    api_v1_semester_id,
    isDismissable,
    ...props
}: NewCourseModalProps) {
    return (
        <Modal {...props} isDismissable={false}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader>
                            <h3 className="text-left">Create New Course</h3>
                        </ModalHeader>
                        <ModalBody>{api_v1_semester_id}</ModalBody>
                        <ModalFooter>
                            <Button onPress={onClose}>Cancel</Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
