import {
    createRegisteredUser,
    dbConnect,
    loadProducts,
    LOGIN_TEST_EMAIL,
} from '@lib/test-helpers';
import { test as setup } from '@playwright/test';

setup('create users', async ({}) => {
    console.info('Setting up database.');
    await using dbClient = await dbConnect();
    await createRegisteredUser(dbClient, { email: LOGIN_TEST_EMAIL });
    await loadProducts(dbClient);
});
