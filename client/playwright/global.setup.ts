import { test as setup } from '@playwright/test';
import { createRegisteredUser } from './conftest';

setup('create users', async ({}) => {
    // Initialize the database
    for (let i = 0; i < 3; i++) {
        await createRegisteredUser();
    }
});
