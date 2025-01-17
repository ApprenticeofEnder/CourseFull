'use client';

import { Chip, Divider, Skeleton, Tab, Tabs } from '@nextui-org/react';
import { useMemo } from 'react';

import Loading from '@/app/loading';
import ActiveSemesterCard from '@/components/Card/ActiveSemester';
import Courses from '@/components/Dashboard/Courses';
import Semesters from '@/components/Dashboard/Semesters';
import UpcomingDeliverables from '@/components/Dashboard/UpcomingDeliverables';
import { useActiveSemester } from '@/lib/hooks/data';
import { useUpcomingDeliverablesQuery } from '@/lib/query/deliverable';
import { useSemestersQuery } from '@/lib/query/semester';
import { useProgressQuery } from '@/lib/query/user';
import { useSession } from '@/lib/supabase/SessionContext';
import { useTime } from '@/lib/time/TimeContext';

interface UpcomingCounts {
    overdueCount: number;
    urgentCount: number;
    activeCount: number;
}

export default function Dashboard() {
    const { session, user } = useSession();

    const { progressData, loadingProgress } = useProgressQuery(session);
    // const { userData, loadingUserData } = useUserDataQuery(session);
    const { upcomingDeliverables, loadingDeliverables } =
        useUpcomingDeliverablesQuery(session);
    const { semesters, loadingSemesters } = useSemestersQuery(session);

    const {
        deliverables: { overdue, urgent },
    } = useTime();

    const { overdueCount, urgentCount }: UpcomingCounts = useMemo(() => {
        if (!upcomingDeliverables) {
            return {
                overdueCount: 0,
                urgentCount: 0,
                activeCount: 0,
            };
        }
        const overdueCount = overdue.length;
        const urgentCount = urgent.length;

        const activeCount =
            upcomingDeliverables.length - overdueCount - urgentCount;

        return {
            overdueCount,
            urgentCount,
            activeCount,
        };
    }, [overdue, urgent, upcomingDeliverables]);

    const activeSemester = useActiveSemester(progressData);

    if (!user) {
        return <Loading message="Good to see you!" />;
    }

    // Upcoming Deliverables needs to be first because it has "reactive" content
    const dashboardTabs = [
        {
            key: 'upcoming',
            title: (
                <div className="flex items-center space-x-2">
                    <span>Upcoming Deliverables</span>
                    <Chip
                        size="md"
                        color={
                            overdueCount
                                ? 'danger'
                                : urgentCount
                                  ? 'warning'
                                  : 'primary'
                        }
                        variant="dot"
                        className={
                            upcomingDeliverables?.length
                                ? 'visible'
                                : 'collapse'
                        }
                    >
                        {upcomingDeliverables?.length || 0}
                    </Chip>
                </div>
            ),
            content: (
                <UpcomingDeliverables
                    upcomingDeliverables={upcomingDeliverables}
                    loadingDeliverables={loadingDeliverables}
                />
            ),
        },
        {
            key: 'progress',
            title: 'Progress',
            content: (
                <Skeleton
                    className="h-full rounded-lg"
                    classNames={{ content: 'h-full' }}
                    isLoaded={!loadingProgress}
                >
                    <ActiveSemesterCard activeSemester={activeSemester} />
                </Skeleton>
            ),
        },
        {
            key: 'semesters',
            title: 'Semesters',
            content: (
                <Semesters
                    semesters={semesters}
                    loadingSemesters={loadingSemesters}
                />
            ),
        },
        {
            key: 'courses',
            title: 'Courses',
            content: (
                <Courses
                    semesters={semesters}
                    loadingSemesters={loadingSemesters}
                />
            ),
        },
    ];

    return (
        <div className="flex-grow">
            <h1 className="text-left">Hey, {user.user_metadata.first_name}!</h1>
            <Tabs
                aria-label="Options"
                isVertical
                variant="light"
                classNames={{
                    tab: 'text-xl justify-start h-fit p-4',
                    panel: 'w-full flex flex-col gap-4',
                    wrapper: 'mt-5 mb-10',
                }}
                items={dashboardTabs}
                disableAnimation
            >
                {(item) => (
                    <Tab key={item.key} title={item.title}>
                        <h3 className="text-left">{item.title}</h3>
                        <Divider></Divider>
                        {item.content}
                    </Tab>
                )}
            </Tabs>
        </div>
    );
}
