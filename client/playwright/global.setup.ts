import { test as setup } from '@playwright/test';
import { createRegisteredUser, dbConnect, loadProducts, LOGIN_TEST_EMAIL } from './conftest';

setup('create users', async ({}) => {
    console.info('Setting up database.');
    await using dbClient = await dbConnect();
    await createRegisteredUser(dbClient, { email: LOGIN_TEST_EMAIL });
    await loadProducts(dbClient);
});
