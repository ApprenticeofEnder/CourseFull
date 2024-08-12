import { createClient } from '@supabase/supabase-js';
import { faker } from '@faker-js/faker';
import { test as base, Page, Locator } from '@playwright/test';
import { Client, connect, DataType } from 'ts-postgres';

import { Product, User } from '@/lib/types';
import { Endpoints } from '@/lib/enums';

export const supabaseServiceRole = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321',
    process.env.SUPABASE_SERVICE_KEY || ''
);

export const TEST_ACCOUNT_EMAIL = 'test@test.com';

// This is only for tests so this should not cause an issue for production

type BasicUserData = {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
};

export const createUserData = (): BasicUserData => ({
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    password: 'Password1!',
});

export const createValidFields = ({
    first_name, last_name, email, password
}: BasicUserData): { [key: string]: string } => ({
    'First Name': first_name,
    'Last Name': last_name,
    Email: email,
    Password: password,
});


export async function dbConnect(): Promise<Client>{
    return connect({
        user: 'postgres',
        password: 'postgres',
        database: 'test',
    });
}

export async function createRegisteredUser(dbClient: Client, { email }: { email?: string }) {
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

export async function loadProducts(dbClient: Client) {
    const { data, error } = await supabaseServiceRole
        .from('api_v1_products')
        .select();

    if (error) {
        throw new Error(error.message);
    }

    const products = data.map<Product>((product) => {
        const { id, created_at, updated_at, ...productData } = product;
        return productData;
    });

    await using insertProductStatement = await dbClient.prepare(
        `INSERT INTO api_v1_products (stripe_id, stripe_price, name, description, price, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`
    );

    for (let product of products) {
        await insertProductStatement.execute([
            product.stripe_id,
            product.stripe_price,
            product.name,
            product.description,
            product.price,
        ]);
    }
}

export async function deleteData(dbClient: Client){
    const users = (await supabaseServiceRole.auth.admin.listUsers()).data.users;
    for (let user of users) {
        const authDeleteRes = await supabaseServiceRole.auth.admin.deleteUser(
            user.id
        );
        const apiDeleteRes = await supabaseServiceRole
            .from('api_v1_users')
            .delete()
            .ilike('email', user.email!);
    }

    await dbClient.query(`DELETE FROM api_v1_deliverables`);
    await dbClient.query(`DELETE FROM api_v1_courses`);
    await dbClient.query(`DELETE FROM api_v1_semesters`);
    await dbClient.query(`DELETE FROM api_v1_users`);
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
        await page.goto(baseURL || Endpoints.ROOT);
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
