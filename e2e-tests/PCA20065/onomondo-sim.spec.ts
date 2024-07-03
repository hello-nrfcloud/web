import { loadModelsFromMarkdown } from '#content/models/loadModelsFromMarkdown.js'
import type { Model } from '#content/models/types.js'
import {
	LwM2MObjectID,
	type DeviceInformation_14204,
} from '@hello.nrfcloud.com/proto-map/lwm2m'
import { expect, test, type Page } from '@playwright/test'
import { checkForConsoleErrors } from '../lib/checkForConsoleErrors.js'
import { apiClient } from '../lib/mock-backend/apiClient.js'

let page: Page

test.beforeAll(async ({ browser }) => {
	const date = new Date(Date.now() - 1000 * 60 * 60 * 24)
	const { fingerprint, id } = await apiClient.registerDevice('PCA20065', date)
	console.log(`New device`, { fingerprint })
	const ts = Math.floor(date.getTime() / 1000)

	// Device information
	const PCA20065 = (await loadModelsFromMarkdown)['PCA20065'] as Model
	const deviceInfo: DeviceInformation_14204 = {
		ObjectID: LwM2MObjectID.DeviceInformation_14204,
		ObjectVersion: '1.0',
		Resources: {
			0: '355025930003866', //IMEI
			1: '89457300000066612345', // SIM ICCID, Onomondo example
			2: `mfw_nrf91x1_${PCA20065.mfw.version}`, // Modem firmware version
			3: PCA20065.firmware.version, // Application firmware version
			4: 'thingy91x', // Board version
			99: ts,
		},
	}
	await apiClient.report(id, [deviceInfo])

	// SIM details
	await apiClient.setSIMDetails('89457300000066612345', {
		timestamp: '2024-07-01T10:53:16.790Z',
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
