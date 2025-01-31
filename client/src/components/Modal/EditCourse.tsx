'use client';

import {
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalProps,
} from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';

import Button from '@/components/Button/Button';
import { useCourseUpdateMutation } from '@/lib/query/course';
import { CourseSchema, courseSchema } from '@/lib/validation';
import { SavedCourse } from '@/types';

import CourseForm from '../Form/CourseForm';

interface EditCourseModalProps extends Omit<ModalProps, 'children'> {
    course: SavedCourse;
}

export default function EditCourseModal({
    course,
    isOpen,
    onOpenChange,
    onClose,
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
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            onClose={onClose}
            isDismissable={false}
        >
            <ModalContent>
                {(onClose) => (
                    <FormProvider {...methods}>
                        <ModalHeader>
                            <h3 className="text-left">
                                Edit {course?.course_code}
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
                                            const newCourse = course
                                                ? {
                                                      ...course,
                                                      title,
                                                      course_code,
                                                      status,
                                                  }
                                                : undefined;
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
