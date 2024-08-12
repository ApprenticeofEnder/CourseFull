import { test, expect, type Page, Locator } from './conftest';

test.describe('New Semester', () => {
    test('User can create a semester with valid values', async ({
        loginPage,
        registeredUser,
    }) => {
        const page = loginPage;

        page.on('dialog', (dialog) => {
            test.fail();
            throw new Error(dialog.message());
        });

        await page.getByTestId('login-email').click();
        await page.getByTestId('login-email').fill(registeredUser.email);
        await page.getByTestId('login-password').click();
        await page.getByTestId('login-password').fill('Password1!');
        await page.getByTestId('login-button').click();

        await expect(
            page.getByText(`Hey, ${registeredUser.first_name}!`)
        ).toBeVisible();

        await page.getByTestId('create-semester-button').click();
        await page.getByPlaceholder('e.g. Fall').click();
        await page.getByPlaceholder('e.g. Fall').fill('Test Semester');
        await page.getByPlaceholder('e.g. Fall').press('Tab');
        await page.getByTestId('semester-status-active').click();
        await page.getByRole('button', { name: 'Create!' }).click();

        await expect(
            page.getByRole('button', { name: 'Test Semester' })
        ).toBeVisible();
    });
});
