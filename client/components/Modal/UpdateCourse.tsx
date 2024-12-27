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

interface EditCourseModalProps extends SessionProps {
    course: Course | null;
}

export default function UpdateSemesterModal({
    session,
    course,
}: EditCourseModalProps) {
    assert(course);
    assert(course.id);

    const [updatedCourse, setUpdatedCourse] = useState<Course>(course);

    const [isLoading, setIsLoading] = useState<boolean>(false);

    async function handleUpdateCourse(onClose: CallableFunction) {
        setIsLoading(true);
        await updateCourse(
            updatedCourse as Updated<Course>,
            session
        );
        onClose();
        location.reload();
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
                                handleUpdateCourse(onClose);
                            }}
                            isLoading={isLoading}
                        >
                            Save
                        </Button>
                    </ModalFooter>
                </Fragment>
            )}
        </ModalContent>
    );
}
