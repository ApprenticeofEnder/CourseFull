import dynamic from 'next/dynamic';

import Loading from '@app/loading';
import { createClient } from '@lib/supabase/server';
import { redirect } from 'next/navigation';
import { Endpoints } from '@coursefull';
import { cookies } from 'next/headers';

const Dashboard = dynamic(() => import('@components/Dashboard/Dashboard'), {
    loading: () => <Loading message="Good to see you!" />,
});

export default async function DashboardPage() {
    const allCookies = cookies();
    const supabase = await createClient();

    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) {
        redirect(Endpoints.LOGIN);
    }

    const {
        data: { session },
    } = await supabase.auth.getSession();

    return <Dashboard session={session!} />;
}
