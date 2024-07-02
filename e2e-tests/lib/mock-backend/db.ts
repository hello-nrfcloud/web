import {
	mkdirSync,
	readFileSync,
	readdirSync,
	statSync,
	writeFileSync,
} from 'node:fs'
import { join } from 'node:path'

export type Accessor<T> = {
	get: () => T
	set: (v: T) => void
}
export type Collection<T> = {
	get: (key: string) => T | undefined
	set: (key: string, v: T) => void
	all: () => Array<T>
}
export const StringAccessor = (
	baseDir: string,
	name: string,
	defaultValue?: string,
): Accessor<string> => {
	const storage = join(baseDir, `${name}.txt`)
	return {
		get: () => {
			try {
				return readFileSync(storage, 'utf8')
			} catch (e) {
				return defaultValue ?? ''
			}
		},
		set: (v: string) => {
			writeFileSync(storage, v)
		},
	}
}
export const JSONCollection = <T extends Record<string, any>>(
	baseDir: string,
	name: string,
): Collection<T> => {
	const storageDir = join(baseDir, name)
	return {
		get: (id) => {
			try {
				return JSON.parse(readFileSync(join(storageDir, `${id}.json`), 'utf8'))
			} catch (e) {
				return undefined
			}
		},
		set: (id, v) => {
			try {
				statSync(storageDir)
			} catch {
				mkdirSync(storageDir, { recursive: true })
			}
			writeFileSync(join(storageDir, `${id}.json`), JSON.stringify(v))
		},
		all: () => {
			try {
				return readdirSync(storageDir).map((f) =>
					JSON.parse(readFileSync(join(storageDir, f), 'utf8')),
				)
			} catch {
				return []
			}
		},
	}
}
