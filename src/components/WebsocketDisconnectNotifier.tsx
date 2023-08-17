import { useDevice } from '#context/Device.js'
import { ZapOff } from 'lucide-preact'

export const WebsocketDisconnectNotifier = () => {
	const { disconnected } = useDevice()
	if (!disconnected) return null
	return (
		<div role="alert" class="bg-fall">
			<div class="container py-2 d-flex align-items-center">
				<ZapOff strokeWidth={1} class="me-2" />
				<span class="me-2">
					The websocket connection was terminated automatically after 2 hours.
				</span>
				<a href="/device">Click here to reload.</a>
			</div>
		</div>
	)
}
