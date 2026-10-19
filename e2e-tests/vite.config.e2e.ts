import { fromEnv } from '@bifravst/from-env'
import { join } from 'node:path'
import { createConfig } from '../vite/config.ts'
import { createContext } from './lib/mock-backend/context.ts'
import { mockWebsocket } from './lib/mock-backend/mockWebsocket.ts'
import { testdataServerPlugin } from './lib/testDataServerPlugin.ts'

const { mapRegion, mapApiKey } = fromEnv({
	mapRegion: 'MAP_REGION',
	mapApiKey: 'MAP_API_KEY',
})(process.env)

const context = createContext(join(process.cwd(), 'db'))

const domainName = 'localhost:8080'
const base = `http://${domainName}`

const wsPort = 1024 + Math.floor(Math.random() * (65535 - 1024))
mockWebsocket(wsPort, context)

export default createConfig({
	domainName,
	backendURLs: {
		helloApiURL: new URL('/e2e/rest/', base),
		// Map sharing
		sharingStatusAPIURL: new URL('/e2e/map-api/', base),
		// WebSocket
		webSocketURI: new URL(`ws://localhost:${wsPort}`),
		simDetailsAPIURL: new URL('/e2e/sim-details-api/', base),
	},
	plugins: [
		testdataServerPlugin({
			context,
		}),
	],
	baseURL: '',
	mapRegion,
	mapApiKey,
})
