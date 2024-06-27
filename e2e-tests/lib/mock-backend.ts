import type { Connect } from 'vite'
import type { Parameters } from '../../src/context/Parameters.tsx'
import { generateRegistryResponse } from './mock-backend/generateRegistryResponse.js'
import {
	getBody,
	getJSON,
	sendJSON,
	sendStatus,
} from './mock-backend/sendJSON.js'
import type { createContext } from './mock-backend/context.js'
import type { Static } from '@sinclair/typebox'
import type { DeviceIdentity } from '@hello.nrfcloud.com/proto/hello'

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
		context.devices.push(
			(await getJSON(req)) as Static<typeof DeviceIdentity> & {
				fingerprint: string
			},
		)
		sendStatus(res, 201)
	},
})
