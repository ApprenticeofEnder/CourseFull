import { test, expect, type Page } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.goto('/');
});

test.describe('New User', () => {
    test('Should be able to navigate to the sign up page', async ({ page }) => {
        await expect(page).toHaveTitle(/CourseFull/);
        await expect(page.getByText('Ready to say goodbye to')).toBeVisible();
        await expect(
            page.getByRole('heading', { name: 'Hey, friend!' })
        ).toBeVisible();
        await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
        await expect(
            page.getByRole('button', { name: 'Sign Up' })
        ).toBeVisible();
        await page.getByRole('button', { name: 'Sign Up' }).click();
        await expect(
            page.getByRole('heading', { name: 'Sign up for CourseFull' })
        ).toBeVisible();
    });

    test('Should be able to navigate to the sign up page via the navbar', async ({
        page,
    }) => {
        await expect(
            page.getByRole('button', { name: 'Open user menu Guest' })
        ).toBeVisible();
        await page
            .getByRole('button', { name: 'Open user menu Guest' })
            .click();
        await expect(
            page.getByRole('menuitem', { name: 'Sign Up' })
        ).toBeVisible();
        await page.getByRole('menuitem', { name: 'Sign Up' }).click();
        await expect(
            page.getByRole('heading', { name: 'Sign up for CourseFull' })
        ).toBeVisible();
    });
});
