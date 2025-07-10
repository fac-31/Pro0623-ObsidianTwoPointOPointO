import { test, expect } from '@playwright/test';

// Already logged in via auth.setup.ts

test('Resizable panels update size after dragging', async ({ page }) => {
	// Go to Tester Dashboard
	await page.goto('/')
	await page.getByRole('link', { name: 'Tester Dashboard' }).click();
	await expect(page.getByRole('heading', { name: 'Hello testing' })).toBeVisible();

	// Wait for resizable panels to load and be stable
	const queryPanel = page.getByTestId('query-panel');
	const infoPanel = page.getByTestId('info-panel');
	const canvas = page.locator('canvas').first();

	// Wait for elements to be stable
	await expect(queryPanel).toBeVisible();
	await expect(infoPanel).toBeVisible();
	await expect(canvas).toBeVisible();

	const queryBefore = await queryPanel.boundingBox();
	const infoBefore = await infoPanel.boundingBox();
	const canvasBefore = await canvas.boundingBox();

	expect(queryBefore).toBeTruthy();
	expect(infoBefore).toBeTruthy();
	expect(canvasBefore).toBeTruthy();

	// First separator (between canvas and side panel)
	const resizer1 = page.getByRole('separator').first();
	await expect(resizer1).toBeVisible();

	const box1 = await resizer1.boundingBox();
	if (box1) {
		// Mouse drag
		await page.mouse.move(box1.x + box1.width / 2, box1.y + box1.height / 2);
		await page.mouse.down();
		await page.mouse.move(box1.x - 100, box1.y + box1.height / 2, { steps: 10 });
		await page.mouse.up();

		// Wait for resize to complete
		await page.waitForTimeout(300);
	}

	// Second separator (between QueryPanel and InfoPanel)
	const resizer2 = page.getByRole('separator').nth(1);
	await expect(resizer2).toBeVisible();

	const box2 = await resizer2.boundingBox();
	if (box2) {
		await page.mouse.move(box2.x + box2.width / 2, box2.y + box2.height / 2);
		await page.mouse.down();
		await page.mouse.move(box2.x + box2.width / 2, box2.y + 100, { steps: 10 });
		await page.mouse.up();

		// Wait for resize to complete
		await page.waitForTimeout(300);
	}

	// Wait a bit more for all animations/transitions to complete
	await page.waitForTimeout(200);

	// After resize - get new measurements
	const queryAfter = await queryPanel.boundingBox();
	const infoAfter = await infoPanel.boundingBox();
	const canvasAfter = await canvas.boundingBox();

	// Test that panels changed size (width OR height)
	expect(
		queryAfter?.width !== queryBefore?.width || queryAfter?.height !== queryBefore?.height,
		'Query panel size should change after resize'
	).toBe(true);
	expect(
		infoAfter?.width !== infoBefore?.width || infoAfter?.height !== infoBefore?.height,
		'Info panel size should change after resize'
	).toBe(true);
	expect(
		canvasAfter?.width !== canvasBefore?.width || canvasAfter?.height !== canvasBefore?.height,
		'Canvas size should change after resize'
	).toBe(true);

});
