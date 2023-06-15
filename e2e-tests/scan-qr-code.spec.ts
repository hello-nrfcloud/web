import { expect, test } from '@playwright/test'
import * as path from 'path'
import { chromium } from 'playwright'
import { checkForConsoleErrors } from './checkForConsoleErrors.js'

test.afterEach(checkForConsoleErrors)

test.skip('I can scan a QR code', async () => {
	const browser = await chromium.launch({
		ignoreDefaultArgs: ['--mute-audio'],
		args: [
			'--use-fake-ui-for-media-stream',
			'--use-fake-device-for-media-stream',
			// Pass a video file converted from a still image using:
			// ffmpeg -i qr-code.png -pix_fmt yuv420p video-for-chrome.mjpeg
			`--use-file-for-fake-video-capture=${path.join(
				process.cwd(),
				'e2e-tests',
				'qr-code.mjpeg',
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
		'https://muninn.thingy.rocks/29a.5392db',
	)

	// Do not check redirect page for now, forbidden to be access by GitHub servers
	// await page.waitForURL('https://muninn.thingy.rocks/')
})
