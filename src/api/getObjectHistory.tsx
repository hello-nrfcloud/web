import type { TimeSpan } from '#api/api.js'
import type { Device } from '#context/Device.js'
import { validatingFetch } from '#utils/validatingFetch.js'
import { LwM2MObjectHistory } from '@hello.nrfcloud.com/proto/hello'
import type { LwM2MObjectID } from '@hello.nrfcloud.com/proto-map/lwm2m'

export const getObjectHistory =
	(helloApiURL: URL, device: Device, fingerprint: string) =>
	(ObjectID: LwM2MObjectID, timeSpan: TimeSpan) =>
		validatingFetch(LwM2MObjectHistory)(
			new URL(
				`./device/${device.id}/history/${ObjectID}/0?${new URLSearchParams({
					fingerprint,
					timeSpan,
				}).toString()}`,
				helloApiURL,
			),
		)
