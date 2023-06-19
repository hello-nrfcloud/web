import chalk from 'chalk'
import pJSON from '../package.json'
import { HostingApp } from './HostingApp.js'

const stackName = process.env.STACK_NAME ?? 'hello-nrfcloud-web'
const certificateId =
	process.env.CERTIFICATE_ID ?? 'a30ee0ef-413f-4dce-bf06-fca9d167e3de'
const domainName = process.env.DOMAIN_NAME ?? 'hello.nrfcloud.com'

const repoUrl = new URL(pJSON.repository.url)
const repository = {
	owner: repoUrl.pathname.split('/')[1] ?? 'bifravst',
	repo:
		repoUrl.pathname.split('/')[2]?.replace(/\.git$/, '') ??
		'hello-nrfcloud-web',
}

for (const [k, v] of Object.entries({
	Domain: domainName,
	'Certificate ID': certificateId,
	'OICD Owner': repository.owner,
	'OICD Repo': repository.repo,
})) {
	console.debug(chalk.magenta(k), chalk.green(v))
}

new HostingApp(stackName, {
	repository,
	certificateId,
	domainName,
	region: process.env.AWS_REGION ?? 'eu-central-1',
})
