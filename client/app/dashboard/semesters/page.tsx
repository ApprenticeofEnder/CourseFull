'use client';

import Button from '@/components/Button/Button';
import CourseCard from '@/components/Card/Course';
import CreateCourseModal from '@/components/Modal/CreateCourse';
import { Endpoints } from '@/coursefull.d';
import { ReadableStatus } from '@/lib/helpers';
import { useProtectedEndpoint, useSession } from '@/lib/session/sessionContext';
import { Semester, SessionProps } from '@/coursefull.d';
import { getSemester } from '@/services/semesterService';
import { ArrowLeftIcon, PlusIcon } from '@heroicons/react/24/outline';
import { Modal, Spinner, useDisclosure } from '@nextui-org/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Fragment, useEffect, useState, Suspense } from 'react';

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
                        {/* <Button
                    className="top-1"
                    onPressEnd={updateOnOpen}
                    isDisabled
                >
                    Edit
                </Button>
                <Button
                    className="top-1"
                    onPressEnd={updateOnOpen}
                    buttonType="danger"
                    isDisabled
                >
                    Delete
                </Button> */}
                    </div>

                    <div className="flex flex-row gap-4">
                        <h3>{ReadableStatus(semester.status)}</h3>
                        <h3>|</h3>
                        <h3>Goal: {semester.goal}%</h3>
                    </div>
                    <hr className="border-1 border-primary-100/50 my-2" />
                    <div className="my-5">
                        <Button
                            endContent={
                                <PlusIcon className="h-6 w-6"></PlusIcon>
                            }
                            onPressEnd={createModal.onOpen}
                            buttonType="confirm"
                        >
                            Add Course
                        </Button>
                    </div>
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
                        {/* <UpdateCourseModal
                    session={session}
                    api_v1_semester_id={semesterId}
                /> */}
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
