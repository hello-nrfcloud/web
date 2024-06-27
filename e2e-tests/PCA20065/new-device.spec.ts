import { expect, test, type Page } from '@playwright/test'
import { checkForConsoleErrors } from '../checkForConsoleErrors.js'
import { apiClient } from '../lib/mock-backend/apiClient.js'

let page: Page

test.beforeAll(async ({ browser }) => {
	const { fingerprint } = await apiClient.registerDevice('PCA20065')
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
})
