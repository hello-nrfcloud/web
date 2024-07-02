import { expect, test } from '@playwright/test'
import * as path from 'path'
import { chromium } from 'playwright'
import { checkForConsoleErrors } from './lib/checkForConsoleErrors.js'

test.afterEach(checkForConsoleErrors)

test('I can scan a QR code', async () => {
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
				'qr-code',
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
		'http://localhost:8080/29a.5392db',
	)
	await page.waitForURL('http://localhost:8080/29a.5392db')
	await page.waitForURL('http://localhost:8080/recognizing-fingerprint')
})
