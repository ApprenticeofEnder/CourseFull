import fs from 'fs';
import path from 'path';

import { Endpoints } from '@coursefull';
import { createRegisteredUser, dbConnect } from '@lib/test-helpers';
import { test as baseTest, expect, Page } from '@playwright/conftest';
import { AUTH_TOKEN_STORAGE_KEY } from '@lib/supabase/client';

export * from '@playwright/conftest';
export * from '@playwright/test';

export const test = baseTest.extend<
    { authenticatedPage: Page },
    { workerStorageState: string }
>({
    authenticatedPage: async ({ page }, use) => {
        const sessionLocalStorageItem = (
            await page.context().storageState()
        ).origins
            .pop()
            ?.localStorage.filter(
                (item) => item.name === AUTH_TOKEN_STORAGE_KEY
            )
            .pop();

        const sessionDataString = sessionLocalStorageItem?.value!;

        await page.addInitScript(
            ({ AUTH_TOKEN_STORAGE_KEY, sessionDataString }) => {
                window.localStorage.setItem(
                    AUTH_TOKEN_STORAGE_KEY,
                    sessionDataString
                );
            },
            {
                AUTH_TOKEN_STORAGE_KEY,
                sessionDataString,
            }
        );
        use(page);
    },
    // Use the same storage state for all tests in this worker.
    storageState: ({ workerStorageState }, use) => use(workerStorageState),

    // Authenticate once per worker with a worker-scoped fixture.
    workerStorageState: [
        async ({ browser }, use) => {
            // Use parallelIndex as a unique identifier for each worker.
            const id = test.info().parallelIndex;
            const fileName = path.resolve(
                test.info().project.outputDir,
                `.auth/${id}.json`
            );

            if (fs.existsSync(fileName)) {
                // Reuse existing authentication state if any.
                await use(fileName);
                return;
            }

            // Important: make sure we authenticate in a clean environment by unsetting storage state.
            const page = await browser.newPage({ storageState: undefined });

            // Acquire a unique account, for example create a new one.
            // Alternatively, you can have a list of precreated accounts for testing.
            // Make sure that accounts are unique, so that multiple team members
            // can run tests at the same time without interference.

            const dbClient = await dbConnect();

            const userData = await createRegisteredUser(dbClient, {});

            test.fail(userData === null, 'User data is null.');
            if (!userData) return;

            const { courseFullUser } = userData;

            dbClient.end();

            await page.goto(`${process.env.APP_URL || ''}${Endpoints.LOGIN}`);

            await page.getByTestId('login-email').click();
            await page.getByTestId('login-email').fill(courseFullUser.email);
            await page.getByTestId('login-password').click();
            await page.getByTestId('login-password').fill('Password1!');
            await page.getByTestId('login-button').click();

            await page.waitForURL(`${process.env.APP_URL}${Endpoints.ROOT}`);

            await expect(
                page.getByRole('heading', {
                    name: `Hey, ${userData.courseFullUser.first_name}!`,
                })
            ).toBeVisible();

            // End of authentication steps.

            await page.context().storageState({ path: fileName });
            await page.close();

            await use(fileName);
        },
        { scope: 'worker' },
    ],
});
