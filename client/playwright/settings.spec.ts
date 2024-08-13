import { Endpoints } from '@coursefull';
import {
    test,
    expect,
    type Page,
    Locator,
    dbConnect,
    supabaseServiceRole,
} from '@playwright/conftest';

test.describe('Deleting Account', () => {
    test('User can delete their account successfully', async ({
        loginPage,
        deleteUser,
    }) => {
        const page = loginPage;

        page.on('dialog', (dialog) => {
            test.fail();
            throw new Error(dialog.message());
        });

        await page.getByTestId('login-email').click();
        await page.getByTestId('login-email').fill(deleteUser.email);
        await page.getByTestId('login-password').click();
        await page.getByTestId('login-password').fill('Password1!');
        await page.getByTestId('login-button').click();

        await expect(
            page.getByText(`Hey, ${deleteUser.first_name}!`)
        ).toBeVisible();

        await page.goto(Endpoints.SETTINGS);

        await page.getByTestId('delete-account').click({clickCount: 5});

        await expect(page.getByTestId('delete-heading')).toBeVisible({timeout: 10000});

        await page.getByTestId('delete-confirmation').click();
        await page.getByTestId('delete-confirmation').fill('DELETE');
        await page.getByTestId('delete-account-btn').click();

        await page.waitForTimeout(3000);

        await using dbClient = await dbConnect();

        let remainingAccounts = await dbClient.query(`SELECT id FROM api_v1_users WHERE email ILIKE $1`, [
            `%${deleteUser.email}%`
        ]);

        const response = await supabaseServiceRole.auth.admin.getUserById(deleteUser.supabase_id);

        expect(response.error?.status).toBe(404);

        expect(remainingAccounts.rows.length).toBe(0);
    });
});
