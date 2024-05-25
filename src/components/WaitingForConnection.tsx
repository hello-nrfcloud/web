import { ConnectDevice } from '#components/ConnectDevice.js'
import { type Device as TDevice } from '#context/Device.js'
import { useLwM2MHistory } from '#context/LwM2MHistory.js'

export const WaitingForConnection = ({ device }: { device: TDevice }) => {
	const { battery } = useLwM2MHistory()

	const currentBattery = battery.filter(
		({ fromHistory }) => fromHistory !== true,
	)

	const hasLiveData = currentBattery.length > 0

	if (hasLiveData) return null

	return (
		<div class="py-4 bg-light">
			<div class="container">
				<div class="row">
					<div class="col-12">
						<ConnectDevice device={device} />
					</div>
				</div>
			</div>
		</div>
	)
}
