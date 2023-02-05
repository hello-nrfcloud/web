import { expect, test } from '@playwright/test'
import * as path from 'path'
import { chromium } from 'playwright'
import { checkForConsoleErrors } from './checkForConsoleErrors.js'

test.afterEach(checkForConsoleErrors)

test('I can scan a QR code', async () => {
	const browser = await chromium.launch({
		ignoreDefaultArgs: ['--mute-audio'],
		args: [
			'--use-fake-ui-for-media-stream',
			'--use-fake-device-for-media-stream',
			// Pass a video file converted from a still image using:
			// ffmpeg -i qr-code.png -t 2 -pix_fmt yuv420p video-for-chrome.y4m
			`--use-file-for-fake-video-capture=${path.join(
				process.cwd(),
				'e2e-tests',
				'qr-code.y4m',
			)}`,
		],
	})
	// Ensure to grant permissions to webcam, because we cannot programmatically click on the dialogue
	const context = await browser.newContext({
		permissions: ['camera'],
	})
	const page = await context.newPage()
	await page.goto('http://localhost:8080/')
	await page.getByRole('button', { name: 'Scan QR code' }).click()
	await expect(page.getByTestId('qr-code-scan')).toHaveText(
		'https://nrf.guide/42.d3c4fb4d',
	)
	await page.waitForURL('https://nrf.guide/')
})
