import type { DeviceIdentity } from '@hello.nrfcloud.com/proto/hello'
import type { Static } from '@sinclair/typebox'
import {
	type Accessor,
	type Collection,
	JSONCollection,
	StringAccessor,
} from './db.js'

type Device = Static<typeof DeviceIdentity> & { fingerprint: string }
type State = {
	reported: Record<string, any>
	desired: Record<string, any>
}

export type SIMUsage = {
	timestamp: string // e.g. '2024-07-01T10:53:16.790Z'
	usedBytes: number // e.g. 	0
	totalBytes: number // e.g. 	10000000
}

export const createContext = (
	baseDir: string,
): {
	devices: Collection<Device>
	release: Accessor<string>
	deviceState: Collection<State>
	simDetails: Collection<SIMUsage>
} => ({
	devices: JSONCollection<Device>(baseDir, 'devices'),
	release: StringAccessor(baseDir, 'release', '0.0.0-development'),
	deviceState: JSONCollection<State>(baseDir, 'deviceState'),
	simDetails: JSONCollection<SIMUsage>(baseDir, 'simDetails'),
})
