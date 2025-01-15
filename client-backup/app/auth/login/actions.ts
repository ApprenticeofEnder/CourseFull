'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { createClient } from '@lib/supabase/server';
import { Endpoints } from '@coursefull';

export async function login(email: string, password: string) {
    const supabase = await createClient();

    const data = {
        email,
        password,
    };

    const { error } = await supabase.auth.signInWithPassword(data);

    if (error) {
        throw error;
    }

    console.log(Endpoints.DASHBOARD);

    revalidatePath(Endpoints.DASHBOARD, 'layout');
    redirect(Endpoints.DASHBOARD);
}
