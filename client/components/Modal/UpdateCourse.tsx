import { Fragment, useState } from 'react';
import {
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from '@nextui-org/react';

import Button from '@components/Button/Button';
import { Course, Updated } from '@coursefull';
import { SessionProps } from '@coursefull';
import CourseForm from '@components/Form/CourseForm';
import { updateCourse } from '@services/courseService';
import assert from 'assert';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface EditCourseModalProps extends SessionProps {
    course: Course | null;
}

export default function UpdateSemesterModal({
    session,
    course,
}: EditCourseModalProps) {
    assert(course);
    assert(course.id);
    assert(course.api_v1_semester_id);

    const [updatedCourse, setUpdatedCourse] = useState<Course>(course);

    const queryClient = useQueryClient();

    const courseUpdate = useMutation({
        mutationFn: (course: Course) => {
            return updateCourse(
                course as Updated<Course>,
                session
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['semester', updatedCourse.api_v1_semester_id]})
        },
    });
    if (courseUpdate.error) {
        throw courseUpdate.error;
    }

    return (
        <ModalContent>
            {(onClose) => (
                <Fragment>
                    <ModalHeader className="flex flex-col gap-1">
                        Edit Course
                    </ModalHeader>
                    <ModalBody>
                        <CourseForm
                            course={updatedCourse}
                            setCourse={setUpdatedCourse}
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button onPress={onClose}>Close</Button>
                        <Button
                            buttonType="confirm"
                            onPress={() => {
                                courseUpdate.mutate(updatedCourse, {
                                    onSuccess: onClose
                                })
                            }}
                            isLoading={courseUpdate.isPending}
                        >
                            Save
                        </Button>
                    </ModalFooter>
                </Fragment>
            )}
        </ModalContent>
    );
}
