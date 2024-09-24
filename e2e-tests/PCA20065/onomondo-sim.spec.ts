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
		usedBytes: 2500000,
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

test.describe('Header', () => {
	test('Show the SIM information', async () => {
		await expect(page.getByTestId('device-header-sim')).toContainText(
			'Onomondo ApS',
		)
		await expect(page.getByTestId('device-header-sim')).toContainText('75 %')
		await expect(page.getByTestId('sim-usage')).toHaveAttribute(
			'title',
			/Used 2.5 of 10 MB/,
		)
	})
})

test.describe('Troubleshooting', () => {
	test('Show usage', async () => {
		await expect(page.getByTestId('sim-troubleshooting')).toContainText(
			'You have 75 % data left on your SIM card (7.5 MB).',
		)
	})
})

test.describe('Show warning in QuickGlance of not enough data is available', () => {})
