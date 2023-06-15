import { SelectedDK } from '#components/SelectedDK.js'
import { WaitingForDevice } from '#components/WaitingForDevice.js'
import { WebsocketTerminal } from '#components/WebsocketTerminal.js'
import { WithCognitoCredentials } from '#context/CognitoCredentials.js'
import { useDevice } from '#context/Device.js'
import { DeviceFlow } from '#flows/DeviceFlow.js'
import { Map } from '#map/Map.js'

export const Device = () => {
	const { device } = useDevice()

	if (device === undefined)
		return (
			<div class="container">
				<div class="row">
					<div class="col my-4">
						<WaitingForDevice />
					</div>
				</div>
			</div>
		)

	return (
		<>
			<WebsocketTerminal />
			<aside class="container">
				<div class="row">
					<div class="col my-4">
						<SelectedDK selected={device.type} />
					</div>
				</div>
			</aside>
			<main>
				<DeviceFlow device={device} />
				<WithCognitoCredentials>
					<Map />
				</WithCognitoCredentials>
			</main>
		</>
	)
}
