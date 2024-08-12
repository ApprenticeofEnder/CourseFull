/**
 * Cases:
 * - Should be able to login with good credentials
 * - Should not be able to login with bad credentials
 * - Error handling
 */

import { Endpoints } from '@/coursefull.d';
import { test, expect, type Page, Locator } from './conftest';

test.describe.serial('Registered User', () => {
    test('Should be able to log in if all information is correct.', async ({
        homePage,
        loginUser,
    }) => {
        const page = homePage;

        await page.getByTestId('home-login').click();
        await page.getByTestId('login-email').click();
        await page.getByTestId('login-email').fill(loginUser.email);
        await page.getByTestId('login-password').click();
        await page.getByTestId('login-password').fill('Password1!');
        await page.getByTestId('login-button').click();

        await page.waitForURL(Endpoints.ROOT);

        await expect(page).toHaveURL(Endpoints.ROOT);
    });

    // TODO: Add tests for failing logins, etc.
});
