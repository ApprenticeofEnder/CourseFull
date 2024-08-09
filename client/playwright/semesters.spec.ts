import { test, expect, type Page, Locator } from '@playwright/test';
import { clearData, createRegisteredUser } from './conftest';

test.beforeEach(async ({ page }) => {
    await page.goto('/');

    const userData = await createRegisteredUser();
    test.fail(userData === null, 'User creation failed.');

    if (!userData) {
        return;
    }

    page.on('dialog', (dialog) => {
        throw new Error(dialog.message());
    });
});

test.describe('New Semester', () => {
    test('User can create a semester with valid values', async () => {});
});
