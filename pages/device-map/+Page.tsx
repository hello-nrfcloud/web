import { WebsocketDisconnectNotifier } from '#components/WebsocketDisconnectNotifier.tsx'
import { Provider as DeviceProvider } from '#context/Device.tsx'
import { Provider as DeviceLocationProvider } from '#context/DeviceLocation.tsx'
import { Provider as FingerprintProvider } from '#context/Fingerprint.tsx'
import { Provider as MapStateProvider } from '#context/MapState.tsx'
import { Provider as ModelsProvider } from '#context/Models.tsx'
import { Provider as ParametersProvider } from '#context/Parameters.tsx'
import { DeviceMap } from '#page/DeviceMap.tsx'
import type { IndexPageProps } from '../index/+data.ts'

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
