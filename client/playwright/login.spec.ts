/**
 * Cases:
 * - Should be able to login with good credentials
 * - Should not be able to login with bad credentials
 * - Error handling
 */

import { test, expect, type Page, Locator } from '@playwright/test';
import { clearData, createRegisteredUser } from './conftest';

test.beforeEach(async ({ page }) => {
    await page.goto('/');

    page.on('dialog', (dialog) => {
        throw new Error(dialog.message());
    });
});

test.describe('Registered User', () => {
    test('Should be able to log in if all information is correct.', async ({
        page,
    }) => {
        const userData = await createRegisteredUser();
        test.fail(userData === null, 'User creation failed.');

        if (!userData) {
            return;
        }

        const { courseFullUser, password } = userData;

        await page.goto('http://localhost:5100/');
        await page.getByTestId('home-login').click();
        await page.getByTestId('login-email').click();
        await page.getByTestId('login-email').fill(courseFullUser?.email!);
        await page.getByTestId('login-password').fill(password!);
        await page.getByTestId('login-password').press('Tab');
        await page.getByTestId('login-button').click();

        clearData(courseFullUser?.email!);
    });
});
