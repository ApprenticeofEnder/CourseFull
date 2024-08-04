import { createClient } from '@supabase/supabase-js';
import { faker } from '@faker-js/faker';
import { User } from '@/lib/types';
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

export async function createRegisteredUser() {
    const userData = createUserData();
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        process.env.SUPABASE_SERVICE_KEY || ''
    );
    let supabaseResponse = await supabase.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        user_metadata: {
            first_name: userData.first_name,
            last_name: userData.last_name,
        },
        email_confirm: true,
    });

    if (supabaseResponse.error) {
        console.error(supabaseResponse.error.message);
        return null;
    }

    let date = new Date();
    let iso_date = date.toISOString();

    const { data, error } = await supabase
        .from('api_v1_users')
        .insert({
            first_name: userData.first_name,
            last_name: userData.last_name,
            email: userData.email,
            supabase_id: supabaseResponse.data.user.id,
            courses_remaining: 3,
            created_at: iso_date,
            updated_at: iso_date,
        })
        .select();

    if (error) {
        console.info('Supabase error encountered during API user creation.');
        console.error(error.message);
    }

    const newUser: User = data?.shift();

    return { courseFullUser: newUser, password: userData.password };
}
