'use client';

import {
    CogIcon,
    PencilIcon,
    PlusIcon,
    TrashIcon,
} from '@heroicons/react/24/outline';
import {
    BreadcrumbItem,
    Breadcrumbs,
    Divider,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    Modal,
    useDisclosure,
} from '@nextui-org/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Fragment, Suspense, useEffect, useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import assert from 'assert';

import Button from '@components/Button/Button';
import Link from '@components/Link';
import CreateCourseModal from '@components/Modal/CreateCourse';
import UpdateCourseModal from '@components/Modal/UpdateCourse';
import UpdateSemesterModal from '@components/Modal/UpdateSemester';
import {
    Course,
    Endpoints,
    SessionProps,
    Updated,
} from '@coursefull';
import {
    classNames,
} from '@lib/helpers';
import { useProtectedEndpoint, useSession } from '@lib/supabase/SessionContext';
import { deleteSemester, getSemester } from '@services/semesterService';
import CourseCard from '@components/Card/Course';
import CourseDetail from '@components/Detail/Course';
import Loading from '@app/loading';
import StatusChip from '@components/Chip/StatusChip';
import { useGradeColours } from '@lib/hooks/ui';

function SemesterPage({ session }: SessionProps) {
    const router = useRouter();

    const searchParams = useSearchParams();
    const semesterId = searchParams.get('id') || '';

    const [currentCourseIndex, setCurrentCourseIndex] = useState<number>(-1);

    const createCourseModal = useDisclosure();
    const updateCourseModal = useDisclosure();
    const updateSemesterModal = useDisclosure();

    const queryClient = useQueryClient();

    const {
        data: semesterData,
        error: semesterError,
        isLoading: semesterLoading,
    } = useQuery({
        queryKey: ['semester', semesterId],
        queryFn: () => {
            setCurrentCourseIndex(-1);
            return getSemester(semesterId, session);
        },
        enabled: session !== null,
    });
    if (semesterError) {
        throw semesterError;
    }

    const semesterDelete = useMutation({
        mutationFn: (id: string) => {
            const confirmDelete = confirm(
                `Are you sure you want to delete ${semesterData?.name}? All of its courses will be deleted, and you will not get a refund for the course tickets you used to buy them.`
            );
            if (!confirmDelete) {
                return Promise.resolve();
            }
            return deleteSemester(id, session);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['semester', semesterId],
            });
            queryClient.invalidateQueries({
                queryKey: ['progress'],
            });
            router.push(Endpoints.DASHBOARD);
        },
    });
    if (semesterDelete.error) {
        throw semesterDelete.error;
    }

    const average: number | undefined = useMemo(() => {
        if (!semesterData) {
            return undefined;
        }
        const gradedCourses = semesterData.courses.filter(
            (course) => !!course.goal && !!course.grade
        );
        if (gradedCourses.length <= 0) {
            return undefined;
        }
        return (
            gradedCourses.reduce((sum, course) => {
                return sum + course.grade!;
            }, 0) / gradedCourses.length
        );
    }, [semesterData]);

    const { textColour: averageColour } = useGradeColours(
        semesterData?.goal,
        average
    );

    if (semesterLoading) {
        return <Loading message="Loading semester..." />;
    }

    assert(semesterData);

    return (
        <Fragment>
            <div className="flex flex-col gap-2">
                <div className="flex gap-4 justify-between items-end">
                    <Breadcrumbs
                        size="lg"
                        itemsBeforeCollapse={0}
                        itemsAfterCollapse={1}
                        maxItems={1}
                    >
                        <BreadcrumbItem>
                            <Link
                                href={Endpoints.DASHBOARD}
                                className="text-xl"
                            >
                                Dashboard
                            </Link>
                        </BreadcrumbItem>
                    </Breadcrumbs>
                </div>
                <div className="grow flex justify-between">
                    <h2 className="text-left font-bold">{semesterData.name}</h2>
                    <Dropdown>
                        <DropdownTrigger>
                            <Button
                                endContent={<CogIcon className="h-6 w-6" />}
                            >
                                <span className="sr-only">
                                    Open semester options
                                </span>
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu
                            aria-label="Semester options"
                            itemClasses={{ base: ['p-4'] }}
                        >
                            <DropdownItem
                                key="edit"
                                endContent={<PencilIcon className="h-6 w-6" />}
                                className="bg-primary-800 data-[hover=true]:bg-primary-700"
                                onPressEnd={updateSemesterModal.onOpen}
                            >
                                Edit Semester
                            </DropdownItem>
                            <DropdownItem
                                key="delete"
                                endContent={<TrashIcon className="h-6 w-6" />}
                                className="text-danger-800 bg-danger-100 data-[hover=true]:bg-danger-200"
                                onPressEnd={() => {
                                    semesterDelete.mutate(semesterId);
                                }}
                            >
                                Delete Semester
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>
            </div>
            <Divider className="my-2"></Divider>

            {/* MAIN BODY START */}
            <div className="flex flex-col md:flex-row gap-4 my-4 md:h-screen">
                <div className="w-full md:basis-1/3 order-2 md:order-1 flex flex-col gap-4">
                    <Button
                        className="top-2 order-last md:order-first"
                        endContent={<PlusIcon className="h-6 w-6" />}
                        onPressEnd={createCourseModal.onOpen}
                        buttonType="confirm"
                    >
                        Add Course
                    </Button>
                    <Divider className="collapse md:visible mt-2"></Divider>
                    {semesterData?.courses && semesterData?.courses.length ? (
                        semesterData.courses.map((course: Course, index) => (
                            <CourseCard
                                {...(course as Updated<Course>)}
                                session={session}
                                handleView={() => {
                                    setCurrentCourseIndex(index);
                                }}
                                key={course.id}
                            />
                        ))
                    ) : (
                        <p>No courses yet. Start by adding one!</p>
                    )}
                </div>
                <div className="w-full md:h-full md:basis-2/3 order-1 md:flex-1 md:order-2 flex flex-col gap-4">
                    <div className="md:flex-grow">
                        {currentCourseIndex >= 0 && semesterData ? (
                            <div className="h-full">
                                <CourseDetail
                                    course={
                                        semesterData?.courses.at(
                                            currentCourseIndex
                                        ) as Updated<Course>
                                    }
                                    session={session}
                                    handleEdit={() => {
                                        updateCourseModal.onOpen();
                                    }}
                                    handleExit={() => {
                                        setCurrentCourseIndex(-1);
                                    }}
                                    handleDelete={() => {
                                        setCurrentCourseIndex(-1);
                                    }}
                                />
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2 p-2">
                                <h2 className="text-left flex flex-col items-start gap-2">
                                    <span>{semesterData.name}</span>
                                    <StatusChip status={semesterData.status} />
                                </h2>
                                <div className="grid grid-cols-2 min-w-fit w-1/4 !text-lg">
                                    <h4>Average:</h4>
                                    <h4
                                        className={classNames(
                                            averageColour,
                                            'text-right'
                                        )}
                                    >
                                        {average === undefined
                                            ? '--'
                                            : average.toFixed(1)}{' '}
                                        %
                                    </h4>
                                    <h4>Goal:</h4>
                                    <h4 className="text-right">
                                        {semesterData.goal.toFixed(1)} %
                                    </h4>
                                    <h4>Courses:</h4>
                                    <h4 className="text-right">
                                        {semesterData.courses.length}
                                    </h4>
                                </div>
                                {semesterData?.courses && (
                                    <p>
                                        Click or tap on any course to view more
                                        details.
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Modal
                isOpen={createCourseModal.isOpen}
                onOpenChange={createCourseModal.onOpenChange}
                className="bg-sky-100"
            >
                <CreateCourseModal
                    session={session}
                    api_v1_semester_id={semesterId}
                />
            </Modal>
            <Modal
                isOpen={updateCourseModal.isOpen}
                onOpenChange={updateCourseModal.onOpenChange}
                className="bg-sky-100"
            >
                <UpdateCourseModal
                    session={session}
                    course={
                        semesterData?.courses.at(currentCourseIndex) || null
                    }
                />
            </Modal>
            <Modal
                isOpen={updateSemesterModal.isOpen}
                onOpenChange={updateSemesterModal.onOpenChange}
                className="bg-sky-100"
            >
                <UpdateSemesterModal
                    session={session}
                    semester={semesterData!}
                />
                <></>
            </Modal>
        </Fragment>
    );
}

export default function SemesterDashboard() {
    const { session, loadingSession } = useSession();
    useProtectedEndpoint(session, loadingSession);
    return (
        <Suspense>
            {session ? (
                <SemesterPage session={session} />
            ) : (
                <Loading message="Loading semester..." />
            )}
        </Suspense>
    );
}
