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
import CourseForm from '@/components/Form/CourseForm';
import { useCourseCreateMutation } from '@/lib/query/course';
import { CourseSchema, courseSchema } from '@/lib/validation';
import { ItemStatus } from '@/types';

import Modal, { ModalProps } from './Modal';

interface NewCourseModalProps extends ModalProps {
    api_v1_semester_id: string;
}

const DEFAULT_COURSE: CourseSchema = {
    title: '',
    course_code: '',
    status: ItemStatus.ACTIVE,
};

export default function NewCourseModal({
    api_v1_semester_id,
    ...props
}: NewCourseModalProps) {
    const formMethods = useForm<CourseSchema>({
        resolver: zodResolver(courseSchema),
        defaultValues: DEFAULT_COURSE,
        mode: 'onChange',
    });
    const {
        handleSubmit,
        formState: { isValid },
    } = formMethods;

    const { courseCreateMutate, courseCreatePending } =
        useCourseCreateMutation();

    const submitForm = useCallback(
        async (onClose: () => void) => {
            const submit = handleSubmit((courseData) => {
                courseCreateMutate(
                    { api_v1_semester_id, ...courseData },
                    {
                        onSuccess: onClose,
                    }
                );
            });
            await submit();
        },
        [handleSubmit, courseCreateMutate]
    );

    return (
        <Modal className="bg-background-900" {...props} isDismissable={false}>
            <ModalContent>
                {(onClose) => (
                    <FormProvider {...formMethods}>
                        <ModalHeader>
                            <h3 className="text-left">Create New Course</h3>
                        </ModalHeader>
                        <ModalBody>
                            <CourseForm />
                        </ModalBody>
                        <ModalFooter>
                            <Button onPress={onClose}>Cancel</Button>
                            <Button
                                onPress={async () => {
                                    await submitForm(onClose);
                                }}
                                buttonType="confirm"
                                isLoading={courseCreatePending}
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
