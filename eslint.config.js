import config from '@bifravst/eslint-config-typescript'
export default [
	...config,
	{
		ignores: [
			'.github/workflows/invalidate-cloudfront.ts',
			'cdk/fingerprint.js',
		],
	},
]
