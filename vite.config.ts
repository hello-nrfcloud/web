import { fromEnv } from '@bifravst/from-env'
import chalk from 'chalk'
import { createConfig } from './vite/config.js'

const { registryEndpoint } = fromEnv({
	registryEndpoint: 'REGISTRY_ENDPOINT',
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
	sentryDSN,
	baseURL: process.env.BASE_URL ?? '',
	domainName: process.env.DOMAIN_NAME ?? 'hello.nrfcloud.com',
})
