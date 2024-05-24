'use client';

import Button from '@/components/Button/Button';
import ConfirmButton from '@/components/Button/ConfirmButton';
import CourseCard from '@/components/Card/Course';
import CreateCourseModal from '@/components/Modal/CreateCourse';
import { Endpoints } from '@/lib/enums';
import { ReadableStatus } from '@/lib/helpers';
import { Semester } from '@/lib/types';
import { getSemester } from '@/services/semesterService';
import { useSupabaseSession } from '@/supabase';
import { ArrowLeftIcon, PlusIcon } from '@heroicons/react/24/outline';
import { Modal, Spinner, useDisclosure } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { Fragment, useEffect, useState } from 'react';

interface SemesterDashboardProps {
    params: { id: string };
}

export default function SemesterDashboard({ params }: SemesterDashboardProps) {
    const [semester, setSemester] = useState<Semester | null>(null);
    const [semesters, setSemesters] = useState<Semester[]>([]);
    const router = useRouter();
    const session = useSupabaseSession((session) => {
        if (!session) {
            router.push(Endpoints.ROOT);
            return;
        }
    });

    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    function goBack() {
        router.push(Endpoints.ROOT);
    }

    let mounted = true;
    useEffect(() => {
        if (semester || !session) {
            return;
        }
        getSemester(params.id, session, (error) => {
            alert(error.message);
        })
            .then(({ response }) => {
                if (mounted) {
                    setSemester(response?.data || null);
                }
            })
            .catch();
        return () => {
            mounted = false;
        };
    }, [semester, session]);

    return (
        <Fragment>
            {session && semester ? (
                <Fragment>
                    <Button
                        startContent={<ArrowLeftIcon className="h-6 w-6" />}
                        onPressEnd={goBack}
                        className="my-4"
                    />
                    <h2 className="text-left font-bold">{semester.name}</h2>

                    <div className="flex flex-row gap-4">
                        <h3>{ReadableStatus(semester.status)}</h3>
                        <h3>|</h3>
                        <h3>Goal: {semester.goal}%</h3>
                    </div>
                    <hr className="border-1 border-primary-100/50 my-2" />
                    <div className="my-5">
                        <ConfirmButton
                            endContent={
                                <PlusIcon className="h-6 w-6"></PlusIcon>
                            }
                            onPressEnd={onOpen}
                        >
                            Add Course
                        </ConfirmButton>
                    </div>
                    {(semester?.courses.length && (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {semester.courses.map((course) => (
                                <CourseCard
                                    {...course}
                                    key={course.id}
                                ></CourseCard>
                            ))}
                        </div>
                    )) || <p>No courses</p>}
                    <Modal
                        isOpen={isOpen}
                        onOpenChange={onOpenChange}
                        className="bg-sky-100"
                    >
                        <CreateCourseModal
                            session={session}
                            api_v1_semester_id={params.id}
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
