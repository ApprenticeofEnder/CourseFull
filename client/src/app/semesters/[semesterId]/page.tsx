import {
    HydrationBoundary,
    QueryClient,
    dehydrate,
} from '@tanstack/react-query';
import { redirect } from 'next/navigation';
import { FC } from 'react';

import { semesterQueryOptions } from '@/lib/query/semester';
import { createClient } from '@/lib/supabase/server';
import { Endpoints } from '@/types';

import SemesterPage from './semester';

interface SemesterPageProps {
    params: Promise<{ semesterId: string }>;
}

const Page: FC<SemesterPageProps> = async ({ params }) => {
    const { semesterId } = await params;
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getSession();
    if (error || !data.session) {
        redirect(Endpoints.Auth.LOGIN);
    }

    const queryClient = new QueryClient();

    await queryClient.prefetchQuery(
        semesterQueryOptions(data.session, semesterId)
    );

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <SemesterPage semesterId={semesterId} />
        </HydrationBoundary>
    );
};

export default Page;
