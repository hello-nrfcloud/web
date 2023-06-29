import { compareVersions } from 'compare-versions'
import { parse } from 'semver'

export const isOutdated = (
	expectedVersion: string,
	actualVersion?: string,
): boolean => {
	try {
		return (
			compareVersions(
				clean(expectedVersion),
				clean(actualVersion ?? '0.0.0'),
			) === 1
		)
	} catch {
		return true
	}
}

const clean = (version: string): string => {
	const parsed = parse(version)
	return `${parsed?.major ?? 0}.${parsed?.minor ?? 0}.${parsed?.patch ?? 0}`
}
