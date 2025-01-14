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
    if(loadingSession){
        return <Loading message="Hey there!" />;
    }
    if(!session){
        return <h1>One sec!</h1>;
    }

    return (
        <Dashboard session={session} />
    );
}
