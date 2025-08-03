import { test, expect } from '@playwright/test';

// Already logged in via auth.setup.ts

test('World view is resizeable', async ({ page }) => {
	await page.goto('/worlds');
	await expect(page.getByRole('heading', { name: 'Select a world.' })).toBeVisible();

	// Wait for resizable panels and elements to load and be stable
	const canvas = page.locator('canvas').first();
	await expect(canvas).toBeVisible();

	// Get Before size of canvas
	const canvasBefore = await canvas.boundingBox();
	expect(canvasBefore).toBeTruthy();

	const resizer = page.getByRole('separator');
	await expect(resizer).toBeVisible();

	const box1 = await resizer.boundingBox();
	if (box1) {
		// Mouse drag
		await page.mouse.move(box1.x + box1.width / 2, box1.y + box1.height / 2);
		await page.mouse.down();
		await page.mouse.move(box1.x - 100, box1.y + box1.height / 2, { steps: 10 });
		await page.mouse.up();

		// Wait for resize to complete
		await page.waitForTimeout(300);
	}

	// After resize - get new measurements
	const canvasAfter = await canvas.boundingBox();

	expect(
		canvasAfter?.width !== canvasBefore?.width || canvasAfter?.height !== canvasBefore?.height,
		'Canvas size should change after resize'
	).toBe(true);
});
