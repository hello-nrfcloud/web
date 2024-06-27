import type { Parameters } from '../../../src/context/Parameters.tsx'

export const generateRegistryResponse = (
	registry: Parameters,
): Parameters & {
	'@ts': string // e.g. '2024-03-06T14:42:12.690Z'
	'@version': 1
	'@context': 'https://github.com/hello-nrfcloud/public-parameter-registry-aws-js'
} => ({
	'@version': 1,
	'@ts': new Date().toISOString(),
	'@context':
		'https://github.com/hello-nrfcloud/public-parameter-registry-aws-js',
	...registry,
})
