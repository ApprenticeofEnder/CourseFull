'use client';

import {
    ArrowLeftIcon,
    CogIcon,
    PencilIcon,
    PlusIcon,
    TrashIcon,
} from '@heroicons/react/24/outline';
import {
    Divider,
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
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import Button from '@components/Button/Button';
import CreateCourseModal from '@components/Modal/CreateCourse';
import UpdateSemesterModal from '@components/Modal/UpdateSemester';
import Courses from '@app/dashboard/semesters/Courses';
import {
    Course,
    Endpoints,
    ItemStatus,
    Semester,
    SessionProps,
} from '@coursefull';
import { ReadableStatus } from '@lib/helpers';
import { useProtectedEndpoint, useSession } from '@lib/supabase/SessionContext';
import { deleteSemester, getSemester } from '@services/semesterService';

function SemesterPage() {
    const router = useRouter();
    const { session, loadingSession } = useSession()!;
    useProtectedEndpoint(session, loadingSession, router);

    const searchParams = useSearchParams();
    const semesterId = searchParams.get('id') || '';

    const createCourseModal = useDisclosure();
    const updateSemesterModal = useDisclosure();

    const semesterQuery = useQuery({
        queryKey: ['semester', semesterId],
        queryFn: () => {
            return getSemester(semesterId, session);
        },
        enabled: session !== null,
    });
    if (semesterQuery.error) {
        throw semesterQuery.error;
    }

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
        await deleteSemester(semesterId, session);
        router.push(Endpoints.DASHBOARD);
    }

    return (
        <Fragment>
            {session && !semesterQuery.isLoading ? (
                <div>
                    <Button
                        startContent={<ArrowLeftIcon className="h-6 w-6" />}
                        onPressEnd={goBack}
                        className="my-4"
                    >
                        Go Back
                    </Button>
                    <div className="flex mb-2 gap-4 justify-between">
                        <h2 className="text-left font-bold">
                            {semesterQuery.data?.name}
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
                        <h3>
                            {ReadableStatus(
                                semesterQuery.data?.status ||
                                    ItemStatus.NOT_STARTED
                            )}
                        </h3>
                        <h3>|</h3>
                        <h3>Goal: {semesterQuery.data?.goal}%</h3>
                    </div>
                    <Divider className='my-2'></Divider>
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
                    <Courses
                        courses={semesterQuery.data?.courses || []}
                        session={session}
                    />
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
                            semester={semesterQuery.data!}
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
