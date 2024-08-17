'use client';

import Button from '@components/Button/Button';
import CourseCard from '@components/Card/Course';
import CreateCourseModal from '@components/Modal/CreateCourse';
import { ReadableStatus } from '@lib/helpers';
import { useProtectedEndpoint, useSession } from '@lib/supabase/sessionContext';
import { getSemester } from '@services/semesterService';
import {
    ArrowLeftIcon,
    PlusIcon,
    TrashIcon,
    PencilIcon,
} from '@heroicons/react/24/outline';
import { Modal, Spinner, useDisclosure } from '@nextui-org/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Fragment, useEffect, useState, Suspense } from 'react';

import { Endpoints, Semester, SessionProps } from '@coursefull';
import UpdateSemesterModal from '@components/Modal/UpdateSemester';

interface SemesterPageProps extends SessionProps {}

function SemesterList() {}

function SemesterPage() {
    const router = useRouter();
    const { session, loadingSession } = useSession()!;
    useProtectedEndpoint(session, loadingSession, router);

    const searchParams = useSearchParams();
    const semesterId = searchParams.get('id') || '';

    const [semester, setSemester] = useState<Semester | null>(null);

    const updateModal = useDisclosure();
    const createModal = useDisclosure();

    function goBack() {
        router.push(Endpoints.ROOT);
    }

    let mounted = true;

    useEffect(() => {
        if (semester || !session) {
            return;
        }
        getSemester(semesterId, session, (error) => {
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
                    >
                        Go Back
                    </Button>
                    <div className="flex mb-2 gap-4">
                        <h2 className="text-left font-bold">{semester.name}</h2>
                    </div>

                    <div className="flex flex-row gap-4">
                        <h3>{ReadableStatus(semester.status)}</h3>
                        <h3>|</h3>
                        <h3>Goal: {semester.goal}%</h3>
                    </div>
                    <div className="my-5 flex gap-4">
                        <Button
                            className="top-1"
                            endContent={<PlusIcon className="h-6 w-6" />}
                            onPressEnd={createModal.onOpen}
                            buttonType="confirm"
                        >
                            Add Course
                        </Button>
                        <Button
                            className="top-1"
                            endContent={<PencilIcon className="h-6 w-6" />}
                            onPressEnd={updateModal.onOpen}
                        >
                            Edit Semester
                        </Button>
                        <Button
                            className="top-1"
                            endContent={<TrashIcon className="h-6 w-6" />}
                            // onPressEnd={deleteModel.onOpen}
                            buttonType="danger"
                            isDisabled
                        >
                            Delete Semester
                        </Button>
                    </div>
                    <hr className="border-1 border-primary-100/50 my-2" />

                    {(semester?.courses?.length && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {semester.courses.map((course) => (
                                <CourseCard
                                    {...course}
                                    key={course.id}
                                ></CourseCard>
                            ))}
                        </div>
                    )) || <p>No courses</p>}
                    <Modal
                        isOpen={createModal.isOpen}
                        onOpenChange={createModal.onOpenChange}
                        className="bg-sky-100"
                    >
                        <CreateCourseModal
                            session={session}
                            api_v1_semester_id={semesterId}
                        />
                    </Modal>
                    <Modal
                        isOpen={updateModal.isOpen}
                        onOpenChange={updateModal.onOpenChange}
                        className="bg-sky-100"
                    >
                        <UpdateSemesterModal
                            session={session}
                            semester={semester}
                        />
                        <></>
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

export default function SemesterDashboard() {
    return (
        <Suspense>
            <SemesterPage />
        </Suspense>
    );
}
