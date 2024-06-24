import type { Plugin } from 'vite'
import type { Parameters } from '../../src/context/Parameters.js'
import { mockBackend } from './mock-backend.js'

export const testdataServerPlugin = ({
	registry,
}: {
	registry: Parameters
}): Plugin => ({
	name: 'testdata-server',
	configureServer: (server) => {
		Object.entries(mockBackend({ registry })).forEach(([route, handler]) =>
			server.middlewares.use(route, handler),
		)
	},
})
