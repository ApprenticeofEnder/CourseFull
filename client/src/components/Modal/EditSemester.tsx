'use client';

import {
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
} from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import Button from '@/components/Button/Button';
import SemesterForm from '@/components/Form/SemesterForm';
import { useSemesterCreateMutation } from '@/lib/query/semester';
import { SemesterSchema, semesterSchema } from '@/lib/validation';
import { SavedSemester } from '@/types';

import Modal, { type ModalProps } from './Modal';

interface EditSemesterModalProps extends ModalProps {
    semester: SavedSemester;
}

export default function NewSemesterModal({
    semester,
    ...props
}: EditSemesterModalProps) {
    const formMethods = useForm<SemesterSchema>({
        resolver: zodResolver(semesterSchema),
        defaultValues: semester,
        mode: 'onChange',
    });

    const {
        handleSubmit,
        formState: { isValid },
    } = formMethods;

    const { semesterCreateMutate, semesterCreatePending } =
        useSemesterCreateMutation();

    const submitForm = useCallback(
        async (onClose: () => void) => {
            const submit = handleSubmit((semesterData) => {
                semesterCreateMutate(semesterData, {
                    onSuccess: onClose,
                });
            });
            await submit();
        },
        [handleSubmit, semesterCreateMutate]
    );

    return (
        <Modal {...props} isDismissable={false}>
            <ModalContent>
                {(onClose) => (
                    <FormProvider {...formMethods}>
                        <ModalHeader>
                            <h3 className="text-left">Edit {}</h3>
                        </ModalHeader>
                        <ModalBody>
                            <SemesterForm />
                        </ModalBody>
                        <ModalFooter>
                            <Button onPress={onClose}>Cancel</Button>
                            <Button
                                onPress={async () => {
                                    await submitForm(onClose);
                                }}
                                buttonType="confirm"
                                isLoading={semesterCreatePending}
                                isDisabled={!isValid}
                            >
                                Create!
                            </Button>
                        </ModalFooter>
                    </FormProvider>
                )}
            </ModalContent>
        </Modal>
    );
}
