import type { PlaywrightTestConfig } from '@playwright/test'
import { devices } from '@playwright/test'
import path from 'path'
const isCI = process.env.CI !== undefined

const config: PlaywrightTestConfig = {
	testDir: path.join(process.cwd(), 'e2e-tests'),
	forbidOnly: isCI,
	retries: isCI ? 3 : 1,
	use: {
		trace: 'on-first-retry',
		video: 'on-first-retry',
		screenshot: 'only-on-failure',
		baseURL: 'http://localhost:8080/',
	},
	projects: [
		{
			name: 'chrome',
			use: { ...devices['Desktop Chrome'] },
		},
	],
	// Many tests operate on the Thing shadow of the same device, so we disable parallel test runs here globally
	workers: 1,
	webServer: {
		command: 'npm run start:e2e',
		url: 'http://localhost:8080/',
		timeout: 10 * 1000,
		reuseExistingServer: process.env.CI === undefined,
		stderr: 'pipe',
		stdout: 'pipe',
	},
}

export default config
