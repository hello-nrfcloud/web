import { loadModelsFromMarkdown } from '#content/models/loadModelsFromMarkdown.js'
import type { Model } from '#content/models/types.js'
import {
	LwM2MObjectID,
	type BatteryAndPower_14202,
	type ButtonPress_14220,
	type ConnectionInformation_14203,
	type DeviceInformation_14204,
	type Environment_14205,
	type LwM2MObjectInstance,
	type NRFCloudServiceInfo_14401,
} from '@hello.nrfcloud.com/proto-map/lwm2m'
import { expect, test, type Page } from '@playwright/test'
import { checkForConsoleErrors } from '../lib/checkForConsoleErrors.js'
import { apiClient } from '../lib/mock-backend/apiClient.js'

let page: Page

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

	// Battery
	const batteryInfo: BatteryAndPower_14202 = {
		ObjectID: LwM2MObjectID.BatteryAndPower_14202,
		ObjectVersion: '1.0',
		Resources: {
			0: 89,
			99: ts,
		},
	}

	// Environment
	const environmentInfo: Environment_14205 = {
		ObjectID: LwM2MObjectID.Environment_14205,
		ObjectVersion: '1.0',
		Resources: {
			0: 26.1, // °C Temperature
			1: 26.8, // % Humidity
			2: 992.6, //hPa Atmospheric pressure
			10: 47, // Air Quality Index
			99: ts,
		},
	}

	const buttonPress: LwM2MObjectInstance<ButtonPress_14220> = {
		ObjectID: LwM2MObjectID.ButtonPress_14220,
		ObjectVersion: '1.0',
		ObjectInstanceID: 1,
		Resources: {
			99: ts,
		},
	}

	await apiClient.report(id, [
		serviceInfo,
		connectionInfo,
		deviceInfo,
		batteryInfo,
		environmentInfo,
		buttonPress,
	])
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
})

test.describe('Header', () => {
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

		// Not shown
		// 3: 33181,
		// 4: 52379652,
		// 6: '10.117.45.31',
		// 99: ts,
	})

	test('Show the signal quality', async () => {
		// Signal quality
		// 2: -70 (RSRP is not shown)
		// 11: 9 (Energy estimate)
		await expect(page.getByTestId('device-header-signalquality')).toContainText(
			'Excellent',
		)
	})

	test('Show the SIM information', async () => {
		await expect(page.getByTestId('device-header-sim')).toContainText(
			'Onomondo ApS',
		)
	})

	test('Show the state of charge', async () => {
		await expect(page.getByTestId('device-header-battery')).toContainText(
			'89 %',
		)
		await expect(page.getByTestId('battery-indicator')).toHaveAttribute(
			'title',
			'Battery level above 80%',
		)
	})

	test('Show the environment info', async () => {
		await expect(page.getByTestId('device-header-environment')).toContainText(
			'26.1 °C',
		)
		await expect(page.getByTestId('device-header-environment')).toContainText(
			'Excellent air quality',
		)
		await expect(
			page.getByTestId('device-header-environment').locator('abbr.air-quality'),
		).toHaveAttribute('title', 'Excellent')
	})
})

test.describe('Additional device information', () => {
	test('Show the supported firmware types', async () => {
		const fotaInfo = page.locator('#supported-firmware-types')
		await expect(fotaInfo).toContainText('BOOT')
		await expect(fotaInfo).toContainText('MODEM')
		await expect(fotaInfo).toContainText('APP')
		await expect(fotaInfo).toContainText('MDM_FULL')
	})

	test('Show the IMEI and the ICCID', async () => {
		const networkInfo = page.getByTestId('network-info')
		await expect(networkInfo).toContainText('355025930003866')
	})

	test('Show the ICCID with the vendor', async () => {
		const networkInfo = page.getByTestId('network-info')
		await expect(networkInfo).toContainText('89457300000066612345')
		await expect(networkInfo).toContainText('Onomondo ApS')
	})
})

test.describe('Additional environment information', () => {
	test('Show the temperature', async () => {
		await expect(page.getByTestId('environment-info')).toContainText('26.1 °C')
	})

	test('Show the humidity', async () => {
		await expect(page.getByTestId('environment-info')).toContainText('26.8 %')
	})

	test('Show the air quality', async () => {
		await expect(page.getByTestId('environment-info')).toContainText(
			'Excellent air quality',
		)
	})

	test('Show the atmospheric pressure', async () => {
		await expect(page.getByTestId('environment-info')).toContainText(
			`${Math.round(992.6)} mbar`,
		)
	})
})

test.describe('Show button presses', () => {
	test('Show the button presses', async () => {
		await expect(page.getByTestId('button-press')).toContainText(
			`Button #1 pressed`,
		)
	})
})
