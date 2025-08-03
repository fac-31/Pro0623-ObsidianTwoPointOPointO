import { test, expect } from '@playwright/test';

test('Graph view: clicking on The Verdant Expanse and then the enter-world button takes you to that worlds page', async ({
	page
}) => {
	await page.goto('/worlds');

	await page
		.locator('canvas')
		.first()
		.click({
			position: {
				x: 443,
				y: 335
			}
		});
	await expect(page.getByRole('heading', { name: 'The Verdant Expanse' })).toBeVisible();
});

test('Text view: clicking on The Verdant Expanse and then the enter-world button takes you to that worlds page', async ({
	page
}) => {
	await page.goto('/worlds');
	await page.getByRole('button', { name: 'Floating action dropdown' }).click();
	await page.getByRole('button', { name: 'Display Text' }).waitFor();
	await page.getByRole('button', { name: 'Display Text' }).click();
	await page.getByText('The Verdant Expanse').click();
	await page.getByRole('button', { name: 'Enter World' }).click();
	await expect(page.getByRole('heading', { name: 'The Verdant Expanse' })).toBeVisible();
});
