'use client';

import { Endpoints, ItemStatus } from '@coursefull';
import { useRouter, useSearchParams } from 'next/navigation';
import { Fragment, useEffect, useState, Suspense } from 'react';
import { Course, Deliverable, SessionProps } from '@coursefull';
import { ArrowLeftIcon, PlusIcon } from '@heroicons/react/24/outline';
import { getCourse } from '@services/courseService';
import { Modal, Spinner, Tab, Tabs, useDisclosure } from '@nextui-org/react';
import { ReadableStatus, semesterURL } from '@lib/helpers';
import Button from '@components/Button/Button';
import DeliverableCard from '@components/Card/Deliverable';
import CreateDeliverableModal from '@components/Modal/CreateDeliverable';
import UpdateDeliverableModal from '@components/Modal/UpdateDeliverable';
import { useProtectedEndpoint, useSession } from '@lib/supabase/sessionContext';

interface CoursePageProps extends SessionProps {}

interface DeliverableTabsProps {
    deliverables: Deliverable[];
    setCurrentDeliverable: (deliverable: Deliverable) => void;
    updateModal: { onOpen: () => void };
}

function DeliverableTabs({
    deliverables,
    setCurrentDeliverable,
    updateModal,
}: DeliverableTabsProps) {
    const [selected, setSelected] = useState('all');

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
        (deliverables.length && (
            <Tabs
                aria-label="Deliverables"
                classNames={{
                    tabList:
                        'bg-background-900 gap-6 w-full relative rounded-none p-0 border-b border-divider mb-4',
                    cursor: 'w-full bg-primary-700',
                    // tabContent:
                    //     'group-data-[selected=true]:text-[#06b6d4]',
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
                                            setCurrentDeliverable(deliverable);
                                            updateModal.onOpen();
                                        }}
                                        key={deliverable.id}
                                    />
                                )
                            )}
                        </div>
                    </Tab>
                )}
            </Tabs>
        )) || <p>No deliverables yet. Start by adding one!</p>
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
    const [currentDeliverable, setCurrentDeliverable] =
        useState<Deliverable | null>(null);

    const createModal = useDisclosure();
    const updateModal = useDisclosure();

    function goBack() {
        router.push(semesterURL(course?.api_v1_semester_id));
    }

    let mounted = true;
    useEffect(() => {
        if (course || !session) {
            return;
        }
        getCourse(courseId, session, (error) => {
            alert(error.message);
        })
            .then(({ response }) => {
                if (mounted) {
                    setCourse(response?.data || null);
                }
            })
            .catch();
        return () => {
            mounted = false;
        };
    }, [course, session]);

    useEffect(() => {
        setDeliverables(
            course?.deliverables?.sort((a, b) => {
                return a.name.localeCompare(b.name);
            }) || []
        );
    }, [course]);

    return (
        <Fragment>
            {session && course ? (
                <Fragment>
                    <Button
                        startContent={<ArrowLeftIcon className="h-6 w-6" />}
                        onPressEnd={goBack}
                        className="my-4"
                    />
                    <h2 className="text-left font-bold">
                        {course.course_code}
                    </h2>
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
                    <hr className="border-1 border-primary-100/50 my-2" />
                    <div className="my-5 sm:my-10 flex flex-col-reverse gap-5 sm:gap-10 sm:flex-row justify-between">
                        <div className="w-full sm:basis-1/4 my-auto">
                            <Button
                                endContent={
                                    <PlusIcon className="h-6 w-6"></PlusIcon>
                                }
                                onPressEnd={createModal.onOpen}
                                className="w-full top-1"
                                buttonType="confirm"
                            >
                                Add Deliverable
                            </Button>
                        </div>

                        <h3 className="sm:basis-3/4">
                            You need <strong>{course.deliverable_goal}%</strong>{' '}
                            (or better) on each deliverable to reach your goal!
                        </h3>
                    </div>
                    <DeliverableTabs
                        deliverables={deliverables}
                        setCurrentDeliverable={setCurrentDeliverable}
                        updateModal={updateModal}
                    />
                    <Modal
                        isOpen={createModal.isOpen}
                        onOpenChange={createModal.onOpenChange}
                        className="bg-sky-100"
                    >
                        <CreateDeliverableModal
                            session={session}
                            api_v1_course_id={courseId}
                        />
                    </Modal>
                    <Modal
                        isOpen={updateModal.isOpen}
                        onOpenChange={updateModal.onOpenChange}
                        className="bg-sky-100"
                    >
                        <UpdateDeliverableModal
                            session={session}
                            deliverable={currentDeliverable}
                        />
                    </Modal>
                </Fragment>
            ) : (
                <div className="flex justify-center">
                    <div className="flex flex-col">
                        <Spinner label="Loading..." size="lg" />
                    </div>
                </div>
            )}
        </Fragment>
    );
}

export default function CourseDashboard() {
    return (
        <Suspense>
            <CoursePage />
        </Suspense>
    );
}
