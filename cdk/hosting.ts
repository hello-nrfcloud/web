import chalk from 'chalk'
import pJSON from '../package.json'
import { HostingApp } from './HostingApp.js'

const stackName = process.env.STACK_NAME ?? 'muninn-web'
const certificateId =
	process.env.CERTIFICATE_ID ?? 'a30ee0ef-413f-4dce-bf06-fca9d167e3de'
const domainName = process.env.DOMAIN_NAME ?? 'muninn.thingy.rocks'
const allowedClients = (
	process.env.ALLOWED_CLIENTS ??
	[
		'194.19.86.146', // Nordic Norway
		'173.11.12.233', // Nordic USA
		'173.11.12.234', // Nordic USA
		'schlupp.sytes.net', // mata home
		'50.47.141.67', // Requested by Patrick Barnes
	].join(',')
).split(',')

const repoUrl = new URL(pJSON.repository.url)
const repository = {
	owner: repoUrl.pathname.split('/')[1] ?? 'bifravst',
	repo:
		repoUrl.pathname.split('/')[2]?.replace(/\.git$/, '') ?? 'Muninn-frontend',
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

new HostingApp(stackName, {
	allowedClients,
	repository,
	certificateId,
	domainName,
	region: process.env.AWS_REGION ?? 'eu-central-1',
})
