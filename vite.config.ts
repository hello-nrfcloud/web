import { fromEnv } from '@bifravst/from-env'
import chalk from 'chalk'
import { createConfig } from './vite/config.ts'

const { mapRegion, mapApiKey } = fromEnv({
	mapRegion: 'MAP_REGION',
	mapApiKey: 'MAP_API_KEY',
})(process.env)

// Optional environment variables
const backendURLs = {
	helloApiURL: new URL(
		process.env.HELLO_API_URL ??
			'https://api.hello.nordicsemi.cloud/2024-04-17/',
	),
	webSocketURI: new URL(
		process.env.WEBSOCKET_URI ??
			'wss://f9q9oj5zv5.execute-api.eu-west-1.amazonaws.com/2023-06-22',
	),
	sharingStatusAPIURL: new URL(
		process.env.SHARING_STATUS_API_URL ??
			'https://api.nordicsemi.world/2024-04-15/share/status',
	),
	simDetailsAPIURL: new URL(
		process.env.SIM_DETAILS_API_URL ??
			'https://api.sim-details.nordicsemi.cloud/2024-07-01/',
	),
}

const sentryDSN = process.env.SENTRY_DSN
if (sentryDSN === undefined) {
	console.debug(chalk.yellow(`Sentry`), chalk.red('disabled'))
} else {
	console.debug(chalk.yellow(`Sentry DSN`), chalk.blue(sentryDSN))
}

export default createConfig({
	backendURLs,
	mapRegion,
	mapApiKey,
	sentryDSN,
	baseURL: process.env.BASE_URL ?? '',
	domainName: process.env.DOMAIN_NAME ?? 'hello.nrfcloud.com',
})
