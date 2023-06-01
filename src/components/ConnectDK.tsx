import { useCode } from '@context/Code.js'
import { WaitingForData } from '@flows/WaitingForData.js'
import { HelpCircle, PlugZap, Sun, ToggleRight } from 'lucide-preact'
import { styled } from 'styled-components'
import { SecondaryButton } from './StyleGuide.js'
import { SIMIcon } from './icons/SIMIcon.js'

const StepsWithIcons = styled.ol`
	text-align: center;
	list-style: none;
	padding: 0;
	svg {
		width: 48px;
		height: 48px;
	}
	li {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-bottom: 1rem;
	}
`

export const ConnectDK = () => {
	const { clear } = useCode()
	return (
		<>
			<h2>
				Please follow these stops to start retrieving real-time data from your
				kit:
			</h2>
			<section class="mt-4 mb-4">
				<StepsWithIcons>
					<li>
						<SIMIcon /> Insert the SIM card
					</li>
					<li>
						<PlugZap strokeWidth={1} />
						Plug into a USB power source
					</li>
					<li>
						<ToggleRight strokeWidth={1} />
						Turn on
					</li>
					<li>
						<Sun strokeWidth={2} color="var(--color-nordic-power)" />
						Wait for the LED to turn solid green
					</li>
					<li>
						<WaitingForData />
					</li>
					<li>
						<HelpCircle strokeWidth={1} />
						No success?
						<br />
						<span class="mt-2">
							<SecondaryButton
								class="me-2"
								onClick={() => {
									clear()
								}}
							>
								cancel
							</SecondaryButton>
							<a href="/troubleshooting" class="btn btn-warning">
								Follow our troubleshooting guide
							</a>
						</span>
					</li>
				</StepsWithIcons>
			</section>
		</>
	)
}
