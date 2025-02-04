'use client';

import {
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
} from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';

import Button from '@/components/Button/Button';
import CourseForm from '@/components/Form/CourseForm';
import { useCourseUpdateMutation } from '@/lib/query/course';
import { CourseSchema, courseSchema } from '@/lib/validation';
import { SavedCourse } from '@/types';

import Modal, { ModalProps } from './Modal';

interface EditCourseModalProps extends ModalProps {
    course: SavedCourse;
}

export default function EditCourseModal({
    course,
    ...props
}: EditCourseModalProps) {
    const methods = useForm<CourseSchema>({
        resolver: zodResolver(courseSchema),
        defaultValues: course,
        mode: 'onChange',
    });
    const {
        handleSubmit,
        formState: { isValid },
    } = methods;

    const { courseUpdateMutate, courseUpdatePending } =
        useCourseUpdateMutation();
    return (
        <Modal {...props} isDismissable={false}>
            <ModalContent>
                {(onClose) => (
                    <FormProvider {...methods}>
                        <ModalHeader>
                            <h3 className="text-left">
                                Edit {course.course_code}
                            </h3>
                        </ModalHeader>
                        <ModalBody>
                            <CourseForm />
                        </ModalBody>
                        <ModalFooter>
                            <Button onPress={onClose}>Cancel</Button>
                            <Button
                                onPress={() => {
                                    handleSubmit(
                                        ({ title, course_code, status }) => {
                                            const newCourse = {
                                                ...course,
                                                title,
                                                course_code,
                                                status,
                                            };

                                            courseUpdateMutate(newCourse, {
                                                onSuccess: onClose,
                                            });
                                        }
                                    );
                                }}
                                buttonType="confirm"
                                isDisabled={!isValid}
                                isLoading={courseUpdatePending}
                            >
                                Save
                            </Button>
                        </ModalFooter>
                    </FormProvider>
                )}
            </ModalContent>
        </Modal>
    );
}
