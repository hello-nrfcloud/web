import { type Device } from '#context/Device.js'
import { useFingerprint } from '#context/Fingerprint.js'
import { Link2Icon } from 'lucide-preact'
import { SecondaryLink } from './Buttons.js'
import { SignalQualityIcon } from './SignalQuality.js'
import { Danger } from './buttons/Button.js'
import { NetworkModeIcon } from './deviceInfo/NetworkModeInfo.js'
import { EnvironmentInfo } from './model/PCA20035-solar/BME680.js'
import { BatteryInfo } from './model/PCA20035-solar/SolarThingyBattery.js'

export const DeviceHeader = ({ device }: { device: Device }) => {
	const { clear, fingerprint } = useFingerprint()
	const type = device.type

	return (
		<div class="container my-4">
			<header class="mt-4">
				<div class="row">
					<div class="col d-flex justify-content-between align-items-center">
						<h1>
							<span>Your development kit:</span>
							<strong class="ms-1">{type.title}</strong>
							<small class="text-muted ms-1">({type.model})</small>
						</h1>
						<div>
							<SecondaryLink
								class="me-2"
								href={`https://${DOMAIN_NAME}/${fingerprint}`}
								title="Use this link to share your device with someone else"
							>
								<Link2Icon />
							</SecondaryLink>
							<Danger
								outline
								onClick={() => {
									clear()
								}}
							>
								clear
							</Danger>
						</div>
					</div>
				</div>
				<div class="row mt-2">
					<div class="col-12 col-lg-2 mb-2">
						<small class="text-muted">
							Network mode
							<br />
						</small>
						<NetworkModeIcon />
					</div>
					<div class="col-12 col-lg-2 mb-2">
						<small class="text-muted">
							Signal Quality
							<br />
						</small>
						<SignalQualityIcon />
					</div>
					<div class="col-12 col-lg-3 mb-2">
						<small class="text-muted">
							Battery
							<br />
						</small>
						<BatteryInfo />
					</div>
					<div class="col-12 col-lg-5 mb-2">
						<small class="text-muted">
							Air Quality
							<br />
						</small>
						<EnvironmentInfo />
					</div>
				</div>
			</header>
		</div>
	)
}
