import { isSSR } from '#utils/isSSR.js'

const fullKey = (key: string) => `hello:${key}`
export const getItem = <StoredType>(key: string): StoredType | null => {
	if (isSSR) {
		console.warn(
			`[LocalStorage]`,
			`getItem()`,
			key,
			`Not available in server-side mode`,
		)
		return null
	}
	const v = localStorage.getItem(fullKey(key))
	if (v === null) return v
	try {
		return JSON.parse(v) as StoredType
	} catch {
		console.error(
			`[LocalStorage]`,
			`failed to parse stored value ${v} for key ${fullKey(key)}`,
		)
		return null
	}
}

export const setItem = (key: string, value: unknown): void => {
	if (isSSR) {
		console.warn(
			`[LocalStorage]`,
			`setItem()`,
			key,
			`Not available in server-side mode`,
		)
		return
	}
	return localStorage.setItem(fullKey(key), JSON.stringify(value))
}

export const removeItem = (key: string): void => {
	if (isSSR) {
		console.warn(
			`[LocalStorage]`,
			`removeItem()`,
			key,
			`Not available in server-side mode`,
		)
		return
	}
	return localStorage.removeItem(fullKey(key))
}
