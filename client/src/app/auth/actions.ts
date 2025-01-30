'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { createClient } from '@/lib/supabase/server';
import { LoginSchema, SignupSchema } from '@/lib/validation';
import { createUser } from '@/services/user-service';
import { Endpoints } from '@/types';

export async function login(data: LoginSchema) {
    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword(data);

    if (error) {
        throw error;
    }

    revalidatePath(Endpoints.Page.DASHBOARD, 'layout');
    redirect(Endpoints.Page.DASHBOARD);
}

export async function signup(user: SignupSchema) {
    const { email, password, first_name, last_name } = user;
    const supabase = await createClient();

    // TODO: add validation here

    const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                first_name,
                last_name,
            },
        },
    });

    if (error || !data.user) {
        redirect('/error');
    }

    const supabase_id = data.user.id;

    await createUser({ ...user, supabase_id });

    revalidatePath(Endpoints.Auth.EMAIL_VERIFY, 'layout');
    redirect(Endpoints.Auth.EMAIL_VERIFY);
}

export async function logout() {
    const supabase = await createClient();

    const { error } = await supabase.auth.signOut();
    if (error) {
        throw error;
    }

    redirect(Endpoints.Page.HOME);
}
