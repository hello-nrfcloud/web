import type { DeviceIdentity } from '@hello.nrfcloud.com/proto/hello'
import type { Static } from '@sinclair/typebox'
import { merge } from 'lodash-es'
import type { Connect } from 'vite'
import type { Parameters } from '../../../src/context/Parameters.js'
import { generateFingerprint } from '../../../src/utils/generateFingerprint.js'
import { generateIMEI } from '../../../src/utils/generateIMEI.js'
import type { SIMUsage, createContext } from './context.js'
import { generateRegistryResponse } from './generateRegistryResponse.js'
import { getBody, getJSON, sendJSON, sendStatus, sendText } from './sendJSON.js'

export const mockBackend = ({
	registry,
	context,
}: {
	registry: Parameters
	context: ReturnType<typeof createContext>
}): Record<string, Connect.SimpleHandleFunction> => ({
	'GET /e2e/registry.json': (_, res) =>
		sendJSON(res, generateRegistryResponse(registry)),
	'PUT /api/release': async (req, res) => {
		context.release.set(await getBody(req))
		sendStatus(res, 204)
	},
	'PUT /api/devices/state': async (req, res) => {
		const deviceId = req.originalUrl?.split('/').pop()
		if (deviceId === undefined) {
			sendStatus(res, 400)
			return
		}
		const state = await getJSON(req)
		const oldState = context.deviceState.get(deviceId) ?? {
			reported: {},
			desired: {},
		}
		context.deviceState.set(deviceId, merge(oldState, state))
		sendStatus(res, 204)
	},
	'POST /api/devices': async (req, res) => {
		const id = `oob-${generateIMEI()}`
		const fingerprint = generateFingerprint()
		const { model, lastSeen } = (await getJSON(req)) as Pick<
			Static<typeof DeviceIdentity>,
			'model' | 'lastSeen'
		>
		context.devices.set(fingerprint, {
			'@context': 'https://hello.nrfcloud.com/contexts/DeviceIdentity',
			model,
			lastSeen,
			id,
			fingerprint,
		})
		sendJSON(res, { id, fingerprint }, 201)
	},
	'GET /e2e/sim-details-api/sim': (req, res) => {
		const details = context.simDetails.get(
			req.originalUrl?.split('/').pop() ?? '',
		)
		if (details === undefined) {
			sendStatus(res, 404)
			return
		}
		return sendJSON(res, details)
	},
	'PUT /api/simDetails': async (req, res) => {
		const iccid = req.originalUrl?.split('/').pop()
		if (iccid === undefined) {
			sendStatus(res, 400)
			return
		}
		const details = await getJSON(req)
		context.simDetails.set(iccid, details as SIMUsage)
		sendStatus(res, 204)
	},
	'GET /.well-known/release': (_, res) => sendText(res, context.release.get()),
})
