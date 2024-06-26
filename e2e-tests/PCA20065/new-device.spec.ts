import { expect, test, type Page } from '@playwright/test'
import { checkForConsoleErrors } from '../checkForConsoleErrors.js'

let page: Page

test.beforeAll(async ({ browser }) => {
	page = await browser.newPage()
	await page.goto('http://localhost:8080/29a.n3d4t4')
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
