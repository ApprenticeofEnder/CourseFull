import {
    clearData,
    createUserData,
    createValidFields,
    test,
    expect,
    type Page,
    Locator,
} from './conftest';

test.beforeEach(async ({ page }) => {
    await page.goto('/');

    page.on('dialog', (dialog) => {
        test.fail();
        throw new Error(dialog.message());
    });
});

test.describe('New User', () => {
    test('Should be able to navigate to the sign up page', async ({ page }) => {
        await expect(page).toHaveTitle(/CourseFull/);
        await expect(
            page.getByRole('heading', { name: 'Hey, friend!' })
        ).toBeVisible();
        await page.getByTestId('home-signup').click();
        await expect(page.getByTestId('signup-header')).toBeVisible();
    });

    test('Should be able to sign up given all data is correct', async ({
        signupPage,
    }) => {
        const page = signupPage;

        const user = createUserData();
        const validFields = createValidFields(user);
        const signUpButton = page.getByTestId('signup-button');

        await expect(signUpButton).toBeVisible();
        for (let field in validFields) {
            await expect(signUpButton).toBeDisabled();
            await page.getByPlaceholder(field).fill(validFields[field]);
        }
        await signUpButton.click();

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

        await clearData(user.email);
    });

    test('The user should not be able to sign up with invalid data in the form fields', async ({
        signupPage,
    }) => {
        const page = signupPage;

        const user = createUserData();
        const validFields = createValidFields(user);
        const signUpButton = page.getByTestId('signup-button');

        await expect(signUpButton).toBeVisible();
        for (let field in validFields) {
            await page.getByPlaceholder(field).fill(validFields[field]);
        }
        for (let field in validFields) {
            await incorrectFill('First Name', signUpButton, page);
            await page.getByPlaceholder(field).fill(validFields[field]);
        }
    });

    test('Should be able to navigate to the sign up page via the navbar', async ({
        page,
    }) => {
        await expect(page.getByTestId('nav-signup')).toBeVisible();
        await page.getByTestId('nav-signup').click();
        await expect(page.getByTestId('signup-header')).toBeVisible();
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
