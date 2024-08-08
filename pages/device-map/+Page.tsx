import { WebsocketDisconnectNotifier } from '#components/WebsocketDisconnectNotifier.js'
import { Provider as DeviceProvider } from '#context/Device.js'
import { Provider as DeviceLocationProvider } from '#context/DeviceLocation.js'
import { Provider as FingerprintProvider } from '#context/Fingerprint.js'
import { Provider as MapStateProvider } from '#context/MapState.js'
import { Provider as ModelsProvider } from '#context/Models.js'
import { Provider as ParametersProvider } from '#context/Parameters.js'
import { DeviceMap } from '#page/DeviceMap.js'
import type { IndexPageProps } from '../index/+data.js'

export const Page = ({ models }: IndexPageProps) => (
	<ParametersProvider>
		<FingerprintProvider>
			<ModelsProvider models={models}>
				<DeviceProvider>
					<DeviceLocationProvider>
						<MapStateProvider>
							<WebsocketDisconnectNotifier />
							<DeviceMap />
						</MapStateProvider>
					</DeviceLocationProvider>
				</DeviceProvider>
			</ModelsProvider>
		</FingerprintProvider>
	</ParametersProvider>
)
