import { createClient } from '@supabase/supabase-js';
import { faker } from '@faker-js/faker';
import { test as base, Page, Locator } from '@playwright/test';
import { connect, DataType } from 'ts-postgres';

import { User } from '@/lib/types';
import { Endpoints } from '@/lib/enums';

export const supabaseServiceRole = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321',
    process.env.SUPABASE_SERVICE_KEY || ''
);

export const TEST_ACCOUNT_EMAIL = 'test@test.com';

// This is only for tests so this should not cause an issue for production

export const createUserData = () => ({
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    password: 'Password1!',
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

export async function createRegisteredUser({ email }: { email?: string }) {
    const userData = createUserData();

    userData.email = email || userData.email;

    let supabaseResponse = await supabaseServiceRole.auth.admin.createUser({
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

    const { data, error } = await supabaseServiceRole
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
        return null;
    }

    const dbClient = await connect({
        user: 'postgres',
        password: 'postgres',
        database: 'test',
    });

    await dbClient.query(
        `INSERT INTO api_v1_users (first_name, last_name, email, supabase_id, courses_remaining, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
        [
            userData.first_name,
            userData.last_name,
            userData.email,
            supabaseResponse.data.user.id,
            3,
        ]
    );

    const newUser: User = data?.shift();

    return { courseFullUser: newUser, password: userData.password };
}

type CourseFullFixtures = {
    registeredUser: User;
    homePage: Page;
    signupPage: Page;
    loginPage: Page;
};

export const test = base.extend<CourseFullFixtures>({
    registeredUser: async ({}, use) => {
        const { data, error } = await supabaseServiceRole
            .from('api_v1_users')
            .select()
            .limit(1);

        if (error) {
            console.error(error.message);
            return;
        }
        const user = data.at(0);

        await use(user);
    },
    homePage: async ({ baseURL, page }, use) => {
        await page.goto(baseURL || '/');
        await use(page);
    },
    signupPage: async ({ baseURL, page }, use) => {
        await page.goto(`${baseURL || ''}${Endpoints.SIGN_UP}`);
        await use(page);
    },
    loginPage: async ({ baseURL, page }, use) => {
        await page.goto(`${baseURL || ''}${Endpoints.LOGIN}`);
        await use(page);
    },
});

export { expect, type Page, type Locator } from '@playwright/test';
