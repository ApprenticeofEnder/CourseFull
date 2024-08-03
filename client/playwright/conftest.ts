import { createClient } from '@supabase/supabase-js';
import { faker } from '@faker-js/faker';
import { User } from '@/lib/types';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { createUser } from '@/services/userService';

export async function clearData(email: string) {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        process.env.SUPABASE_SERVICE_KEY || ''
    );

    const result = await supabase
        .from('api_v1_users')
        .select()
        .eq('email', email);

    const user: {
        id: string;
        first_name: string;
        last_name: string;
        email: string;
        supabase_id: string;
        courses_remaining: number;
        created_at: string;
        updated_at: string;
    } = result?.data?.at(0);

    supabase.from('api_v1_users').delete().eq('id', user.id);
    supabase.auth.admin.deleteUser(user.supabase_id);
}

export const createUserData = () => ({
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    password:
        faker.internet.password() +
        faker.helpers.arrayElements('!#$%&? _"'.split(''), 3).join(''),
});

export const createValidFields = (user: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
}): { [key: string]: string } => ({
    'First Name': user.first_name,
    'Last Name': user.last_name,
    Email: user.email,
    Password: user.password,
});

export async function createRegisteredUser(): Promise<{
    courseFullUser: User;
    password: string;
} | null> {
    const userData = createUserData();
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        process.env.SUPABASE_SERVICE_KEY || ''
    );

    const { response, success } = await createUser(
        userData.first_name,
        userData.last_name,
        userData.email,
        userData.password,
        (error) => {
            console.error(error.message);
        }
    );

    if (!success) {
        console.error(response?.data);
        return null;
    }

    const courseFullUser: User = response?.data;

    supabase.auth.admin.updateUserById(courseFullUser.supabase_id, {
        email_confirm: true,
    });

    return { courseFullUser, password: userData.password };
}
