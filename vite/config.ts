import { preact } from '@preact/preset-vite'
import ssr from 'vike/plugin'
import { defineConfig, type PluginOption } from 'vite'
import pJSON from '../package.json' with { type: 'json' }
import { encloseWithSlash } from './encloseWithSlash.ts'
import { homepage, version } from './siteInfo.ts'

export const createConfig = ({
	registryEndpoint,
	sentryDSN,
	domainName,
	baseURL,
	plugins,
	mapRegion,
	mapApiKey,
}: {
	registryEndpoint: URL
	sentryDSN?: string
	baseURL: string
	domainName: string
	plugins?: PluginOption[]
	mapRegion: string
	mapApiKey: string
}): ReturnType<typeof defineConfig> => {
	const define = {
		HOMEPAGE: JSON.stringify(homepage),
		VERSION: JSON.stringify(version),
		BUILD_TIME: JSON.stringify(new Date().toISOString()),
		REGISTRY_ENDPOINT: JSON.stringify(registryEndpoint),
		DOMAIN_NAME: JSON.stringify(domainName),
		SENTRY_DSN: JSON.stringify(sentryDSN),
		PROTO_MAP_VERSION: JSON.stringify(
			pJSON.dependencies['@hello.nrfcloud.com/proto-map'],
		),
		MAP_REGION: JSON.stringify(mapRegion),
		MAP_API_KEY: JSON.stringify(mapApiKey),
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
			// Vike settings are defined in pages/+config.ts
			ssr(),
			...(plugins ?? []),
		],
		base: encloseWithSlash(baseURL),
		preview: {
			host: 'localhost',
			port: 8080,
		},
		server: {
			host: 'localhost',
			port: 8080,
		},
		optimizeDeps: {
			exclude: ['maplibre-gl'],
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
			emptyOutDir: true,
			sourcemap: true,
		},
		esbuild: {
			logOverride: { 'this-is-undefined-in-esm': 'silent' },
		},
		// string values will be used as raw expressions, so if defining a string constant, it needs to be explicitly quoted
		define,
	})
}
