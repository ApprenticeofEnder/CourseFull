'use client';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';

import { useSession, useProtectedEndpoint } from '@lib/supabase/sessionContext';

import Loading from '@app/loading';

const Dashboard = dynamic(() => import('@components/Dashboard/Dashboard'), {
    loading: () => <Loading message="Good to see you!" />,
});

export default function DashboardPage() {
    const router = useRouter();
    const { session, loadingSession } = useSession();
    useProtectedEndpoint(session, loadingSession, router);
    return (
        <div className="flex flex-col justify-center w-full">
            {loadingSession ? (
                <Loading message="Good to see you!" />
            ) : session ? (
                <Dashboard session={session} />
            ) : (
                <h1>One Sec!</h1>
            )}
        </div>
    );
}
