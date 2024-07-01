import type { Connect } from 'vite'
import type { Parameters } from '../../src/context/Parameters.tsx'
import { generateRegistryResponse } from './mock-backend/generateRegistryResponse.js'
import {
	getBody,
	getJSON,
	sendJSON,
	sendStatus,
	sendText,
} from './mock-backend/sendJSON.js'
import type { createContext } from './mock-backend/context.js'
import type { Static } from '@sinclair/typebox'
import type { DeviceIdentity } from '@hello.nrfcloud.com/proto/hello'
import { generateIMEI } from '../../src/utils/generateIMEI.js'
import { generateFingerprint } from '../../src/utils/generateFingerprint.js'

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
		context.release = await getBody(req)
		sendStatus(res, 204)
	},
	'POST /api/devices': async (req, res) => {
		const id = `oob-${generateIMEI()}`
		const fingerprint = generateFingerprint()
		const { model, lastSeen } = (await getJSON(req)) as Pick<
			Static<typeof DeviceIdentity>,
			'model' | 'lastSeen'
		>
		context.devices.push({
			'@context': 'https://hello.nrfcloud.com/contexts/DeviceIdentity',
			model,
			lastSeen,
			id,
			fingerprint,
		})
		sendJSON(res, { id, fingerprint }, 201)
	},
	'GET /.well-known/release': (_, res) => sendText(res, context.release),
})
