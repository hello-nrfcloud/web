import { useDevice } from '#context/Device.js'
import { useSIMDetails } from '#context/SIMDetails.js'
import { formatFloat, formatInt } from '#utils/format.js'
import {
	BatteryFull,
	LightbulbIcon,
	RadioTower,
	ToggleRight,
} from 'lucide-preact'
import { Collapsible } from './Collapsible.js'
import { SIMIcon } from './icons/SIMIcon.js'
import { LED, LEDPattern, hexToRGB } from './LEDPattern.js'

export const Troubleshooting = ({ class: className }: { class?: string }) => {
	const { device } = useDevice()
	const { iccid, usage, issuer } = useSIMDetails()
	const successPattern = device?.model.ledPattern?.find(
		({ success }) => success === true,
	)

	return (
		<div id="troubleshooting" class={`scroll-margin ${className ?? ''}`}>
			<div class="row">
				<div class="col-md-8">
					<h2>
						Please follow these steps to start retrieving real-time data from
						your kit:
					</h2>
					<p>
						<BatteryFull class="me-2" />
						Make sure the battery is charged.
						<br />
						<small>
							To be safe, you can plug the device in using a USB-C cable.
						</small>
					</p>
				</div>
			</div>
			<div class="row">
				<div class="col-md-8">
					<p>
						<SIMIcon class="me-2" /> Insert a SIM card.
					</p>
					{(device?.model.includedSIMs?.length ?? 0) > 1 && (
						<p>
							<small>
								This model comes with {device?.model.includedSIMs?.length}{' '}
								<strong>pre-activated</strong> SIM cards. You can choose which
								one to use.
							</small>
						</p>
					)}
				</div>
				{iccid !== undefined && (
					<>
						<div data-testid="sim-troubleshooting">
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
						</div>
					</>
				)}
			</div>
			<div class="row">
				<div class="col-md-8">
					<p>
						<ToggleRight class="me-2" />
						Turn the kit on.
					</p>
				</div>
			</div>
			<div class="row">
				<div class="col-md-8">
					{successPattern !== undefined && (
						<div data-testid="success-led-pattern">
							<p>
								<LightbulbIcon
									class="me-2"
									data-testid="success-led-color"
									style={{ color: hexToRGB(successPattern.color) }}
								/>
								observe the LED pattern <em>{successPattern.description}</em>.
								<br />
								<span class="d-flex mt-1">
									<LED
										pattern={successPattern}
										class="ms-1 me-2 flex-shrink-0"
										data-testid="success-led-pattern-preview"
										highlight
									/>
									<small>
										If this LED pattern is shown, it means that the device is
										connected to the cloud and sending data.
									</small>
								</span>
							</p>
						</div>
					)}
				</div>
				{device?.model.ledPattern !== undefined && (
					<div class="col-md-4">
						<div class="card p-3 mb-4">
							<Collapsible title={<h3>LED Pattern reference</h3>}>
								<LEDPattern ledPattern={device?.model.ledPattern} />
							</Collapsible>
						</div>
					</div>
				)}
			</div>
		</div>
	)
}
