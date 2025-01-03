'use client';
import dynamic from 'next/dynamic';

import { useSession, useProtectedEndpoint } from '@lib/supabase/SessionContext';

import Loading from '@app/loading';

const Dashboard = dynamic(() => import('@components/Dashboard/Dashboard'), {
    loading: () => <Loading message="Good to see you!" />,
});

export default function DashboardPage() {
    const { session, loadingSession } = useSession();
    useProtectedEndpoint(session, loadingSession);
    return (
        <div className="flex flex-col justify-center w-full">
            {loadingSession ? (
                <Loading message="Hey there!" />
            ) : session ? (
                <Dashboard session={session} />
            ) : (
                <h1>One Sec!</h1>
            )}
        </div>
    );
}
