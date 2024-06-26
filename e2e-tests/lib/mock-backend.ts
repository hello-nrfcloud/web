import { type IncomingMessage, type ServerResponse } from 'http'
import type { Connect } from 'vite'
import type { Parameters } from '../../src/context/Parameters.tsx'

export const mockBackend = ({
	registry,
}: {
	registry: Parameters
}): Record<string, Connect.SimpleHandleFunction> => ({
	'/e2e/registry.json': (_, res) =>
		sendJSON(res, generateRegistryResponse(registry)),
})

const generateRegistryResponse = (
	registry: Parameters,
): Parameters & {
	'@ts': string // e.g. '2024-03-06T14:42:12.690Z'
	'@version': 1
	'@context': 'https://github.com/hello-nrfcloud/public-parameter-registry-aws-js'
} => ({
	'@version': 1,
	'@ts': new Date().toISOString(),
	'@context':
		'https://github.com/hello-nrfcloud/public-parameter-registry-aws-js',
	...registry,
})

const sendJSON = (
	res: ServerResponse<IncomingMessage>,
	payload: Record<string, unknown>,
): void => {
	const payloadJSON = JSON.stringify(payload)
	console.debug(`>`, payloadJSON)
	res.setHeader('Content-type', 'application/json; charset=utf-8')
	res.setHeader('Content-length', payloadJSON.length.toString())
	res.write(payloadJSON)
	res.end()
}

const base = new URL('http://localhost:8080')
export const mockBackendApi = {
	setRelease: async (release: string): Promise<void> => {
		await fetch(new URL('/api/release', base), {
			method: 'PUT',
			body: release,
		})
	},
}

export const anError = (
	res: ServerResponse<IncomingMessage>,
	statusCode: number,
): void => {
	res.statusCode = statusCode
	res.end()
}
