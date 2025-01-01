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
    Tab,
    Tabs,
    useDisclosure,
} from '@nextui-org/react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    Fragment,
    Suspense,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { useQuery } from '@tanstack/react-query';

import {
    Course,
    Deliverable,
    Endpoints,
    ItemStatus,
    SessionProps,
} from '@coursefull';

import Button from '@components/Button/Button';
import DeliverableCard from '@components/Card/Deliverable';
import CreateDeliverableModal from '@components/Modal/CreateDeliverable';
import UpdateCourseModal from '@components/Modal/UpdateCourse';
import UpdateDeliverableModal from '@components/Modal/UpdateDeliverable';

import { ReadableStatus, semesterURL } from '@lib/helpers';
import { useProtectedEndpoint, useSession } from '@lib/supabase/SessionContext';

import { deleteCourse, getCourse } from '@services/courseService';

interface DeliverableTabsProps extends SessionProps {
    deliverables: Deliverable[];
}

function DeliverableTabs({ deliverables, session }: DeliverableTabsProps) {
    type DeliverableClassifications = {
        active: Deliverable[];
        complete: Deliverable[];
    };
    const [currentDeliverable, setCurrentDeliverable] =
        useState<Deliverable | null>(null);

    const updateDeliverableModal = useDisclosure();

    const { active, complete } = useMemo(() => {
        const classifications: DeliverableClassifications = {
            active: [],
            complete: [],
        };
        return deliverables.reduce(({ active, complete }, deliverable) => {
            return {
                active:
                    deliverable.status === ItemStatus.ACTIVE
                        ? [...active, deliverable]
                        : active,
                complete:
                    deliverable.status === ItemStatus.COMPLETE
                        ? [...complete, deliverable]
                        : complete,
            };
        }, classifications);
    }, [deliverables]);

    const deliverableTabs = [
        {
            id: 'all',
            title: 'All Deliverables',
            deliverableList: deliverables,
        },
        {
            id: 'active',
            title: 'Active Deliverables',
            deliverableList: active,
        },
        {
            id: 'completed',
            title: 'Completed Deliverables',
            deliverableList: complete,
        },
    ];

    return (
        <Fragment>
            {(deliverables.length && (
                <Tabs
                    aria-label="Deliverables"
                    classNames={{
                        tabList:
                            'bg-background-900 gap-6 w-full relative rounded-none p-0 mb-4',
                        cursor: 'w-full bg-primary-700',
                        tabContent:
                            'group-data-[selected=true]:text-foreground font-bold text-lg',
                    }}
                    fullWidth
                    items={deliverableTabs}
                >
                    {(item) => (
                        <Tab
                            key={item.id}
                            title={item.title}
                            textValue={item.title}
                        >
                            <div className="flex flex-col gap-4 mb-10 ">
                                <h2>
                                    {item.title} ({item.deliverableList.length})
                                </h2>
                                {item.deliverableList.map(
                                    (deliverable: Deliverable) => (
                                        <DeliverableCard
                                            {...deliverable}
                                            session={session}
                                            handleEdit={() => {
                                                setCurrentDeliverable(
                                                    deliverable
                                                );
                                                updateDeliverableModal.onOpen();
                                            }}
                                            handleDelete={() => {
                                                location.reload();
                                            }}
                                            key={deliverable.id}
                                        />
                                    )
                                )}
                            </div>
                        </Tab>
                    )}
                </Tabs>
            )) || <p>No deliverables yet. Start by adding one!</p>}
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
        </Fragment>
    );
}

// TODO: Refactor the visual layout of this thing.

function CoursePage() {
    const router = useRouter();

    const { session, loadingSession } = useSession()!;
    useProtectedEndpoint(session, loadingSession, router);

    const searchParams = useSearchParams();
    const courseId = searchParams.get('id') || '';

    const [error, setError] = useState<any>(null);

    const createDeliverableModal = useDisclosure();
    const updateCourseModal = useDisclosure();

    const courseQuery = useQuery({
        queryKey: ['course'],
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

    async function handleDeleteCourse() {
        const confirmDelete = confirm(
            'Are you sure you want to delete this course? All of its deliverables will be deleted, and you will not get a refund for the course ticket you used to buy it.'
        );
        if (!confirmDelete) {
            return;
        }
        try {
            await deleteCourse(courseId, session);
            router.push(semesterURL(courseQuery.data?.api_v1_semester_id));
        } catch (err) {
            setError(err);
        }
    }

    if (error) {
        throw error;
    }

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
                            onPressEnd={updateCourseModal.onOpen}
                        >
                            Edit Semester
                        </DropdownItem>
                        <DropdownItem
                            key="delete"
                            endContent={<TrashIcon className="h-6 w-6" />}
                            className="text-danger-800 bg-danger-100 data-[hover=true]:bg-danger-200"
                            onPressEnd={handleDeleteCourse}
                        >
                            Delete Semester
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

            <hr className="border-1 border-primary-100/50 my-2" />
            <div className="my-5 sm:my-10 flex flex-col sm:flex-row gap-4">
                <Button
                    className="top-1 sm:basis-1/2"
                    endContent={<PlusIcon className="h-6 w-6" />}
                    onPressEnd={createDeliverableModal.onOpen}
                    buttonType="confirm"
                >
                    Add Deliverable
                </Button>
                <h3>
                    You need{' '}
                    <strong>
                        {courseQuery.data?.deliverable_goal &&
                            courseQuery.data?.deliverable_goal.toFixed(1)}
                        %
                    </strong>{' '}
                    (or better) on each deliverable to reach your goal!
                </h3>
            </div>

            <DeliverableTabs
                deliverables={courseQuery.data?.deliverables || []}
                session={session}
            />
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
