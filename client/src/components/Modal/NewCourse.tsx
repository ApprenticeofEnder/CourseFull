'use client';

import {
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
} from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import Button from '@/components/Button/Button';
import { useCourseCreateMutation } from '@/lib/query/course';
import { CourseSchema, courseSchema } from '@/lib/validation';
import { ItemStatus, ModalProps } from '@/types';

import CourseForm from '../Form/CourseForm';

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
    const methods = useForm<CourseSchema>({
        resolver: zodResolver(courseSchema),
        defaultValues: DEFAULT_COURSE,
        mode: 'onChange',
    });
    const {
        handleSubmit,
        formState: { isValid },
    } = methods;

    const { courseCreateMutate, courseCreatePending } =
        useCourseCreateMutation();

    return (
        <Modal {...props} isDismissable={false}>
            <ModalContent>
                {(onClose) => (
                    <FormProvider {...methods}>
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
                                    await handleSubmit((courseData) => {
                                        courseCreateMutate(
                                            {
                                                api_v1_semester_id,
                                                ...courseData,
                                            },
                                            { onSuccess: onClose }
                                        );
                                    })();
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
