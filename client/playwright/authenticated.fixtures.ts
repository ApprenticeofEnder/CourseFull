import { Endpoints } from '@coursefull'
import {
    test as baseTest,
    createRegisteredUser,
    dbConnect,
} from '@playwright/conftest';
import fs from 'fs';
import path from 'path';

export * from '@playwright/test';
export * from '@playwright/conftest';
export const test = baseTest.extend<{}, { workerStorageState: string }>({
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

            await using dbClient = await dbConnect();

            const userData = await createRegisteredUser(dbClient, {});

            test.fail(userData === null, 'User data is null.');
            if(!userData) return;

            const {courseFullUser} = userData;

            await page.goto(Endpoints.LOGIN);

            await page.getByTestId('login-email').click();
            await page.getByTestId('login-email').fill(courseFullUser.email);
            await page.getByTestId('login-password').click();
            await page.getByTestId('login-password').fill('Password1!');
            await page.getByTestId('login-button').click();

            await page.waitForURL(Endpoints.ROOT);

            // End of authentication steps.

            await page.context().storageState({ path: fileName });
            await page.close();
            await use(fileName);
        },
        { scope: 'worker' },
    ],
});
