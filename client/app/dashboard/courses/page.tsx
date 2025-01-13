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
import { useCourseDelete, useCourseQuery } from '@lib/query/course';

function CoursePage({ session }: SessionProps) {
    const router = useRouter();

    const [currentDeliverableIndex, setCurrentDeliverableIndex] =
        useState<number>(-1);

    const searchParams = useSearchParams();
    const courseId = searchParams.get('id') || '';

    const createDeliverableModal = useDisclosure();
    const updateDeliverableModal = useDisclosure();
    const updateCourseModal = useDisclosure();

    const courseQuery = useCourseQuery(courseId, session, {
        prefetch: () => {
            setCurrentDeliverableIndex(-1);
        },
    });

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

    const courseDelete = useCourseDelete(
        courseId,
        courseQuery.data?.course_code!,
        courseQuery.data?.api_v1_semester_id!,
        session
    );

    const deliverables = useMemo(() => {
        return (
            courseQuery.data?.deliverables?.sort((a, b) => {
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
            }) || []
        );
    }, [courseQuery.data]);

    const currentDeliverable: Deliverable | null = useMemo(() => {
        if (currentDeliverableIndex < 0 || !deliverables) {
            return null;
        }
        return deliverables.at(currentDeliverableIndex) || null;
    }, [deliverables, currentDeliverableIndex]);

    const totalWeight = useMemo(() => {
        return deliverables?.reduce((totalWeight, deliverable) => {
            return totalWeight + deliverable.weight;
        }, 0);
    }, [deliverables]);

    return !courseQuery.isLoading ? (
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
                                    courseDelete.mutate(courseId, {
                                        onSuccess: () => {
                                            router.push(semesterLink);
                                        },
                                    });
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

            {/* MAIN BODY START */}
            <div className="flex flex-col md:flex-row gap-4 my-4 md:h-screen">
                <div className="w-full md:basis-1/3 order-2 md:order-1 flex flex-col gap-4">
                    <Button
                        className="top-2 order-last md:order-first flex-shrink-0"
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
                        {currentDeliverable ? (
                            <div className="h-full">
                                <DeliverableDetail
                                    deliverable={
                                        currentDeliverable as Updated<Deliverable>
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
                                            courseQuery.data.deliverable_goal.toFixed(
                                                1
                                            )}
                                        %
                                    </strong>{' '}
                                    (or better) on each deliverable to reach
                                    your goal!
                                </h3>
                                {/* TODO: Figure out how to make getting to courses more intuitive */}
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
                isDismissable={false}
                isKeyboardDismissDisabled={true}
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
                isDismissable={false}
                isKeyboardDismissDisabled={true}
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
                        totalWeight! - (currentDeliverable?.weight || 0)
                    }
                />
            </Modal>
            <Modal
                isOpen={updateCourseModal.isOpen}
                onOpenChange={updateCourseModal.onOpenChange}
                className="bg-sky-100"
                isDismissable={false}
                isKeyboardDismissDisabled={true}
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
