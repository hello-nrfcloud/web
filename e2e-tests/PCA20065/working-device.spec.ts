import { expect, test, type Page } from '@playwright/test'
import { checkForConsoleErrors } from '../lib/checkForConsoleErrors.js'
import { apiClient } from '../lib/mock-backend/apiClient.js'
import {
	LwM2MObjectID,
	type ConnectionInformation_14203,
	type LwM2MObjectInstance,
	type NRFCloudServiceInfo_14401,
} from '@hello.nrfcloud.com/proto-map/lwm2m'
import { objectsToShadow } from '@hello.nrfcloud.com/proto-map/lwm2m/aws'

let page: Page

const report = async (
	deviceId: string,
	objects: Array<LwM2MObjectInstance>,
): Promise<void> => {
	await apiClient.updateState(deviceId, {
		reported: objectsToShadow(objects),
	})
}

test.beforeAll(async ({ browser }) => {
	const { fingerprint, id } = await apiClient.registerDevice(
		'PCA20065',
		new Date(),
	)
	console.log(`New device`, { fingerprint })
	const ts = Math.floor(Date.now() / 1000)
	// Register FOTA info
	const serviceInfo: NRFCloudServiceInfo_14401 = {
		ObjectID: LwM2MObjectID.NRFCloudServiceInfo_14401,
		ObjectVersion: '1.0',
		Resources: {
			0: ['BOOT', 'MODEM', 'APP', 'MDM_FULL'],
			99: ts,
		},
	}
	// Connection information
	const connectionInfo: ConnectionInformation_14203 = {
		ObjectID: LwM2MObjectID.ConnectionInformation_14203,
		ObjectVersion: '1.0',
		Resources: {
			0: 'LTE-M GPS',
			1: 20,
			2: -70,
			3: 33181,
			4: 52379652,
			5: 24201,
			6: '10.117.45.31',
			11: 9,
			99: ts,
		},
	}

	await report(id, [serviceInfo, connectionInfo])
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

	test('Show the connection information', async () => {
		// Network Mode
		await expect(page.getByTestId('network-mode-icon')).toBeVisible()
		// ... is in the title of the SVG
		const locator = await page.evaluate(
			() =>
				document.querySelector('[data-testid="network-mode-icon"] title')
					?.textContent ?? '',
		)
		expect(locator).toContain('LTE-M')
		// Band: 20
		await expect(page.getByTestId('network-band')).toHaveAttribute(
			'title',
			/Band: 20/,
		)
		await expect(page.getByTestId('network-band')).toHaveAttribute(
			'title',
			/LTE-M/,
		)
		// Network country
		// 5: 24201
		await expect(page.getByTestId('network-country-flag')).toHaveAttribute(
			'alt',
			'Norway',
		)
		// Signal quality
		// 2: -70 (RSRP is not shown)
		// 11: 9 (Energy estimate)
		await expect(page.getByTestId('device-header-signalquality')).toContainText(
			'Excellent',
		)
		// Not shown
		// 3: 33181,
		// 4: 52379652,
		// 6: '10.117.45.31',
		// 99: ts,
	})
})
