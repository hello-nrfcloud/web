import chalk from 'chalk'
import { MapApp } from './MapApp.js'

const stackName = process.env.MAP_STACK_NAME ?? 'hello-nrfcloud-map'
const domainName = process.env.DOMAIN_NAME ?? 'hello.nrfcloud.com'

for (const [k, v] of Object.entries({
	Domain: domainName,
})) {
	console.debug(chalk.magenta(k), chalk.green(v))
}

new MapApp(stackName, {
	domainName,
	region: process.env.AWS_REGION ?? 'eu-central-1',
})
