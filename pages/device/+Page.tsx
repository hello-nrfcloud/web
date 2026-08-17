import { Footer } from '#components/Footer.tsx'
import { Navbar } from '#components/Navbar.tsx'
import { WebsocketDisconnectNotifier } from '#components/WebsocketDisconnectNotifier.tsx'
import { Provider as DeviceProvider } from '#context/Device.tsx'
import { Provider as DeviceLocationProvider } from '#context/DeviceLocation.tsx'
import { Provider as FingerprintProvider } from '#context/Fingerprint.tsx'
import { Provider as HistoryChartProvider } from '#context/HistoryChart.tsx'
import { Provider as MapShareProvider } from '#context/MapShare.tsx'
import { Provider as MapStateProvider } from '#context/MapState.tsx'
import { Provider as ModelsProvider } from '#context/Models.tsx'
import { Provider as ParametersProvider } from '#context/Parameters.tsx'
import { Provider as SIMDetailsProvider } from '#context/SIMDetails.tsx'
import { Provider as SIMUsageHistoryProvider } from '#context/SIMUsageHistory.tsx'
import { Device } from '#page/Device.tsx'
import type { IndexPageProps } from '../index/+data.ts'

export const Page = ({ models }: IndexPageProps) => (
	<ParametersProvider>
		<FingerprintProvider>
			<ModelsProvider models={models}>
				<DeviceProvider>
					<SIMDetailsProvider>
						<HistoryChartProvider>
							<SIMUsageHistoryProvider>
								<DeviceLocationProvider>
									<MapShareProvider>
										<MapStateProvider>
											<Navbar />
											<WebsocketDisconnectNotifier />
											<Device />
											<Footer />
										</MapStateProvider>
									</MapShareProvider>
								</DeviceLocationProvider>
							</SIMUsageHistoryProvider>
						</HistoryChartProvider>
					</SIMDetailsProvider>
				</DeviceProvider>
			</ModelsProvider>
		</FingerprintProvider>
	</ParametersProvider>
)
