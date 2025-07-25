import { test, expect } from '@playwright/test';

test.describe('/worlds/:id page', () => {
	// Shared setup before each test
	test.beforeEach(async ({ page }) => {
		await page.goto('/worlds/4:1e2fd644-54fb-4048-9d76-adc63b6fcd5b:8');
	});
	test('Graph view: renders', async ({ page }) => {
		await expect(page.getByLabel('Graph view')).toBeVisible();
		await expect(page.getByTestId('query-info-panel-group')).toBeVisible();
	});
	test('Text view: Able to navigate to text view which renders', async ({ page }) => {
		await expect(page.locator('canvas').first()).toBeVisible();
		await page.getByRole('button', { name: 'Floating action dropdown' }).click();
		await page.getByRole('button', { name: 'Display Text' }).click();
		await page.getByTestId('text-view').waitFor();
		await expect(page.getByText('Location')).toBeVisible();
		await expect(page.getByText('Character')).toBeVisible();
		await expect(page.getByText('Event')).toBeVisible();
	});
});
