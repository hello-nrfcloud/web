import type { Plugin } from 'vite'
import type { Parameters } from '../../src/context/Parameters.js'
import { mockBackend } from './mock-backend.js'
import type { createContext } from './mock-backend/context.js'
import type { Connect } from 'vite'
import type { IncomingMessage, ServerResponse } from 'http'

export const testdataServerPlugin = ({
	registry,
	context,
}: {
	registry: Parameters
	context: ReturnType<typeof createContext>
}): Plugin => ({
	name: 'testdata-server',
	configureServer: (server) => {
		Object.entries(
			mockBackend({
				registry,
				context,
			}),
		).forEach(([route, handler]) => {
			const [method, path] = route.split(' ')
			if (method === undefined || path === undefined)
				throw new Error(`Route ${route} does not specify method and path!`)
			return server.middlewares.use(path, checkMethod(method)(handler))
		})
	},
})

const checkMethod =
	(method: string) =>
	(handler: Connect.SimpleHandleFunction) =>
	(req: IncomingMessage, res: ServerResponse) => {
		if (req.method !== method) {
			res.statusCode = 405
			res.end()
			return
		}
		handler(req, res)
	}
