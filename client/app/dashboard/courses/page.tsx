'use client';

import {
    CogIcon,
    PencilIcon,
    PlusIcon,
    TrashIcon,
} from '@heroicons/react/24/outline';
import {
    Breadcrumbs,
    BreadcrumbItem,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    Modal,
    Divider,
    useDisclosure,
} from '@nextui-org/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Fragment, Suspense, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
    Deliverable,
    Endpoints,
    ItemStatus,
    SessionProps,
    Updated,
} from '@coursefull';

import Loading from '@app/loading';
import Button from '@components/Button/Button';
import DeliverableCard from '@components/Card/Deliverable';
import DeliverableDetail from '@components/Detail/Deliverable';
import CreateDeliverableModal from '@components/Modal/CreateDeliverable';
import UpdateCourseModal from '@components/Modal/UpdateCourse';
import UpdateDeliverableModal from '@components/Modal/UpdateDeliverable';
import Link from '@components/Link';
import { ReadableStatus, semesterURL } from '@lib/helpers';
import { useProtectedEndpoint, useSession } from '@lib/supabase/SessionContext';
import { deleteCourse, getCourse } from '@services/courseService';
import { getSemester } from '@services/semesterService';

function CoursePage({ session }: SessionProps) {
    const router = useRouter();

    const [currentDeliverableIndex, setCurrentDeliverableIndex] =
        useState<number>(-1);

    const searchParams = useSearchParams();
    const courseId = searchParams.get('id') || '';

    const createDeliverableModal = useDisclosure();
    const updateDeliverableModal = useDisclosure();
    const updateCourseModal = useDisclosure();

    const queryClient = useQueryClient();

    const courseQuery = useQuery({
        queryKey: ['course', courseId],
        queryFn: () => {
            setCurrentDeliverableIndex(-1);
            return getCourse(courseId, session);
        },
        enabled: session !== null,
    });
    if (courseQuery.error) {
        throw courseQuery.error;
    }

    const semesterQuery = useQuery({
        queryKey: ['semester', courseQuery.data?.api_v1_semester_id!],
        queryFn: () => {
            return getSemester(courseQuery.data?.api_v1_semester_id!, session);
        },
        enabled: session !== null && !!courseQuery.data,
    });

    if (semesterQuery.error) {
        throw semesterQuery.error;
    }

    const semesterLink = useMemo(() => {
        return semesterURL(courseQuery.data?.api_v1_semester_id);
    }, [courseQuery.data]);

    const courseDelete = useMutation({
        mutationFn: (id: string) => {
            const confirmDelete = confirm(
                `Are you sure you want to delete ${courseQuery.data?.course_code}? All of its deliverables will be deleted, and you will not get a refund for the course ticket you used to buy it.`
            );
            if (!confirmDelete) {
                return Promise.resolve();
            }
            return deleteCourse(id, session);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['semester', courseQuery.data?.api_v1_semester_id!],
            });
            queryClient.invalidateQueries({
                queryKey: ['course', courseId],
            });
            router.push(semesterLink);
        },
    });
    if (courseDelete.error) {
        throw courseDelete.error;
    }

    const deliverables = useMemo(() => {
        return courseQuery.data?.deliverables?.sort((a, b) => {
            if (a.status === b.status) {
                const aDeadline = a.deadline.toDate();
                const bDeadline = b.deadline.toDate();
                return aDeadline.getTime() - bDeadline.getTime();
            }
            if (a.status === ItemStatus.ACTIVE) {
                return -1;
            } else {
                return 1;
            }
        });
    }, [courseQuery.data]);

    const totalWeight = useMemo(() => {
        return deliverables?.reduce((totalWeight, deliverable) => {
            return totalWeight + deliverable.weight;
        }, 0);
    }, [deliverables]);

    return session && !courseQuery.isLoading ? (
        <Fragment>
            <div className="flex flex-col gap-2">
                <div className="flex flex-wrap gap-4 justify-between items-end">
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
                        <BreadcrumbItem>
                            <Link href={semesterLink} className="text-xl">
                                {semesterQuery.data?.name}
                            </Link>
                        </BreadcrumbItem>
                    </Breadcrumbs>
                </div>
                <div className="grow flex justify-between">
                    <h2 className="text-left font-bold flex flex-wrap">
                        <span>{courseQuery.data?.course_code}:&nbsp;</span>
                        <span>{courseQuery.data?.title}</span>
                    </h2>
                    <Dropdown>
                        <DropdownTrigger>
                            <Button
                                className="top-1"
                                endContent={<CogIcon className="h-6 w-6" />}
                            >
                                <span className="sr-only">
                                    Open course options
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
                                onPressEnd={updateCourseModal.onOpen}
                            >
                                Edit Course
                            </DropdownItem>
                            <DropdownItem
                                key="delete"
                                endContent={<TrashIcon className="h-6 w-6" />}
                                className="text-danger-800 bg-danger-100 data-[hover=true]:bg-danger-200"
                                onPressEnd={() => {
                                    courseDelete.mutate(courseId);
                                }}
                            >
                                Delete Course
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>
                <div className="flex flex-col md:flex-row md:justify-between">
                    <h3 className="text-left basis-1/2">
                        {ReadableStatus(
                            courseQuery.data?.status || ItemStatus.ACTIVE
                        )}
                    </h3>
                    <div className="flex basis-1/2 justify-between gap-8 md:justify-end">
                        <h3 className="text-left">
                            Grade:{' '}
                            {(courseQuery.data?.grade &&
                                Math.round(courseQuery.data?.grade)) ||
                                '--'}
                            %
                        </h3>
                        <h3 className="text-right">
                            Goal: {courseQuery.data?.goal}%
                        </h3>
                    </div>
                </div>
            </div>
            <Divider className="my-2"></Divider>

            {/* TODO: Fix the bug with adding more than 100% weight worth of deliverables */}

            {/* MAIN BODY START */}
            <div className="flex flex-col md:flex-row gap-4 my-4 md:h-screen">
                <div className="w-full md:basis-1/3 order-2 md:order-1 flex flex-col gap-4">
                    <Button
                        className="top-2 order-last md:order-first"
                        endContent={<PlusIcon className="h-6 w-6" />}
                        onPressEnd={createDeliverableModal.onOpen}
                        buttonType="confirm"
                    >
                        Add Deliverable
                    </Button>
                    <Divider className="collapse md:visible mt-2"></Divider>
                    {deliverables?.length ? (
                        deliverables.map((deliverable: Deliverable, index) => (
                            <DeliverableCard
                                {...(deliverable as Updated<Deliverable>)}
                                session={session}
                                handleView={() => {
                                    setCurrentDeliverableIndex(index);
                                }}
                                key={deliverable.id}
                            />
                        ))
                    ) : (
                        <p>No deliverables yet. Start by adding one!</p>
                    )}
                </div>
                <div className="w-full md:h-full md:basis-2/3 order-1 md:flex-1 md:order-2 flex flex-col gap-4">
                    <div className="md:flex-grow">
                        {currentDeliverableIndex >= 0 && deliverables ? (
                            <div className="h-full">
                                <DeliverableDetail
                                    deliverable={
                                        deliverables.at(
                                            currentDeliverableIndex
                                        ) as Updated<Deliverable>
                                    }
                                    session={session}
                                    handleEdit={() => {
                                        updateDeliverableModal.onOpen();
                                    }}
                                    handleExit={() => {
                                        setCurrentDeliverableIndex(-1);
                                    }}
                                    handleDelete={() => {
                                        setCurrentDeliverableIndex(-1);
                                    }}
                                />
                            </div>
                        ) : (
                            <div className="flex flex-col gap-4">
                                <h3>
                                    You need{' '}
                                    <strong>
                                        {courseQuery.data?.deliverable_goal &&
                                            courseQuery.data?.deliverable_goal.toFixed(
                                                1
                                            )}
                                        %
                                    </strong>{' '}
                                    (or better) on each deliverable to reach
                                    your goal!
                                </h3>
                                {deliverables?.length ? (
                                    <p className="text-center">
                                        Click or tap on any deliverable to view
                                        more details.
                                    </p>
                                ) : (
                                    <></>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Modal
                isOpen={createDeliverableModal.isOpen}
                onOpenChange={createDeliverableModal.onOpenChange}
                className="bg-sky-100"
                scrollBehavior="inside"
            >
                <CreateDeliverableModal
                    session={session}
                    api_v1_course_id={courseId}
                    totalWeight={totalWeight || 0}
                />
            </Modal>
            <Modal
                isOpen={updateDeliverableModal.isOpen}
                onOpenChange={updateDeliverableModal.onOpenChange}
                className="bg-sky-100"
                scrollBehavior="inside"
            >
                <UpdateDeliverableModal
                    session={session}
                    deliverable={
                        (deliverables?.at(
                            currentDeliverableIndex
                        ) as Updated<Deliverable>) || null
                    }
                    totalWeight={
                        totalWeight! -
                            (
                                deliverables?.at(
                                    currentDeliverableIndex
                                ) as Updated<Deliverable>
                            ).weight || 0
                    }
                />
            </Modal>
            <Modal
                isOpen={updateCourseModal.isOpen}
                onOpenChange={updateCourseModal.onOpenChange}
                className="bg-sky-100"
                scrollBehavior="inside"
            >
                <UpdateCourseModal
                    session={session}
                    course={courseQuery.data!}
                />
            </Modal>
        </Fragment>
    ) : (
        <Loading message="Loading course..." />
    );
}

export default function CourseDashboard() {
    const { session, loadingSession } = useSession();
    useProtectedEndpoint(session, loadingSession);
    return (
        <Suspense>
            {session ? (
                <CoursePage session={session} />
            ) : (
                <Loading message="Loading course..." />
            )}
        </Suspense>
    );
}
