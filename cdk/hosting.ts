import { IAMClient } from '@aws-sdk/client-iam'
import chalk from 'chalk'
import pJSON from '../package.json'
import { HostingApp } from './HostingApp.js'
import { ensureGitHubOIDCProvider } from './ensureGitHubOIDCProvider.js'

const iam = new IAMClient({})

const stackName = process.env.STACK_NAME ?? 'hello-nrfcloud-web'
const certificateId =
	process.env.CERTIFICATE_ID ?? 'b4faa8c2-7e5e-4f5a-8e34-b227d0d8ef67'
const domainName = process.env.DOMAIN_NAME ?? 'hello.nrfcloud.com'

const repoUrl = new URL(pJSON.repository.url)
const repository = {
	owner: repoUrl.pathname.split('/')[1] ?? 'hello-nrfcloud',
	repo: repoUrl.pathname.split('/')[2]?.replace(/\.git$/, '') ?? 'web',
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
	customDomain:
		domainName !== undefined && certificateId !== undefined
			? { certificateId, domainName }
			: undefined,
	region: process.env.AWS_REGION ?? 'eu-west-1',
	gitHubOICDProviderArn: await ensureGitHubOIDCProvider({
		iam,
	}),
})
