import { createClient } from '@/lib/supabase/server';
import { Endpoints } from '@/types';
import { redirect } from 'next/navigation';
import Dashboard from './Dashboard';

export default async function Page() {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) {
        redirect(Endpoints.Auth.LOGIN);
    }

    return <Dashboard/>;
}
