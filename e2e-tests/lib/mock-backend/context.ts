import type { DeviceIdentity } from '@hello.nrfcloud.com/proto/hello'
import type { Static } from '@sinclair/typebox'
import {
	type Collection,
	type Accessor,
	JSONCollection,
	StringAccessor,
} from './db.js'

type Device = Static<typeof DeviceIdentity> & { fingerprint: string }
type State = {
	reported: Record<string, any>
	desired: Record<string, any>
}

export const createContext = (
	baseDir: string,
): {
	devices: Collection<Device>
	release: Accessor<string>
	deviceState: Collection<State>
} => ({
	devices: JSONCollection<Device>(baseDir, 'devices'),
	release: StringAccessor(baseDir, 'release', '0.0.0-development'),
	deviceState: JSONCollection<State>(baseDir, 'deviceState'),
})
