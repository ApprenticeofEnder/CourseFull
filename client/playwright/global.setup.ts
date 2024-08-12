import { test as setup } from '@playwright/test';
import { createRegisteredUser, TEST_ACCOUNT_EMAIL } from './conftest';

setup('create users', async ({}) => {
    // Initialize the database
    for (let i = 0; i < 3; i++) {
        await createRegisteredUser({});
    }
    await createRegisteredUser({ email: TEST_ACCOUNT_EMAIL });
});
