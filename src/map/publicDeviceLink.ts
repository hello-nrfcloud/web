import type { PublicDevice } from '@hello.nrfcloud.com/proto/hello/map'
import type { Static } from '@sinclair/typebox'

export const publicDeviceURL = (device: Static<typeof PublicDevice>): URL =>
	new URL(
		`https://hello.nrfcloud.com/map#${encodeURIComponent(`id:${device.id}`)}`,
	)
