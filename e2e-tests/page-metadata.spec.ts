import { expect, test } from '@playwright/test'
import { promises as fs } from 'fs'
import * as path from 'path'
import { checkForConsoleErrors } from './checkForConsoleErrors.js'

test.afterEach(checkForConsoleErrors)

test('The page metadata should be set', async ({ page }) => {
	await page.goto('http://localhost:8080/')
	const { name } = JSON.parse(
		await fs.readFile(
			path.join(process.cwd(), 'static', 'manifest.json'),
			'utf-8',
		),
	)
	await expect(page).toHaveTitle(name)
	// FIXME: test other metadata as well
	// See https://github.com/microsoft/playwright/issues/9417
})
