import { expect, test, type Page } from '@playwright/test'
import { checkForConsoleErrors } from '../checkForConsoleErrors.js'
import { apiClient } from '../lib/mock-backend/apiClient.js'

let page: Page

let fingerprint: string | undefined
let deviceId: string | undefined

test.beforeAll(async ({ browser }) => {
	const { fingerprint: f, id } = await apiClient.registerDevice('PCA20065')
	fingerprint = f
	deviceId = id
	console.log(`New device`, { fingerprint })
	page = await browser.newPage()
	await page.goto(`http://localhost:8080/${fingerprint}`)
	await page.waitForURL('http://localhost:8080/device')
})

test.afterAll(async () => {
	await page.close()
})

test.afterEach(checkForConsoleErrors)

test.describe('Show basic information about the device ', () => {
	test('Show the model name ', async () => {
		await expect(page.getByTestId('model-name')).toHaveText('PCA20065')
	})
	test('Show the device ID ', async () => {
		await expect(page.getByTestId('device-id')).toContainText(deviceId!)
	})
})

test.describe('Show problem information', () => {
	test('Show the warning that no data is available', async () => {
		const quickGlance = page.locator('#quickGlance')
		await expect(quickGlance).toContainText(
			'We have detected problems with your device!',
		)
		await expect(quickGlance).toContainText('Waiting for data from your device')
	})
})

test('Show troubleshooting info', async () => {
	const troubleshooting = page.locator('#troubleshooting')
	await expect(troubleshooting).toBeVisible()
	await expect(troubleshooting).toContainText(
		'Make sure the battery is charged.',
	)
	await expect(troubleshooting).toContainText('Turn the kit on.')
	await expect(troubleshooting).toContainText('Insert a SIM card.')
	await expect(troubleshooting).toContainText(
		'Sufficient data left on the SIM?',
	)
})
