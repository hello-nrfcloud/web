import { useMapShare } from '#context/MapShare.js'
import { publicDeviceURL } from '#map/publicDeviceLink.js'
import { AlertTriangleIcon } from 'lucide-preact'

export const PublicDeviceWarning = () => {
	const { shared } = useMapShare()

	if (shared === undefined) return null
	return (
		<div role="alert" class="bg-fall">
			<div class="container p-2 d-flex justify-content-between align-items-center">
				<span class="d-flex align-items-center">
					<AlertTriangleIcon strokeWidth={1} class="me-1" />
					<span>
						This device is publicly shared on{' '}
						<a href={publicDeviceURL(shared).toString()} target={'_blank'}>
							{`${publicDeviceURL(shared).host}${publicDeviceURL(shared).pathname}`}
						</a>
						.
					</span>
				</span>
				<a
					href={`https://hello.nrfcloud.com/map/dashboard/#device?${new URLSearchParams({ id: shared.id }).toString()}`}
					class="btn btn-outline-secondary ms-2"
				>
					Review sharing settings
				</a>
			</div>
		</div>
	)
}
