import { expect, test, type Page } from '@playwright/test'
import { checkForConsoleErrors } from '../lib/checkForConsoleErrors.js'
import { apiClient } from '../lib/mock-backend/apiClient.js'
import { newThingy91X } from './seeders/devices.js'

let page: Page

test.beforeAll(async ({ browser }) => {
	const { fingerprint, iccid } = await newThingy91X()

	// SIM details
	await apiClient.setSIMDetails(iccid, {
		ts: new Date().toISOString(),
		usedBytes: 10000000,
		totalBytes: 10000000,
	})

	page = await browser.newPage()
	await page.goto(`http://localhost:8080/${fingerprint}`)
	await page.waitForURL('http://localhost:8080/device')
})

test.afterAll(async () => {
	await page.close()
})

test.afterEach(checkForConsoleErrors)

test.describe('Show warning in QuickGlance of not enough data is available', () => {
	test('Show the warning that no data is available', async () => {
		const quickGlance = page.locator('#quickGlance')
		await expect(quickGlance).toContainText(
			'We have detected problems with your device!',
		)
		await expect(quickGlance).toContainText('No data left on SIM')
	})
})
