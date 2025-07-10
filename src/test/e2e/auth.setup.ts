import { test as setup, expect } from '@playwright/test';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const authFile = path.join(__dirname, '../../../playwright/.auth/user.json');

setup('login and save storage state', async ({ page }) => {
	// Navigate and log in
	await page.goto('/auth');
	await page.locator('input[name="username"]').fill('testing');
	await page.locator('input[name="email"]').fill(process.env.TEST_EMAIL!);
	await page.locator('input[name="password"]').fill(process.env.TEST_PASS!);
	await page.getByRole('button', { name: 'Log In' }).click();

	// Confirm user is logged in
	await page.getByRole('link', { name: 'Tester Dashboard' }).click();
	await expect(page.getByRole('heading', { name: 'Hello testing' })).toBeVisible();

	await page.context().storageState({ path: authFile });
});
