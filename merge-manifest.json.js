import { writeFileSync } from 'node:fs'
import buildManifest from './build/client/manifest.json' assert { type: 'json' }
import manifest from './manifest.json' assert { type: 'json' }

writeFileSync(
	'./build/client/manifest.json',
	JSON.stringify(Object.assign(manifest, buildManifest), null, 2),
	'utf-8',
)

console.log('./build/client/manifest.json updated')
