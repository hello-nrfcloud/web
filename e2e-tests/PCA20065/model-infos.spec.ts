import { expect, test, test as it, type Page } from '@playwright/test'
import { checkForConsoleErrors } from '../lib/checkForConsoleErrors.js'

let page: Page

test.afterEach(checkForConsoleErrors)

test.beforeAll(async ({ browser }) => {
	page = await browser.newPage()
	await page.goto('http://localhost:8080/model/PCA20065')
})

test.afterAll(async () => {
	await page.close()
})

test.describe('The page with the model infos should exist', () => {
	it('has a title', async () => {
		await expect(page).toHaveTitle(/Thingy:91 X/)
	})
	it('has a "Learn more" link', async () => {
		await expect(page.getByRole('link', { name: 'Learn more' })).toBeVisible()
	})
	it('has a "Documentation" link', async () => {
		await expect(
			page.getByRole('link', { name: 'Documentation' }),
		).toBeVisible()
	})
})
