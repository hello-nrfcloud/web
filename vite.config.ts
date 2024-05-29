import { fromEnv } from '@nordicsemiconductor/from-env'
import { preact } from '@preact/preset-vite'
import chalk from 'chalk'
import { defineConfig } from 'vite'
import ssr from 'vike/plugin'
import { homepage, version } from './siteInfo.js'
import { dependencies } from './package.json'

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

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		preact({
			babel: {
				plugins: ['@babel/plugin-syntax-import-assertions'],
			},
		}),
		ssr({
			prerender: true,
			includeAssetsImportedByServer: true,
		}),
	],
	base: `${(process.env.BASE_URL ?? '').replace(/\/+$/, '')}/`,
	preview: {
		host: 'localhost',
		port: 8080,
	},
	server: {
		host: 'localhost',
		port: 8080,
	},
	resolve: {
		alias: [
			{ find: '#components/', replacement: '/src/components/' },
			{ find: '#context/', replacement: '/src/context/' },
			{ find: '#utils/', replacement: '/src/utils/' },
			{ find: '#flows/', replacement: '/src/flows/' },
			{ find: '#chart/', replacement: '/src/chart/' },
			{ find: '#page/', replacement: '/src/page/' },
			{ find: '#map/', replacement: '/src/map/' },
			{ find: '#model/', replacement: '/src/model/' },
			{ find: '#proto/', replacement: '/src/proto/' },
			{ find: '#api/', replacement: '/src/api/' },
		],
	},
	build: {
		outDir: './build',
		sourcemap: true,
	},
	esbuild: {
		logOverride: { 'this-is-undefined-in-esm': 'silent' },
	},
	// string values will be used as raw expressions, so if defining a string constant, it needs to be explicitly quoted
	define: {
		HOMEPAGE: JSON.stringify(homepage),
		VERSION: JSON.stringify(version),
		BUILD_TIME: JSON.stringify(new Date().toISOString()),
		REGISTRY_ENDPOINT: JSON.stringify(registryEndpoint),
		DOMAIN_NAME: JSON.stringify(
			process.env.DOMAIN_NAME ?? 'hello.nrfcloud.com',
		),
		SENTRY_DSN: JSON.stringify(sentryDSN),
		PROTO_MAP_VERSION: JSON.stringify(
			dependencies['@hello.nrfcloud.com/proto-map'],
		),
	},
})
