import { Fragment, useState } from 'react';
import {
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from '@nextui-org/react';

import Button from '@components/Button/Button';
import { Course, ItemStatus, Semester } from '@coursefull';
import { SessionProps } from '@coursefull';
import SemesterForm from '../Form/SemesterForm';
import { updateSemester } from '@services/semesterService';
import CourseForm from '@components/Form/CourseForm';
import { updateCourse } from '@services/courseService';

interface EditCourseModalProps extends SessionProps {
    course: Course | null;
}

export default function UpdateSemesterModal({
    session,
    course,
}: EditCourseModalProps) {
    const [title, setTitle] = useState<string>(course?.title || '');
    const [courseCode, setCourseCode] = useState<string>(
        course?.course_code || ''
    );
    const [status, setStatus] = useState<ItemStatus>(
        course?.status || ItemStatus.NOT_STARTED
    );

    const [isLoading, setIsLoading] = useState<boolean>(false);

    async function handleUpdateCourse(onClose: CallableFunction) {
        setIsLoading(true);
        await updateCourse(
            {
                id: course?.id,
                title,
                course_code: courseCode,
                status,
            },
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
                            title={title}
                            setTitle={setTitle}
                            code={courseCode}
                            setCode={setCourseCode}
                            status={status}
                            setStatus={setStatus}
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
