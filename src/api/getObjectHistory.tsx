import type { TimeSpan } from '#api/api.js'
import type { Device } from '#context/Device.js'
import { validatingFetch } from '#utils/validatingFetch.js'
import type { LwM2MObjectID } from '@hello.nrfcloud.com/proto-map/lwm2m'
import { LwM2MObjectHistory } from '@hello.nrfcloud.com/proto/hello'

export const getObjectHistory =
	(helloApiURL: URL, device: Device, fingerprint: string) =>
	(
		ObjectID: LwM2MObjectID,
		timeSpan: TimeSpan,
		extraParams?: URLSearchParams,
	) =>
		validatingFetch(LwM2MObjectHistory)(
			new URL(
				`./device/${device.id}/history/${ObjectID}/0?${new URLSearchParams({
					fingerprint,
					timeSpan,
					...(extraParams !== undefined ? Object.fromEntries(extraParams) : {}),
				}).toString()}`,
				helloApiURL,
			),
		)
