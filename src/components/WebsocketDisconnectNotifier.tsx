import { useDevice } from '#context/Device.js'
import { ZapOff } from 'lucide-preact'

export const WebsocketDisconnectNotifier = () => {
	const { disconnected } = useDevice()
	if (!disconnected) return null
	return (
		<div role="alert" class="bg-sun">
			<div class="container py-2  d-flex justify-content-between align-items-center">
				<span>
					<ZapOff strokeWidth={1} class="me-2" />
					<span class="me-2">
						The websocket connection was terminated automatically after 2 hours.
					</span>
				</span>
				<a href="./" class="btn btn-outline-secondary ms-2">
					reload
				</a>
			</div>
		</div>
	)
}
