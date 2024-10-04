import { AxiosResponse } from 'axios';
import { Fragment, useState, useEffect } from 'react';
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
    const [name, setName] = useState('');
    const [goal, setGoal] = useState('80');
    const [status, setStatus] = useState<ItemStatus>(ItemStatus.NOT_STARTED);
    const [courses, setCourses] = useState<Partial<Course[]>>([]);
    const [page, setPage] = useState(0);
    const [coursesRemaining, setCoursesRemaining] = useState(
        userData?.courses_remaining || 3
    );

    useEffect(() => {
        if (!loadingUserData && userData) {
            setCoursesRemaining(userData.courses_remaining);
        }
    }, [userData, loadingUserData]);

    const [isLoading, setIsLoading] = useState<boolean>(false);

    async function handleCreateSemester(onClose: CallableFunction) {
        setIsLoading(true);
        const semesterRes = await createSemester(
            {
                name,
                goal: parseFloat(goal),
                status,
            },
            session,
            (error) => {
                alert(`Something went wrong: ${error}`);
                setIsLoading(false);
            }
        );
        if (!semesterRes.success) {
            return;
        }

        const newSemester: Semester = semesterRes.response?.data;

        for (let course of courses) {
            course = course!;
            const { success } = await createCourse(
                {
                    ...course,
                    api_v1_semester_id: newSemester.id,
                },
                session,
                (error) => {
                    alert(`Something went wrong: ${error}`);
                    console.error(error);
                    setIsLoading(false);
                }
            );
        }

        onClose();
        location.reload();
    }

    const addCourse = () => {
        setCourses([
            ...courses,
            {
                title: '',
                course_code: '',
                api_v1_semester_id: '',
                status: ItemStatus.ACTIVE,
            },
        ]);
        setCoursesRemaining(coursesRemaining - 1);
        console.log(coursesRemaining);
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
                                    courses,
                                    setCourses,
                                    coursesRemaining,
                                    setCoursesRemaining,
                                    userData: userData!,
                                    loadingUserData,
                                }}
                                semesterFormProps={{
                                    name,
                                    setName,
                                    goal,
                                    setGoal,
                                    status,
                                    setStatus,
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
                                                ({courses.length} /{' '}
                                                {coursesRemaining +
                                                    courses.length}
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
