'use client';

import {
    ArrowLeftIcon,
    CogIcon,
    PencilIcon,
    PlusIcon,
    TrashIcon,
} from '@heroicons/react/24/outline';
import {
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    Modal,
    Spinner,
    Divider,
    useDisclosure,
} from '@nextui-org/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Fragment, Suspense, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { Deliverable, ItemStatus, SessionProps, Updated } from '@coursefull';

import Button from '@components/Button/Button';
import DeliverableCard from '@components/Card/Deliverable';
import CreateDeliverableModal from '@components/Modal/CreateDeliverable';
import UpdateCourseModal from '@components/Modal/UpdateCourse';
import UpdateDeliverableModal from '@components/Modal/UpdateDeliverable';

import { ReadableStatus, semesterURL } from '@lib/helpers';
import { useProtectedEndpoint, useSession } from '@lib/supabase/SessionContext';

import { deleteCourse, getCourse } from '@services/courseService';
import DeliverableDetail from '@components/Detail/Deliverable';

// TODO: Refactor the visual layout of this thing.

function CoursePage() {
    const router = useRouter();

    const [currentDeliverable, setCurrentDeliverable] =
        useState<Deliverable | null>(null);

    const { session, loadingSession } = useSession()!;
    useProtectedEndpoint(session, loadingSession, router);

    const searchParams = useSearchParams();
    const courseId = searchParams.get('id') || '';

    const createDeliverableModal = useDisclosure();
    const updateDeliverableModal = useDisclosure();
    const updateCourseModal = useDisclosure();

    const queryClient = useQueryClient();

    const courseQuery = useQuery({
        queryKey: ['course', courseId],
        queryFn: () => {
            return getCourse(courseId, session);
        },
        enabled: session !== null,
    });
    if (courseQuery.error) {
        throw courseQuery.error;
    }

    function goBack() {
        router.push(semesterURL(courseQuery.data?.api_v1_semester_id));
    }

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
            const backUrl = semesterURL(courseQuery.data?.api_v1_semester_id);
            queryClient.invalidateQueries({
                queryKey: ['semester', courseQuery.data?.api_v1_semester_id!],
            });
            queryClient.invalidateQueries({
                queryKey: ['course', courseId],
            });
            router.push(backUrl);
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

    return session && !courseQuery.isLoading ? (
        <Fragment>
            <Button
                startContent={<ArrowLeftIcon className="h-6 w-6" />}
                onPressEnd={goBack}
                className="my-4"
            >
                Go Back
            </Button>
            <div className="flex gap-4 justify-between">
                <h2 className="text-left font-bold">
                    {courseQuery.data?.course_code}
                </h2>
                <Dropdown>
                    <DropdownTrigger>
                        <Button
                            className="top-1"
                            endContent={<CogIcon className="h-6 w-6" />}
                        >
                            <span className="sr-only">Open course options</span>
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

            <h2 className="text-left">{courseQuery.data?.title}</h2>
            <div className="flex flex-col sm:flex-row sm:justify-between">
                <h3 className="text-left basis-1/2">
                    {ReadableStatus(
                        courseQuery.data?.status || ItemStatus.ACTIVE
                    )}
                </h3>
                <div className="flex basis-1/2 justify-between gap-8 sm:justify-end">
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
            <Divider className='my-2'></Divider>

            {/* MAIN BODY START */}
            <div className="flex gap-4 my-4 h-screen">
                <div className="w-full sm:basis-1/3 order-2 sm:order-1 flex flex-col gap-4">
                    <Button
                        className="top-2 order-last sm:order-first"
                        endContent={<PlusIcon className="h-6 w-6" />}
                        onPressEnd={createDeliverableModal.onOpen}
                        buttonType="confirm"
                    >
                        Add Deliverable
                    </Button>
                    <Divider className='mt-2'></Divider>
                    {deliverables ? (
                        deliverables.map((deliverable: Deliverable) => (
                            <DeliverableCard
                                {...(deliverable as Updated<Deliverable>)}
                                session={session}
                                handleView={() => {
                                    setCurrentDeliverable(deliverable);
                                }}
                                key={deliverable.id}
                            />
                        ))
                    ) : (
                        <p>No deliverables yet. Start by adding one!</p>
                    )}
                </div>
                <div className="w-full h-full sm:basis-2/3 order-1 flex-1 sm:order-2 flex flex-col gap-4">
                    <div className="flex-grow">
                        {currentDeliverable ? (
                            <div className='h-full'>
                                <DeliverableDetail
                                    deliverable={
                                        currentDeliverable as Updated<Deliverable>
                                    }
                                    session={session}
                                    handleEdit={() => {
                                        updateDeliverableModal.onOpen();
                                    }}
                                    handleExit={() => {}}
                                    handleDelete={() => {}}
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
                                {deliverables && (
                                    <p className="text-center">
                                        Click on any deliverable to view more
                                        details.
                                    </p>
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
                    deliverable={currentDeliverable}
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
        <div className="flex justify-center">
            <div className="flex flex-col">
                <Spinner label="Loading..." size="lg" />
            </div>
        </div>
    );
}

export default function CourseDashboard() {
    return (
        <Suspense>
            <CoursePage />
        </Suspense>
    );
}
