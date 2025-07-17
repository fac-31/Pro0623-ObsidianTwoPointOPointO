import { test, expect } from '@playwright/test';

test('Clicking on a world and then the enter-world button takes you to that worlds page', async ({
	page
}) => {
	await page.goto('http://localhost:5173/worlds');

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
	await page.getByRole('button', { name: 'Enter World' }).click();
	await page.goto('http://localhost:5173/worlds/4:1e2fd644-54fb-4048-9d76-adc63b6fcd5b:13');
	await expect(page.getByRole('heading', { name: 'The Verdant Expanse' })).toBeVisible();
});
