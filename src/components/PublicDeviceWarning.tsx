import { useMapShare } from '#context/MapShare.js'
import { AlertTriangleIcon } from 'lucide-preact'

export const PublicDeviceWarning = () => {
	const { shared } = useMapShare()

	if (shared === undefined) return null
	return (
		<div role="alert" class="bg-fall">
			<div class="container p-2 d-flex justify-content-between align-items-center">
				<span>
					<AlertTriangleIcon strokeWidth={1} class="me-1" />
					This device is publicly shared on{' '}
					<a href="/map">hello.nrfcloud.com/map</a>.
				</span>
				<a href="/share" class="btn btn-outline-secondary ms-2">
					manage sharing
				</a>
			</div>
		</div>
	)
}
