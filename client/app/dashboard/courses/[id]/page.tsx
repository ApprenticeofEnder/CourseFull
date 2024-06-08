'use client';

import { Endpoints } from '@/lib/enums';
import { useSupabaseSession } from '@/supabase';
import { useRouter } from 'next/navigation';
import { Fragment, useEffect, useState } from 'react';
import { Course, Deliverable } from '@/lib/types';
import { ArrowLeftIcon, PlusIcon } from '@heroicons/react/24/outline';
import { getCourse } from '@/services/courseService';
import { Modal, Spinner, useDisclosure } from '@nextui-org/react';
import { ReadableStatus, semesterURL } from '@/lib/helpers';
import ConfirmButton from '@/components/Button/ConfirmButton';
import DeliverableCard from '@/components/Card/Deliverable';
import Button from '@/components/Button/Button';
import CreateDeliverableModal from '@/components/Modal/CreateDeliverable';
import UpdateDeliverableModal from '@/components/Modal/UpdateDeliverable';

export default function CourseDashboard({
    params,
}: {
    params: { id: string };
}) {
    const [course, setCourse] = useState<Course | null>(null);
    const [currentDeliverable, setCurrentDeliverable] =
        useState<Deliverable | null>(null);
    const router = useRouter();
    const session = useSupabaseSession((session) => {
        if (!session) {
            router.push(Endpoints.ROOT);
            return;
        }
    });

    // const { isOpen, onOpen, onOpenChange } = useDisclosure();
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
        getCourse(params.id, session, (error) => {
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
                            <ConfirmButton
                                endContent={
                                    <PlusIcon className="h-6 w-6"></PlusIcon>
                                }
                                onPressEnd={createModal.onOpen}
                                className="w-full top-1"
                            >
                                Add Deliverable
                            </ConfirmButton>
                        </div>

                        <h3 className="sm:basis-3/4">
                            You need <strong>{course.deliverable_goal}%</strong>{' '}
                            (or better) on each deliverable to reach your goal!
                        </h3>
                    </div>
                    {(course?.deliverables?.length && (
                        <div className="flex flex-col gap-4 mb-10">
                            {course.deliverables
                                .sort((a, b) => {
                                    return a.name.localeCompare(b.name);
                                })
                                .map((deliverable) => (
                                    <DeliverableCard
                                        {...deliverable}
                                        handleEdit={() => {
                                            setCurrentDeliverable(deliverable);
                                            updateModal.onOpen();
                                        }}
                                        key={deliverable.id}
                                    />
                                ))}
                        </div>
                    )) || <p>No deliverables yet. Start by adding one!</p>}
                    <Modal
                        isOpen={createModal.isOpen}
                        onOpenChange={createModal.onOpenChange}
                        className="bg-sky-100"
                    >
                        <CreateDeliverableModal
                            session={session}
                            api_v1_course_id={params.id}
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
