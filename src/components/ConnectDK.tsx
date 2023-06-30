import { useFingerprint } from '#context/Fingerprint.js'
import { WaitingForData } from '#flows/WaitingForData.js'
import { BatteryFull, HelpCircle, Sun, ToggleRight } from 'lucide-preact'
import './ConnectDK.css'
import { Secondary } from './buttons/Button.js'
import { WarningLink } from './buttons/ButtonlikeLink.js'
import { SIMIcon } from './icons/SIMIcon.js'

export const ConnectDK = () => {
	const { clear } = useFingerprint()
	return (
		<>
			<h2>
				Please follow these stops to start retrieving real-time data from your
				kit:
			</h2>
			<section class="mt-4 mb-4">
				<ol class="StepsWithIcons">
					<li>
						<SIMIcon /> Insert the SIM card
					</li>
					<li>
						<BatteryFull />
						Make sure the battery is charged
					</li>
					<li>
						<ToggleRight />
						Turn the kit on
					</li>
					<li>
						<Sun strokeWidth={2} color="var(--color-nordic-power)" />
						Wait for the LED to turn solid green
					</li>
					<li>
						<WaitingForData />
						<br />
						<small class="text-muted">
							Your device should send data to the cloud every 60 seconds.
						</small>
					</li>
					<li>
						<HelpCircle />
						No success?
						<br />
						<span class="mt-4">
							<Secondary
								class="me-2"
								onClick={() => {
									clear()
								}}
							>
								cancel
							</Secondary>
							<WarningLink href="/troubleshooting">
								Follow our troubleshooting guide
							</WarningLink>
						</span>
					</li>
				</ol>
			</section>
		</>
	)
}
