import chalk from 'chalk'
import pJSON from '../package.json'
import { HostingApp } from './HostingApp'

const certificateId =
	process.env.CERTIFICATE_ID ?? 'bd04a7e8-6ce0-418e-b496-58971ab00637'
const domainName = process.env.DOMAIN_NAME ?? 'nrf.guide'
const allowedClients = (
	process.env.ALLOWED_CLIENTS ??
	[
		'194.19.86.146', // Nordic Norway
		'173.11.12.233', // Nordic USA
		'173.11.12.234', // Nordic USA
		'schlupp.sytes.net', // mata home
	].join(',')
).split(',')

const repoUrl = new URL(pJSON.repository.url)
const repository = {
	owner: repoUrl.pathname.split('/')[1] ?? 'bifravst',
	repo: repoUrl.pathname.split('/')[2]?.replace(/\.git$/, '') ?? 'nrf.guide',
}

for (const [k, v] of Object.entries({
	Domain: domainName,
	'Certificate ID': certificateId,
	'OICD Owner': repository.owner,
	'OICD Repo': repository.repo,
	'Allowed clients': allowedClients.join(', '),
})) {
	console.debug(chalk.magenta(k), chalk.green(v))
}

new HostingApp('nrf-guide-web', {
	allowedClients,
	repository,
	certificateId,
	domainName,
	region: process.env.AWS_REGION ?? 'eu-north-1',
})
