import { test, expect, type Page, Locator } from '@playwright/test';
import { clearData } from './conftest';
import { faker } from '@faker-js/faker';

const createUser = () => ({
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    password:
        faker.internet.password() +
        faker.helpers.arrayElements('!#$%&? _"'.split(''), 3).join(''),
});

const createValidFields = (user: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
}): { [key: string]: string } => ({
    'First Name': user.first_name,
    'Last Name': user.last_name,
    Email: user.email,
    Password: user.password,
});

test.beforeEach(async ({ page }) => {
    await page.goto('/auth/signup');

    page.on('dialog', (dialog) => {
        throw new Error(dialog.message());
    });
});

test.describe('Sign Up', () => {
    test('The user should not be able to sign up until all data is filled out', async ({
        page,
    }) => {
        await expect(
            page.getByRole('heading', { name: 'Sign up for CourseFull' })
        ).toBeVisible();
        const user = createUser();
        const validFields = createValidFields(user);
        const signUpButton = page.getByRole('button', { name: 'Sign Up' });

        await expect(signUpButton).toBeVisible();
        for (let field in validFields) {
            await expect(signUpButton).toBeDisabled();
            await page.getByPlaceholder(field).fill(validFields[field]);
        }
        await expect(signUpButton).toBeEnabled();
        await page.getByRole('button', { name: 'Sign Up' }).click();

        await expect(
            page.getByRole('heading', { name: 'Email Verification Sent' })
        ).toBeVisible();

        // Testing Email Verification

        await page.goto('http://localhost:54324/');
        await page.getByRole('link', { name: 'Monitor' }).click();
        await page
            .getByRole('cell', { name: user.email.split('@')[0] })
            .click();
        await page
            .getByRole('link', { name: 'Confirm your email address' })
            .click();
        await expect(
            page.getByRole('gridcell', { name: "You don't have any active" })
        ).toBeVisible();

        await clearData(user.email);
    });

    test('The user should not be able to sign up with invalid data in the form fields', async ({
        page,
    }) => {
        const signUpButton = page.getByRole('button', { name: 'Sign Up' });
        await expect(signUpButton).toBeVisible();
        const user = createUser();
        const validFields = createValidFields(user);
        for (let field in validFields) {
            await page.getByPlaceholder(field).fill(validFields[field]);
        }
        await incorrectFill('First Name', signUpButton, page);
        await incorrectFill('Last Name', signUpButton, page);
        await incorrectFill('Email', signUpButton, page);
        await incorrectFill('Password', signUpButton, page);
        for (let field in validFields) {
            await page.getByPlaceholder(field).fill(validFields[field]);
        }
        await expect(signUpButton).toBeEnabled();
    });
});

async function incorrectFill(field: string, signUpButton: Locator, page: Page) {
    const invalidFields: { [key: string]: string[] } = {
        'First Name': ['A', 'A'.repeat(151)],
        'Last Name': ['A', 'A'.repeat(151)],
        Email: ['test', 'test@'],
        Password: ['123456', 'qwerty', 'AAAAARTGHJK', '!!!!!!!!', 'Password11'],
    };
    for (let incorrectValue of invalidFields[field]) {
        await page.getByPlaceholder(field).fill(incorrectValue);
        await expect(signUpButton).toBeDisabled();
    }
}
