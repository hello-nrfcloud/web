import { BatteryInfo } from '#components/deviceheader/BatteryInfo.js'
import { EnvironmentInfo } from '#components/deviceheader/EnvironmentInfo.js'
import { NetworkModeInfo } from '#components/deviceheader/NetworkModeInfo.js'
import { SignalQualityInfo } from '#components/deviceheader/SignalQualityInfo.js'
import { SIMInfo } from '#components/deviceheader/SIMInfo.js'
import { useDevice } from '#context/Device.js'

export const DeviceHeader = () => {
	const { device, imei } = useDevice()
	if (device === undefined) return null
	return (
		<header>
			<h1>
				<small
					class="text-muted"
					style={{ fontSize: '16px' }}
					data-testid="device-id"
				>
					Your device: <span>{imei ?? device.id}</span>
				</small>
			</h1>
			<div class="mt-md-4">
				<div class="d-flex flex-wrap">
					<div
						class="me-4 mb-2 mb-lg-4"
						data-testid="device-header-networkmode"
					>
						<NetworkModeInfo />
					</div>
					<div
						class="me-4 mb-2 mb-lg-4"
						data-testid="device-header-signalquality"
					>
						<SignalQualityInfo />
					</div>
					<div class="me-4 mb-2 mb-lg-4" data-testid="device-header-sim">
						<SIMInfo />
					</div>
					<div class="me-4 mb-2 mb-lg-4" data-testid="device-header-battery">
						<BatteryInfo />
					</div>
					<div
						class="me-4 mb-2 mb-lg-4"
						data-testid="device-header-environment"
					>
						<EnvironmentInfo />
					</div>
				</div>
			</div>
		</header>
	)
}
