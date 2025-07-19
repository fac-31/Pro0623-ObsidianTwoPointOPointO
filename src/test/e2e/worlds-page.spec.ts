import { test, expect } from '@playwright/test';

test('Worlds page should load and display the dashboard', async ({ page }) => {
	await page.goto('/worlds');
	const dashboard = page.getByTestId('dashboard');
	await expect(dashboard).toBeVisible();
});
