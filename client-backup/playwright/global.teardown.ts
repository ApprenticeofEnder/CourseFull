import { test as teardown } from '@playwright/test';

import {
    createRegisteredUser,
    dbConnect,
    deleteData,
    TEST_ACCOUNT_EMAIL,
} from '@lib/test-helpers';

teardown('delete database', async ({}) => {
    console.info('Cleaning up database.');

    await using dbClient = await dbConnect();
    await deleteData(dbClient);
    await createRegisteredUser(dbClient, { email: TEST_ACCOUNT_EMAIL });
});
