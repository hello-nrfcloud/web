import { type Device } from '#context/Device.js'
import { SIMInfo } from '#components/deviceheader/SIMInfo.js'
import { BatteryInfo } from '#components/deviceheader/BatteryInfo.js'
import { NetworkModeInfo } from '#components/deviceheader/NetworkModeInfo.js'
import { EnvironmentInfo } from '#components/deviceheader/EnvironmentInfo.js'
import { SignalQualityInfo } from '#components/deviceheader/SignalQualityInfo.js'
import { DeviceID } from '#components/deviceheader/DeviceID.js'

export const DeviceHeader = ({ device }: { device: Device }) => (
	<header>
		<h1>
			<small
				class="text-muted"
				style={{ fontSize: '16px' }}
				data-testid="device-id"
			>
				Your device: <DeviceID device={device} />
			</small>
		</h1>
		<div class="mt-md-4">
			<div class="d-flex flex-wrap">
				<div class="me-4 mb-2 mb-lg-4" data-testid="device-header-networkmode">
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
				<div class="me-4 mb-2 mb-lg-4" data-testid="device-header-environment">
					<EnvironmentInfo />
				</div>
			</div>
		</div>
	</header>
)
