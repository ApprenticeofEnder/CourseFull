'use client';

import { Endpoints } from '@/lib/enums';
import { Semester } from '@/lib/types';
import { getSemester } from '@/services/semesterService';
import { useSupabaseSession } from '@/supabase';
import { Spinner } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { Fragment, useEffect, useState } from 'react';

interface SemesterDashboardProps {
    params: { id: string };
}

export default function SemesterDashboard({ params }: SemesterDashboardProps) {
    const [semester, setSemester] = useState<Semester | null>(null);
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
            .then((serviceResponse) => {
                setSemester(serviceResponse.response?.data || null);
                console.log(serviceResponse.response?.data);
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
                    <h2 className="text-left">{semester.name}</h2>
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
