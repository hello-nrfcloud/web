import { Ago } from '#components/Ago.js'
import { WaitingForData } from '#components/WaitingForData.js'
import { useDevice } from '#context/Device.js'
import { useSIMDetails } from '#context/SIMDetails.js'
import { formatDistance, formatFloat, formatInt } from '#utils/format.js'
import {
	BatteryFull,
	CloudOff,
	LightbulbIcon,
	RadioTower,
	ToggleRight,
} from 'lucide-preact'
import { SIMIcon } from './icons/SIMIcon.js'
import { LED, hexToRGB } from './LEDPattern.js'

export const ConnectDevice = () => {
	const {
		lastSeen,
		device,
		configuration: { reported: reportedConfig },
	} = useDevice()
	const { iccid, usage, issuer } = useSIMDetails()
	const successPattern = device?.model.ledPattern?.find(
		({ success }) => success === true,
	)

	return (
		<section class="mt-4">
			<h2>Waiting for data from your device</h2>
			<p>
				<WaitingForData />
				<br />
				<small class="text-muted">
					The update interval of your device is set to{' '}
					{formatDistance(
						reportedConfig?.updateIntervalSeconds ??
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
						<Ago
							date={lastSeen}
							key={lastSeen.toISOString()}
							strokeWidth={2}
							size={24}
						/>{' '}
						ago
					</span>
					<br />
					<small class="text-muted">
						was when the device has last sent data to the cloud
					</small>
				</p>
			)}
			<section id="troubleshooting" class="scroll-margin">
				<h2>
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
					Turn the kit on.
				</p>
				<p>
					<SIMIcon class="me-2" /> Insert a SIM card.
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
				{iccid !== undefined && (
					<>
						<section data-testid="sim-troubleshooting">
							<p>
								<RadioTower class="me-2" /> Sufficient data left on the SIM?
							</p>
							{usage === undefined && (
								<>
									<p>
										We could not automatically determine the amount of data
										available for your SIM.
									</p>
									{issuer !== undefined && (
										<p>
											Please contact <strong>{issuer.companyName}</strong> for
											details about your SIM.
										</p>
									)}
								</>
							)}
							{usage !== undefined && (
								<p>
									You have {formatInt(usage.availablePercent * 100)}&nbsp;% data
									left on your SIM card (
									{formatFloat(usage.availableBytes / 1000 / 1000)}
									&nbsp;MB).
								</p>
							)}
						</section>
					</>
				)}
				{successPattern !== undefined && (
					<section data-testid="success-led-pattern">
						<p>
							<LightbulbIcon
								class="me-2"
								data-testid="success-led-color"
								style={{ color: hexToRGB(successPattern.color) }}
							/>
							observe the LED pattern <em>{successPattern.description}</em>.
							<br />
							<span class="d-flex">
								<small>
									If this LED pattern is shown, it means that the device is
									connected to the cloud and sending data:
								</small>
								<LED
									pattern={successPattern}
									class="ms-2"
									data-testid="success-led-pattern-preview"
								/>
							</span>
						</p>
					</section>
				)}
			</section>
		</section>
	)
}
