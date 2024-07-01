import { expect, test, type Page } from '@playwright/test'
import { checkForConsoleErrors } from '../checkForConsoleErrors.js'
import { apiClient } from '../lib/mock-backend/apiClient.js'
import {
	LwM2MObjectID,
	type NRFCloudServiceInfo_14401,
} from '@hello.nrfcloud.com/proto-map/lwm2m'
import { objectsToShadow } from '@hello.nrfcloud.com/proto-map/lwm2m/aws'

let page: Page

test.beforeAll(async ({ browser }) => {
	const { fingerprint, id } = await apiClient.registerDevice(
		'PCA20065',
		new Date(),
	)
	console.log(`New device`, { fingerprint })
	// Register FOTA info
	const fotaInfo: NRFCloudServiceInfo_14401 = {
		ObjectID: LwM2MObjectID.NRFCloudServiceInfo_14401,
		ObjectVersion: '1.0',
		Resources: {
			0: ['BOOT', 'MODEM', 'APP', 'MDM_FULL'],
			99: Math.floor(Date.now() / 1000),
		},
	}
	await apiClient.updateState(id, {
		reported: objectsToShadow([fotaInfo]),
	})
	page = await browser.newPage()
	await page.goto(`http://localhost:8080/${fingerprint}`)
	await page.waitForURL('http://localhost:8080/device')
})

test.afterAll(async () => {
	await page.close()
})

test.afterEach(checkForConsoleErrors)

test.describe('Show all OK', () => {
	test('Show the info that everything is OK', async () => {
		const quickGlance = page.locator('#quickGlance')
		await expect(quickGlance).toContainText('Your device is working perfectly!')
		const connectionSuccess = page.locator('#connection-success')
		await expect(connectionSuccess).toContainText('Success!')
		await expect(connectionSuccess).toContainText(
			'Your device connected and is sending data to the cloud!',
		)
	})

	test('Show the supported firmware types', async () => {
		const fotaInfo = page.locator('#supported-firmware-types')
		await expect(fotaInfo).toContainText('BOOT')
		await expect(fotaInfo).toContainText('MODEM')
		await expect(fotaInfo).toContainText('APP')
		await expect(fotaInfo).toContainText('MDM_FULL')
	})
})
