import { Fragment, useState, useEffect, useMemo } from 'react';
import {
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Progress,
    Spinner,
} from '@nextui-org/react';

import Button from '@components/Button/Button';
import SemesterForm from '@components/Form/SemesterForm';
import CourseMultiCreate from '@components/Form/CourseMultiCreate';
import {
    Course,
    ItemStatus,
    SemesterFormProps,
    SessionProps,
    CourseMultiCreateProps,
    UserDataProps,
    Semester,
} from '@coursefull';
import { createSemester } from '@services/semesterService';
import { PlusIcon } from '@heroicons/react/24/outline';
import { createCourse } from '@services/courseService';

interface SemesterModalBodyProps {
    semesterFormProps: SemesterFormProps;
    courseMultiCreateProps: CourseMultiCreateProps;
    page: number;
}

function SemesterModalBody({
    semesterFormProps,
    page,
    courseMultiCreateProps,
}: SemesterModalBodyProps) {
    const pages = [
        {
            title: 'Create Semester',
            body: <SemesterForm {...semesterFormProps} />,
        },
        {
            title: 'Add Courses',
            body: <CourseMultiCreate {...courseMultiCreateProps} />,
        },
    ];
    return (
        <div className="flex flex-col gap-4">
            <h2>{pages[page].title}</h2>
            <div className="overflow-auto">
                <p>{page + 1}/2</p>
                <Progress
                    aria-label="Progress"
                    value={page * 100}
                    className="max-w-md"
                />
            </div>
            {pages[page].body}
        </div>
    );
}

interface CreateSemesterModalProps extends SessionProps, UserDataProps {
    loadingUserData: boolean;
}

export default function CreateSemesterModal({
    session,
    userData,
    loadingUserData,
}: CreateSemesterModalProps) {
    const [semester, setSemester] = useState<Semester>({
        name: '',
        goal: 80,
        status: ItemStatus.NOT_STARTED,
        courses: [],
    });
    const [page, setPage] = useState(0);
    const [coursesRemaining, setCoursesRemaining] = useState(
        userData?.courses_remaining || 3
    );

    useMemo(() => {
        if (!loadingUserData && userData) {
            setCoursesRemaining(userData.courses_remaining);
        }
    }, [userData, loadingUserData]);

    const [isLoading, setIsLoading] = useState<boolean>(false);

    if (!userData) {
        return <></>;
    }

    async function handleCreateSemester(onClose: CallableFunction) {
        // TODO: Replace this all with Tanstack Query to avoid having to reload
        setIsLoading(true);
        const newSemester: Semester = await createSemester(semester, session);

        for (let course of semester.courses) {
            course = course!;
            await createCourse(
                {
                    ...course,
                    api_v1_semester_id: newSemester.id,
                },
                session
            );
        }
        onClose();
        location.reload();
    }

    const addCourse = () => {
        const newCourse: Course = {
            title: '',
            course_code: '',
            goal: 80,
            status: ItemStatus.ACTIVE,
            deliverables: []
        };
        setSemester((semester) => ({
            ...semester,
            courses: [
                ...semester.courses!,
                newCourse,
            ],
        }));
        setCoursesRemaining((coursesRemaining) => coursesRemaining - 1);
    };

    return (
        <ModalContent>
            {(onClose) =>
                loadingUserData && userData ? (
                    <Spinner />
                ) : (
                    <Fragment>
                        <ModalHeader className="flex flex-col gap-1">
                            Create New Semester
                        </ModalHeader>
                        <ModalBody>
                            <SemesterModalBody
                                courseMultiCreateProps={{
                                    coursesRemaining,
                                    setCoursesRemaining,
                                    userData,
                                    loadingUserData,
                                    semester,
                                    setSemester,
                                }}
                                semesterFormProps={{
                                    semester,
                                    setSemester,
                                }}
                                page={page}
                            />
                        </ModalBody>
                        <ModalFooter>
                            {page === 0 ? (
                                <>
                                    <div>
                                        {/* This is legit just a placeholder so the flexbox BS works */}
                                    </div>
                                    <div className="flex gap-4">
                                        <Button onPress={onClose}>Close</Button>
                                        <Button
                                            onPress={() => {
                                                setPage(1);
                                            }}
                                            isLoading={isLoading}
                                            buttonType="confirm"
                                        >
                                            Next
                                        </Button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <Button
                                        onPress={addCourse}
                                        isDisabled={coursesRemaining <= 0}
                                        startContent={
                                            <PlusIcon className="h-6 w-6" />
                                        }
                                        endContent={
                                            <span>
                                                ({semester.courses!.length} /{' '}
                                                {coursesRemaining +
                                                    semester.courses!.length}
                                                )
                                            </span>
                                        }
                                    >
                                        Add Course
                                    </Button>
                                    <div className="flex gap-4">
                                        <Button
                                            onPress={() => {
                                                setPage(0);
                                            }}
                                        >
                                            Go Back
                                        </Button>
                                        <Button
                                            onPress={() => {
                                                handleCreateSemester(onClose);
                                            }}
                                            isLoading={isLoading}
                                            buttonType="confirm"
                                        >
                                            Create!
                                        </Button>
                                    </div>
                                </>
                            )}
                        </ModalFooter>
                    </Fragment>
                )
            }
        </ModalContent>
    );
}
