import { Ago } from '#components/Ago.js'
import { WaitingForData } from '#components/WaitingForData.js'
import { useDevice } from '#context/Device.js'
import { BatteryFull, CloudOff, RadioTower, ToggleRight } from 'lucide-preact'
import { SIMIcon } from './icons/SIMIcon.js'
import { formatDistance } from '#utils/format.js'

export const ConnectDevice = () => {
	const {
		lastSeen,
		device,
		configuration: { reported },
	} = useDevice()

	return (
		<section class="mt-4">
			<h2>Waiting for data from your device</h2>
			<p>
				<WaitingForData />
				<br />
				<small class="text-muted">
					The update interval of your device is set to{' '}
					{formatDistance(
						reported?.updateIntervalSeconds ??
							device?.model.defaultConfiguration.updateIntervalSeconds ??
							60,
					)}
					.
				</small>
			</p>
			{lastSeen === undefined && (
				<p>
					<CloudOff /> The device has not yet connected to the cloud.
				</p>
			)}
			{lastSeen !== undefined && (
				<p>
					<span>
						<Ago date={lastSeen} strokeWidth={2} size={24} /> ago
					</span>
					<br />
					<small class="text-muted">
						was when the device has last sent data to the cloud
					</small>
				</p>
			)}
			<h2 id="troubleshooting" class="scroll-margin">
				Please follow these steps to start retrieving real-time data from your
				kit:
			</h2>
			<p>
				<BatteryFull class="me-2" />
				Make sure the battery is charged.
				<br />
				<small>
					To be safe, you can plug the device in using a micro USB cable.
				</small>
			</p>
			<p>
				<ToggleRight class="me-2" />
				Turn the kit on
			</p>
			<p>
				<SIMIcon class="me-2" /> Insert a SIM card
			</p>
			{(device?.model.includedSIMs?.length ?? 0) > 1 && (
				<p>
					<small>
						This model comes with {device?.model.includedSIMs?.length}{' '}
						<strong>pre-activated</strong> SIM cards. You can choose which one
						to use.
					</small>
				</p>
			)}
			<p>
				<RadioTower class="me-2" /> Sufficient data left on the SIM?
			</p>
		</section>
	)
}
