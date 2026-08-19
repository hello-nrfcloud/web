import { fromEnv } from '@bifravst/from-env'
import chalk from 'chalk'
import { createConfig } from './vite/config.ts'

const { registryEndpoint, mapRegion, mapApiKey } = fromEnv({
	registryEndpoint: 'REGISTRY_ENDPOINT',
	mapRegion: 'MAP_REGION',
	mapApiKey: 'MAP_API_KEY',
})(process.env)

// Optional environment variables
const sentryDSN = process.env.SENTRY_DSN
if (sentryDSN === undefined) {
	console.debug(chalk.yellow(`Sentry`), chalk.red('disabled'))
} else {
	console.debug(chalk.yellow(`Sentry DSN`), chalk.blue(sentryDSN))
}

export default createConfig({
	registryEndpoint: new URL(registryEndpoint),
	mapRegion,
	mapApiKey,
	sentryDSN,
	baseURL: process.env.BASE_URL ?? '',
	domainName: process.env.DOMAIN_NAME ?? 'hello.nrfcloud.com',
})
