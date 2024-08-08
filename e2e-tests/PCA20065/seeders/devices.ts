import { loadModelsFromMarkdown } from '#content/models/loadModelsFromMarkdown.js'
import type { Model } from '#content/models/types.js'
import { generateIMEI } from '#utils/generateIMEI.js'
import {
	LwM2MObjectID,
	type DeviceInformation_14204,
} from '@hello.nrfcloud.com/proto-map/lwm2m'
import { apiClient } from '../../lib/mock-backend/apiClient.js'

export const newThingy91X = async (): Promise<{
	fingerprint: string
	iccid: string
	imei: string
}> => {
	const date = new Date(Date.now() - 1000 * 60 * 60 * 24)
	const { fingerprint, id } = await apiClient.registerDevice('PCA20065', date)
	console.log(`New device`, { fingerprint })
	const ts = Math.floor(date.getTime() / 1000)
	const iccid =
		'894573000000666' + Math.floor(Math.random() * 100000).toString()
	const imei = generateIMEI()

	// Device information
	const PCA20065 = (await loadModelsFromMarkdown)['PCA20065'] as Model
	const deviceInfo: DeviceInformation_14204 = {
		ObjectID: LwM2MObjectID.DeviceInformation_14204,
		ObjectVersion: '1.0',
		Resources: {
			0: imei, //IMEI
			1: iccid, // SIM ICCID, Onomondo example
			2: `mfw_nrf91x1_${PCA20065.mfw.version}`, // Modem firmware version
			3: PCA20065.firmware.version, // Application firmware version
			4: 'thingy91x', // Board version
			99: ts,
		},
	}
	await apiClient.report(id, [deviceInfo])

	return { fingerprint, imei, iccid }
}
