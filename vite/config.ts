import { defineConfig, type PluginOption } from 'vite'
import { preact } from '@preact/preset-vite'
import ssr from 'vike/plugin'
import { homepage, version } from './siteInfo.js'
import { dependencies } from '../package.json'

export const createConfig = ({
	registryEndpoint,
	sentryDSN,
	domainName,
	baseURL,
	plugins,
}: {
	registryEndpoint: URL
	sentryDSN?: string
	baseURL: string
	domainName: string
	plugins?: PluginOption[]
}): ReturnType<typeof defineConfig> => {
	const define = {
		HOMEPAGE: JSON.stringify(homepage),
		VERSION: JSON.stringify(version),
		BUILD_TIME: JSON.stringify(new Date().toISOString()),
		REGISTRY_ENDPOINT: JSON.stringify(registryEndpoint),
		DOMAIN_NAME: JSON.stringify(domainName),
		SENTRY_DSN: JSON.stringify(sentryDSN),
		PROTO_MAP_VERSION: JSON.stringify(
			dependencies['@hello.nrfcloud.com/proto-map'],
		),
	}
	for (const [k, v] of Object.entries(define)) {
		console.debug(`[vite define] ${k}:`, v)
	}

	return defineConfig({
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
			...(plugins ?? []),
		],
		base: `${baseURL.replace(/\/+$/, '')}/`,
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
				{ find: '#content/', replacement: '/content/' },
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
		define,
	})
}
