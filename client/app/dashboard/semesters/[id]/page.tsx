'use client';

import ConfirmButton from '@/components/Button/ConfirmButton';
import CourseCard from '@/components/Card/Course';
import { Endpoints } from '@/lib/enums';
import { ReadableStatus } from '@/lib/helpers';
import { Semester } from '@/lib/types';
import { getSemester } from '@/services/semesterService';
import { useSupabaseSession } from '@/supabase';
import { PlusIcon } from '@heroicons/react/24/outline';
import { Spinner } from '@nextui-org/react';
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

    let mounted = true;
    useEffect(() => {
        if (semester || !session) {
            return;
        }
        getSemester(params.id, session, (error) => {
            alert(error.message);
        })
            .then(({ response }) => {
                setSemester(response?.data || null);
            })
            .catch();
        return () => {
            mounted = false;
        };
    }, [semester, session]);

    return (
        <Fragment>
            {semester ? (
                <Fragment>
                    <h2 className="text-left font-bold">{semester.name}</h2>
                    <div className="flex flex-row gap-4">
                        <h3>{ReadableStatus(semester.status)}</h3>
                        <h3>|</h3>
                        <h3>Goal: {semester.goal}</h3>
                    </div>
                    <hr className="border-1 border-primary-100/50 my-2" />
                    <div className="my-5">
                        <ConfirmButton
                            endContent={
                                <PlusIcon className="h-6 w-6"></PlusIcon>
                            }
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
