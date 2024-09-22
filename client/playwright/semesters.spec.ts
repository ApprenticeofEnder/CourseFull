import { Endpoints } from '@coursefull';
import { AUTH_TOKEN_STORAGE_KEY } from '@lib/supabase/client';
import { expect, test } from '@playwright/authenticated.fixtures';

test.describe('New Semester', () => {
    test('User can create a semester with valid values', async ({
        authenticatedPage,
        semesterData,
    }) => {
        const page = authenticatedPage;

        page.on('dialog', (dialog) => {
            test.fail();
            throw new Error(dialog.message());
        });

        await page.goto(Endpoints.ROOT);

        await expect(page).toHaveURL(Endpoints.ROOT);

        await expect(
            page.getByRole('heading', {
                name: `Hey, friend!`,
            })
        ).toBeHidden();
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
