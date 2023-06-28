import { DeviceHeader } from '#components/DeviceHeader.js'
import { WaitingForDevice } from '#components/WaitingForDevice.js'
import { WebsocketTerminal } from '#components/WebsocketTerminal.js'
import { NetworkInfo } from '#components/deviceInfo/NetworkInfo.js'
import { SoftwareInfo } from '#components/deviceInfo/SoftwareInfo.js'
import { BME680 } from '#components/model/PCA20035-solar/BME680.js'
import { SolarThingyBattery } from '#components/model/PCA20035-solar/SolarThingyBattery.js'
import { useAppSettings } from '#context/AppSettings.js'
import { WithCognitoCredentials } from '#context/CognitoCredentials.js'
import { useDevice } from '#context/Device.js'
import { Provider as SolarThingyHistoryProvider } from '#context/models/PCA20035-solar.js'
import { DeviceFlow } from '#flows/DeviceFlow.js'
import { Map } from '#map/Map.js'
import { styled } from 'styled-components'

const Grid = styled.div`
	@media (min-width: 992px) {
		display: grid;
		grid-template: auto auto / 1fr 1fr;
		grid-auto-flow: column;
	}
`

export const Device = () => {
	const { device } = useDevice()
	const { terminalVisible } = useAppSettings()

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
		<SolarThingyHistoryProvider>
			{terminalVisible && <WebsocketTerminal />}
			<main>
				<DeviceHeader device={device} />
				<Grid>
					<DeviceFlow device={device} />
					<WithCognitoCredentials>
						<Map />
					</WithCognitoCredentials>
				</Grid>
				<div class="container my-4">
					<div class="row mb-4">
						<section class="col-12 col-md-6">
							<NetworkInfo />
						</section>
						<section class="col-12 col-md-6">
							<SoftwareInfo device={device} />
							<SolarThingyBattery />
							<BME680 />
						</section>
					</div>
				</div>
			</main>
		</SolarThingyHistoryProvider>
	)
}
