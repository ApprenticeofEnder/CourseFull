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

interface NewSemesterModalProps extends ModalProps {}

export default function NewSemesterModal({
    isDismissable,
    ...props
}: NewSemesterModalProps) {
    return (
        <Modal {...props} isDismissable={false}>
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
