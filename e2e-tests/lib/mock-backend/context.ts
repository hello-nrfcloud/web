import type { DeviceIdentity } from '@hello.nrfcloud.com/proto/hello'
import type { Static } from '@sinclair/typebox'

export const createContext = (): {
	devices: Array<Static<typeof DeviceIdentity> & { fingerprint: string }>
	release: string
} => {
	const devices: Array<
		Static<typeof DeviceIdentity> & { fingerprint: string }
	> = []
	// eslint-disable-next-line prefer-const
	let release = '0.0.0-development'
	return {
		devices,
		release,
	}
}
