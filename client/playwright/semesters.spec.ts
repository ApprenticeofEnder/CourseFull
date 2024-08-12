import { test, expect, type Page, Locator } from '@playwright/conftest';

test.describe('New Semester', () => {
    test('User can create a semester with valid values', async ({
        loginPage,
        loginUser,
        semesterData,
    }) => {
        const page = loginPage;

        page.on('dialog', (dialog) => {
            test.fail();
            throw new Error(dialog.message());
        });

        await page.getByTestId('login-email').click();
        await page.getByTestId('login-email').fill(loginUser.email);
        await page.getByTestId('login-password').click();
        await page.getByTestId('login-password').fill('Password1!');
        await page.getByTestId('login-button').click();

        await expect(
            page.getByText(`Hey, ${loginUser.first_name}!`)
        ).toBeVisible();

        await page.getByTestId('create-semester-button').click();
        await page.getByPlaceholder('e.g. Fall').click();
        await page.getByPlaceholder('e.g. Fall').fill(semesterData.name);
        await page.getByPlaceholder('e.g. Fall').press('Tab');
        await page.getByTestId('semester-status-active').click();
        await page.getByRole('button', { name: 'Create!' }).click();

        await expect(
            page.getByTestId(`semester-btn-${semesterData.name}`)
        ).toBeVisible();
    });
});
