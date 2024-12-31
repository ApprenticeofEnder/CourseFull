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
    useDisclosure,
} from '@nextui-org/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Fragment, Suspense, useEffect, useRef, useState } from 'react';

import Button from '@components/Button/Button';
import CreateCourseModal from '@components/Modal/CreateCourse';
import UpdateSemesterModal from '@components/Modal/UpdateSemester';
import Courses from '@app/dashboard/semesters/Courses';
import { Course, Endpoints, Semester, SessionProps } from '@coursefull';
import { ReadableStatus } from '@lib/helpers';
import { useProtectedEndpoint, useSession } from '@lib/supabase/SessionContext';
import { deleteSemester, getSemester } from '@services/semesterService';

function SemesterPage() {
    const router = useRouter();
    const { session, loadingSession } = useSession()!;
    useProtectedEndpoint(session, loadingSession, router);

    const searchParams = useSearchParams();
    const semesterId = searchParams.get('id') || '';

    const [semester, setSemester] = useState<Semester | null>(null);
    const [courses, setCourses] = useState<Course[]>([]);

    const [error, setError] = useState<any>(null);

    const createCourseModal = useDisclosure();
    const updateSemesterModal = useDisclosure();

    function goBack() {
        router.push(Endpoints.DASHBOARD);
    }

    async function handleDeleteSemester() {
        const confirmDelete = confirm(
            'Are you sure you want to delete this semester? All of its courses and deliverables will be deleted.'
        );
        if (!confirmDelete) {
            return;
        }
        await deleteSemester(
            semesterId,
            session
        );
        router.push(Endpoints.DASHBOARD);
    }

    let mounted = useRef(true);

    useEffect(() => {
        if (semester || !session || !mounted.current) {
            return;
        }

        async function getData(){
            const semesterData = await getSemester(semesterId, session);
            setSemester(semesterData);
            setCourses(semesterData.courses || []);
        }

        try {
            getData()
        }
        catch(err){
            setError(err);
        }

        return () => {
            mounted.current = false;
        };
    }, [semester, session, semesterId]);

    if(error){
        throw error;
    }

    return (
        <Fragment>
            {session && semester ? (
                <div>
                    <Button
                        startContent={<ArrowLeftIcon className="h-6 w-6" />}
                        onPressEnd={goBack}
                        className="my-4"
                    >
                        Go Back
                    </Button>
                    <div className="flex mb-2 gap-4 justify-between">
                        <h2 className="text-left font-bold">{semester.name}</h2>
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
                                    endContent={
                                        <PencilIcon className="h-6 w-6" />
                                    }
                                    className="bg-primary-800 data-[hover=true]:bg-primary-700"
                                    onPressEnd={updateSemesterModal.onOpen}
                                >
                                    Edit Semester
                                </DropdownItem>
                                <DropdownItem
                                    key="delete"
                                    endContent={
                                        <TrashIcon className="h-6 w-6" />
                                    }
                                    className="text-danger-800 bg-danger-100 data-[hover=true]:bg-danger-200"
                                    onPressEnd={handleDeleteSemester}
                                >
                                    Delete Semester
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>

                    <div className="flex flex-row gap-4">
                        <h3>{ReadableStatus(semester.status)}</h3>
                        <h3>|</h3>
                        <h3>Goal: {semester.goal}%</h3>
                    </div>
                    <hr className="border-1 border-primary-100/50 my-2" />
                    <div className="my-5 flex gap-4">
                        <Button
                            className="top-1"
                            endContent={<PlusIcon className="h-6 w-6" />}
                            onPressEnd={createCourseModal.onOpen}
                            buttonType="confirm"
                        >
                            Add Course
                        </Button>
                    </div>
                    <Courses courses={courses} session={session} />
                    <Modal
                        isOpen={createCourseModal.isOpen}
                        onOpenChange={createCourseModal.onOpenChange}
                        className="bg-sky-100"
                    >
                        <CreateCourseModal
                            session={session}
                            api_v1_semester_id={semesterId}
                        />
                    </Modal>
                    <Modal
                        isOpen={updateSemesterModal.isOpen}
                        onOpenChange={updateSemesterModal.onOpenChange}
                        className="bg-sky-100"
                    >
                        <UpdateSemesterModal
                            session={session}
                            semester={semester}
                        />
                        <></>
                    </Modal>
                </div>
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