'use client';

import {
    Fragment,
    useEffect,
    useState,
    Suspense,
    useMemo,
    useRef,
} from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    ArrowLeftIcon,
    PencilIcon,
    PlusIcon,
    TrashIcon,
} from '@heroicons/react/24/outline';
import { Modal, Spinner, Tab, Tabs, useDisclosure } from '@nextui-org/react';

import {
    Endpoints,
    ItemStatus,
    Course,
    Deliverable,
    SessionProps,
} from '@coursefull';

import Button from '@components/Button/Button';
import DeliverableCard from '@components/Card/Deliverable';
import CreateDeliverableModal from '@components/Modal/CreateDeliverable';
import UpdateCourseModal from '@components/Modal/UpdateCourse';
import UpdateDeliverableModal from '@components/Modal/UpdateDeliverable';

import { ReadableStatus, semesterURL } from '@lib/helpers';
import { useProtectedEndpoint, useSession } from '@lib/supabase/sessionContext';

import { deleteCourse, getCourse } from '@services/courseService';

interface CoursePageProps extends SessionProps {}

interface DeliverableTabsProps extends SessionProps {
    deliverables: Deliverable[];
}

function DeliverableTabs({ deliverables, session }: DeliverableTabsProps) {
    const [currentDeliverable, setCurrentDeliverable] =
        useState<Deliverable | null>(null);

    const updateDeliverableModal = useDisclosure();

    const activeDeliverables: Deliverable[] = [];
    const completeDeliverables: Deliverable[] = [];

    deliverables?.forEach((deliverable) => {
        switch (deliverable.status) {
            case ItemStatus.ACTIVE:
                activeDeliverables.push(deliverable);
                break;
            case ItemStatus.COMPLETE:
                completeDeliverables.push(deliverable);
                break;
            default:
                break;
        }
    });

    const deliverableTabs = [
        {
            id: 'all',
            title: 'All Deliverables',
            deliverableList: deliverables,
        },
        {
            id: 'active',
            title: 'Active Deliverables',
            deliverableList: activeDeliverables,
        },
        {
            id: 'completed',
            title: 'Completed Deliverables',
            deliverableList: completeDeliverables,
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
                        <Tab key={item.id} title={item.title}>
                            <div className="flex flex-col gap-4 mb-10 ">
                                <h2>
                                    {item.title} ({item.deliverableList.length})
                                </h2>
                                {item.deliverableList.map(
                                    (deliverable: Deliverable) => (
                                        <DeliverableCard
                                            {...deliverable}
                                            handleEdit={() => {
                                                setCurrentDeliverable(
                                                    deliverable
                                                );
                                                updateDeliverableModal.onOpen();
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
            >
                <UpdateDeliverableModal
                    session={session}
                    deliverable={currentDeliverable}
                />
            </Modal>
        </Fragment>
    );
}

function CoursePage() {
    const router = useRouter();

    const { session, loadingSession } = useSession()!;
    useProtectedEndpoint(session, loadingSession, router);

    const searchParams = useSearchParams();
    const courseId = searchParams.get('id') || '';

    const [course, setCourse] = useState<Course | null>(null);
    const [deliverables, setDeliverables] = useState<Deliverable[]>([]);

    const createDeliverableModal = useDisclosure();
    const updateCourseModal = useDisclosure();

    function goBack() {
        router.push(semesterURL(course?.api_v1_semester_id));
    }

    async function handleDeleteCourse() {
        const confirmDelete = confirm(
            'Are you sure you want to delete this course? All of its deliverables will be deleted, and you will not get a refund for the course ticket you used to buy it.'
        );
        if (!confirmDelete) {
            return;
        }
        const { success } = await deleteCourse(courseId, session, (error) => {
            alert(`Something went wrong: ${error.message}`);
        });
        if (!success) {
            return;
        }
        router.push(Endpoints.ROOT);
    }

    let mounted = useRef(true);

    useEffect(() => {
        if (course || !session) {
            return;
        }
        getCourse(courseId, session, (error) => {
            alert(error.message);
        })
            .then(({ response }) => {
                if (mounted.current) {
                    setCourse(response?.data || null);
                }
            })
            .catch();
        return () => {
            mounted.current = false;
        };
    }, [course, session, courseId]);

    useMemo(() => {
        setDeliverables(
            course?.deliverables?.sort((a, b) => {
                return a.name.localeCompare(b.name);
            }) || []
        );
    }, [course]);

    return session && course ? (
        <Fragment>
            <Button
                startContent={<ArrowLeftIcon className="h-6 w-6" />}
                onPressEnd={goBack}
                className="my-4"
            >
                Go Back
            </Button>
            <h2 className="text-left font-bold">{course.course_code}</h2>
            <h2 className="text-left">{course.title}</h2>
            <div className="flex flex-col sm:flex-row sm:justify-between">
                <h3 className="text-left basis-1/2">
                    {ReadableStatus(course.status)}
                </h3>
                <div className="flex basis-1/2 justify-between gap-8 sm:justify-end">
                    <h3 className="text-left">
                        Grade: {course.grade || '--'}%
                    </h3>
                    <h3 className="text-right">Goal: {course.goal}%</h3>
                </div>
            </div>
            <div className="my-5 flex gap-4">
                <Button
                    className="top-1"
                    endContent={<PlusIcon className="h-6 w-6" />}
                    onPressEnd={createDeliverableModal.onOpen}
                    buttonType="confirm"
                >
                    Add Deliverable
                </Button>
                <Button
                    className="top-1"
                    endContent={<PencilIcon className="h-6 w-6" />}
                    onPressEnd={updateCourseModal.onOpen}
                >
                    Edit Course
                </Button>
                <Button
                    className="top-1"
                    endContent={<TrashIcon className="h-6 w-6" />}
                    onPressEnd={handleDeleteCourse}
                    buttonType="danger"
                >
                    Delete Course
                </Button>
            </div>
            <hr className="border-1 border-primary-100/50 my-2" />
            <h3 className="my-5 sm:my-10">
                You need <strong>{course.deliverable_goal}%</strong> (or better)
                on each deliverable to reach your goal!
            </h3>
            <DeliverableTabs deliverables={deliverables} session={session} />
            <Modal
                isOpen={createDeliverableModal.isOpen}
                onOpenChange={createDeliverableModal.onOpenChange}
                className="bg-sky-100"
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
            >
                <UpdateCourseModal session={session} course={course} />
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
