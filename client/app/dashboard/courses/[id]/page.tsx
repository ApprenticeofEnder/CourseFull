'use client';

import { Endpoints } from '@/lib/enums';
import { useSupabaseSession } from '@/supabase';
import { useRouter } from 'next/navigation';
import { Fragment, useEffect, useState } from 'react';
import { Course } from '@/lib/types';
import { ArrowLeftIcon, PlusIcon } from '@heroicons/react/24/outline';
import { getCourse } from '@/services/courseService';
import { Modal, Spinner, useDisclosure } from '@nextui-org/react';
import { ReadableStatus, semesterURL } from '@/lib/helpers';
import ConfirmButton from '@/components/Button/ConfirmButton';
import DeliverableCard from '@/components/Card/Deliverable';
import Button from '@/components/Button/Button';
import CreateDeliverableModal from '@/components/Modal/CreateDeliverable';

export default function CourseDashboard({
    params,
}: {
    params: { id: string };
}) {
    const [course, setCourse] = useState<Course | null>(null);
    const router = useRouter();
    const session = useSupabaseSession((session) => {
        if (!session) {
            router.push(Endpoints.ROOT);
            return;
        }
    });

    const { isOpen, onOpen, onOpenChange } = useDisclosure();

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
                setCourse(response?.data || null);
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
                    <div className="flex flex-row gap-4">
                        <h3>{ReadableStatus(course.status)}</h3>
                        <h3>|</h3>
                        <h3>Goal: {course.goal}%</h3>
                        <h3>|</h3>
                        <h3>Grade: {course.grade || '--'}%</h3>
                    </div>
                    <hr className="border-1 border-primary-100/50 my-2" />
                    <div className="my-5">
                        <ConfirmButton
                            endContent={
                                <PlusIcon className="h-6 w-6"></PlusIcon>
                            }
                            onPressEnd={onOpen}
                        >
                            Add Deliverable
                        </ConfirmButton>
                    </div>
                    {(course?.deliverables?.length && (
                        <div className="flex flex-col gap-4">
                            {course.deliverables
                                .sort((a, b) => {
                                    return a.name.localeCompare(b.name);
                                })
                                .map((deliverable) => (
                                    <DeliverableCard {...deliverable} />
                                ))}
                        </div>
                    )) || <p>No deliverables yet. Start by adding one!</p>}
                    <Modal
                        isOpen={isOpen}
                        onOpenChange={onOpenChange}
                        className="bg-sky-100"
                    >
                        <CreateDeliverableModal
                            session={session}
                            api_v1_course_id={params.id}
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
