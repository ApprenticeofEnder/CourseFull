import { test as setup } from '@playwright/test';
import { createRegisteredUser, dbConnect, loadProducts } from './conftest';

setup('create users', async ({}) => {
    console.info('Setting up database.');
    await using dbClient = await dbConnect();
    for (let i = 0; i < 3; i++) {
        await createRegisteredUser(dbClient, {});
    }
    await loadProducts(dbClient);
});
