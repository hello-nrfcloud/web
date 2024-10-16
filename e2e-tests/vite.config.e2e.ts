import { fromEnv } from '@bifravst/from-env'
import { join } from 'node:path'
import { createConfig } from '../vite/config.js'
import { createContext } from './lib/mock-backend/context.js'
import { mockWebsocket } from './lib/mock-backend/mockWebsocket.js'
import { testdataServerPlugin } from './lib/testDataServerPlugin.js'

const { mapRegion, mapName, mapApiKey } = fromEnv({
	mapRegion: 'MAP_REGION',
	mapName: 'MAP_NAME',
	mapApiKey: 'MAP_API_KEY',
})(process.env)

const context = createContext(join(process.cwd(), 'db'))

const base = 'http://localhost:8080'

const wsPort = 1024 + Math.floor(Math.random() * (65535 - 1024))
mockWebsocket(wsPort, context)

export default createConfig({
	domainName: 'localhost:8080',
	registryEndpoint: new URL('/e2e/registry.json', base),
	plugins: [
		testdataServerPlugin({
			registry: {
				helloApiURL: new URL('/e2e/rest/', base),
				// Map resources
				mapRegion,
				mapName,
				mapApiKey,
				// Map sharing
				sharingStatusAPIURL: new URL('/e2e/map-api/', base),
				// WebSocket
				webSocketURI: new URL(`ws://localhost:${wsPort}`),
				simDetailsAPIURL: new URL('/e2e/sim-details-api/', base),
			},
			context,
		}),
	],
	baseURL: '',
})
