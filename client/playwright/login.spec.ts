/**
 * Cases:
 * - Should be able to login with good credentials
 * - Should not be able to login with bad credentials
 * - Error handling
 */

import { Endpoints } from '@/lib/enums';
import {
    clearData,
    createRegisteredUser,
    test,
    expect,
    type Page,
    Locator,
} from './conftest';

test.describe('Registered User', () => {
    test('Should be able to log in if all information is correct.', async ({
        homePage,
    }) => {
        const userData = await createRegisteredUser();
        test.fail(userData === null, 'User creation failed.');

        if (!userData) {
            return;
        }

        const { courseFullUser, password } = userData;

        const page = homePage;

        page.on('dialog', (dialog) => {
            throw new Error(dialog.message());
        });

        await page.getByTestId('home-login').click();
        await page.getByTestId('login-email').click();
        await page.getByTestId('login-email').fill(courseFullUser?.email!);
        await page.getByTestId('login-password').fill(password!);
        await page.getByTestId('login-password').press('Tab');
        await page.getByTestId('login-button').click();

        await expect(page).toHaveURL(Endpoints.ROOT);

        clearData(courseFullUser?.email!);
    });

    // TODO: Add tests for failing logins, etc.
});
