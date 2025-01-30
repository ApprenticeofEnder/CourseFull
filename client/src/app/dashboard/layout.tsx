'use client';

import { Divider, Tab, Tabs } from '@heroui/react';

import Loading from '@/app/loading';
import { useSession } from '@/lib/supabase/SessionContext';

export default function Layout({
    semesters,
    upcoming,
    courses,
}: {
    semesters: React.ReactNode;
    upcoming: React.ReactNode;
    courses: React.ReactNode;
}) {
    const { user } = useSession();

    if (!user) {
        return <Loading message="Good to see you!" />;
    }

    const dashboardTabs = [
        {
            key: 'upcoming',
            title: 'Upcoming Deliverables',
            content: upcoming,
        },
        {
            key: 'semesters',
            title: 'Semesters',
            content: semesters,
        },
        {
            key: 'courses',
            title: 'Courses',
            content: courses,
        },
    ];

    return (
        <div className="flex-grow">
            <h1 className="text-left">Hey, {user.user_metadata.first_name}!</h1>
            <Tabs
                aria-label="Dashboard Options"
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
