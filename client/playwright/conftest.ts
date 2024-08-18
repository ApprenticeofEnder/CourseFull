import { createClient } from '@supabase/supabase-js';
import { faker } from '@faker-js/faker';
import { test as base, Page, Locator, expect } from '@playwright/test';
import { Client, connect, DataType } from 'ts-postgres';

import { Product, Semester, User, Endpoints, ItemStatus } from '@coursefull';

export const supabaseServiceRole = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321',
    process.env.SUPABASE_SERVICE_KEY || ''
);

export const TEST_ACCOUNT_EMAIL = 'test@test.com';
export const LOGIN_TEST_EMAIL = 'logintest@test.com';

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
    first_name,
    last_name,
    email,
    password,
}: BasicUserData): Record<string, string> => ({
    'First Name': first_name,
    'Last Name': last_name,
    Email: email,
    Password: password,
});

export async function dbConnect(): Promise<Client> {
    return connect({
        user: 'postgres',
        password: 'postgres',
        database: 'test',
    });
}

export async function createRegisteredUser(
    dbClient: Client,
    { email }: { email?: string }
) {
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
        "INSERT INTO api_v1_products (stripe_id, stripe_price, name, description, price, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)"
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

export async function deleteData(dbClient: Client) {
    const users = (await supabaseServiceRole.auth.admin.listUsers()).data.users;

    for (let user of users) {
        const authDeleteRes = await supabaseServiceRole.auth.admin.deleteUser(
            user.id
        );
    }

    const apiUsersRes = await supabaseServiceRole.from('api_v1_users').select();

    if (apiUsersRes.error) {
        throw apiUsersRes.error;
    }

    for (let user of apiUsersRes.data) {
        const apiDeleteRes = await supabaseServiceRole
            .from('api_v1_users')
            .delete()
            .ilike('email', user.email);
    }

    const tables = [
        'api_v1_deliverables',
        'api_v1_courses',
        'api_v1_semesters',
        'api_v1_users',
    ];

    for (let table of tables) {
        //Yes this is an SQL injection technically, no it doesn't have any user-controlled input.
        await dbClient.query(`DELETE FROM ${table}`);
    }

    expect(
        (await supabaseServiceRole.auth.admin.listUsers()).data.users.length
    ).toBe(0);
    expect(
        (await supabaseServiceRole.from('api_v1_users').select()).data?.length
    ).toBe(0);

    for (let table of tables) {
        //See above.
        expect(
            (await dbClient.query(`SELECT * FROM ${table}`)).rows.length
        ).toBe(0);
    }
}

type CourseFullFixtures = {
    loginUser: User;
    deleteUser: User;
    homePage: Page;
    signupPage: Page;
    loginPage: Page;
    semesterData: Semester;
};

export const test = base.extend<CourseFullFixtures>({
    loginUser: async ({}, use) => {
        const { data, error } = await supabaseServiceRole
            .from('api_v1_users')
            .select()
            .ilike('email', LOGIN_TEST_EMAIL);

        if (error) {
            console.error(error.message);
            return;
        }
        const user = data.at(0);

        await use(user);
    },
    deleteUser: async ({}, use) => {
        // await using dbClient = await dbConnect();
        // const userData = await createRegisteredUser(dbClient, {})!;
        // if (!userData) {
        //     console.error('User data is null.');
        //     return;
        // }
        // await use(userData.courseFullUser);
    },
    semesterData: async ({}, use) => {
        const data: Semester = {
            name: faker.lorem.words(2),
            goal: faker.number.int({ min: 60, max: 100 }),
            status: ItemStatus.ACTIVE,
        };
        await use(data);
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
