import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();

const storageStatePath = 'playwright/.auth/user.json';
/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
	testDir: './src/test/e2e',
	testMatch: /(.+\.)?(test|spec)\.[jt]s/,
	/* Run tests in files in parallel */
	fullyParallel: true,
	/* Fail the build on CI if you accidentally left test.only in the source code. */
	forbidOnly: !!process.env.CI,
	/* Retry on CI only */
	retries: process.env.CI ? 2 : 0,
	/* Opt out of parallel tests on CI. */
	workers: process.env.CI ? 1 : undefined,
	/* Reporter to use. See https://playwright.dev/docs/test-reporters */
	reporter: 'html',
	/* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
	use: {
		/* Base URL to use in actions like `await page.goto('/')`. */
		// baseURL: 'http://localhost:3000',

		/* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
		trace: 'on-first-retry'
	},

	/* Configure projects for major browsers */
	projects: [
		{
			name: 'setup',
			testMatch: 'auth.setup.ts' // 👈 just match this file
		},
		{
			name: 'chromium',
			use: {
				storageState: storageStatePath
			},
			dependencies: ['setup']
		},
		{
			name: 'firefox',
			use: {
				storageState: storageStatePath
			},
			dependencies: ['setup']
		},
		{
			name: 'webkit',
			use: {
				storageState: storageStatePath
			},
			dependencies: ['setup']
		}
	],

	/* Run your local dev server before starting the tests */
	webServer: {
		command: 'npm start',
		port: 4173,
		reuseExistingServer: !process.env.CI
	}
});
