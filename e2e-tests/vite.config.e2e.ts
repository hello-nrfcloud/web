import { fromEnv } from '@nordicsemiconductor/from-env'
import { createConfig } from '../vite/config.js'
import { testdataServerPlugin } from './lib/testDataServerPlugin.js'

const { mapRegion, mapName, mapApiKey } = fromEnv({
	mapRegion: 'MAP_REGION',
	mapName: 'MAP_NAME',
	mapApiKey: 'MAP_API_KEY',
})(process.env)

const base = 'http://localhost:8080'

export default createConfig({
	domainName: 'localhost:8080',
	registryEndpoint: new URL('/e2e/registry.json', base),
	plugins: [
		testdataServerPlugin({
			registry: {
				helloApiURL: new URL('/e2e/rest/', base),
				webSocketURI: new URL('/e2e/ws/', base),
				// Map resources
				mapRegion,
				mapName,
				mapApiKey,
				// Map sharing
				sharingStatusAPIURL: new URL('/e2e/map-api/', base),
			},
		}),
	],
	baseURL: '',
})
