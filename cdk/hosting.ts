import chalk from 'chalk'
import pJSON from '../package.json'
import { HostingApp } from './HostingApp'

const certificateId =
	process.env.CERTIFICATE_ID ?? 'bd04a7e8-6ce0-418e-b496-58971ab00637'
const domainName = process.env.DOMAIN_NAME ?? 'nrf.guide'
const allowedIps = (process.env.ALLOWED_IPS ?? '194.19.86.146').split(',')

const repoUrl = new URL(pJSON.repository.url)
const repository = {
	owner: repoUrl.pathname.split('/')[1] ?? 'NordicSemiconductor',
	repo: repoUrl.pathname.split('/')[2]?.replace(/\.git$/, '') ?? 'nrf.guide',
}

for (const [k, v] of Object.entries({
	Domain: domainName,
	'Certificate ID': certificateId,
	'OICD Repo': repository.repo,
	'OICD Owner': repository.owner,
	'Allowed IPs': allowedIps.join(', '),
})) {
	console.debug(chalk.magenta(k), chalk.green(v))
}

new HostingApp('nrf-guide-web', {
	allowedIps,
	repository,
	certificateId,
	domainName,
	region: process.env.AWS_REGION ?? 'eu-north-1',
})
