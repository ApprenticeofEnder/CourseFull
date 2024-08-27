import { faker } from '@faker-js/faker';
import { test as base, Page } from '@playwright/test';

import { Endpoints, ItemStatus, Semester, User } from '@coursefull';
import { LOGIN_TEST_EMAIL, supabaseServiceRole } from '@lib/test-helpers';

// This is only for tests so this should not cause an issue for production

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

export { expect, type Locator, type Page } from '@playwright/test';
