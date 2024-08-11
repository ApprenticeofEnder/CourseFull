import { test, expect, type Page, Locator } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.goto('/');

    page.on('dialog', (dialog) => {
        throw new Error(dialog.message());
    });
});

test.describe('New Semester', () => {
    test('User can create a semester with valid values', async () => {});
});
