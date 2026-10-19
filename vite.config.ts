import { fromEnv } from '@bifravst/from-env'
import chalk from 'chalk'
import { createConfig } from './vite/config.ts'

const { mapRegion, mapApiKey } = fromEnv({
	mapRegion: 'MAP_REGION',
	mapApiKey: 'MAP_API_KEY',
})(process.env)

// Optional environment variables
// Unset GitHub Actions variables are passed as empty strings, treat them as not set.
const optionalEnv = (name: string): string | undefined => {
	const value = process.env[name]
	if (value === undefined || value.length === 0) return undefined
	return value
}

const backendURLs = {
	helloApiURL: new URL(
		optionalEnv('HELLO_API_URL') ??
			'https://api.hello.nordicsemi.cloud/2024-04-17/',
	),
	webSocketURI: new URL(
		optionalEnv('WEBSOCKET_URI') ??
			'wss://f9q9oj5zv5.execute-api.eu-west-1.amazonaws.com/2023-06-22',
	),
	sharingStatusAPIURL: new URL(
		optionalEnv('SHARING_STATUS_API_URL') ??
			'https://api.nordicsemi.world/2024-04-15/share/status',
	),
	simDetailsAPIURL: new URL(
		optionalEnv('SIM_DETAILS_API_URL') ??
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
