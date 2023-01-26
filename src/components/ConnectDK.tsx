import type { Device } from '@context/Device'
import { HelpCircle, PlugZap, Sun, ToggleRight } from 'lucide-preact'
import styled from 'styled-components'
import { SIMIcon } from './icons/SIMIcon'

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

export const ConnectDK = ({ device }: { device: Device }) => {
	return (
		<>
			<h2>
				Getting started with your <strong>{device.type.title}</strong>:
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
						<HelpCircle strokeWidth={1} />
						No success?
						<br />
						<a href="/troubleshooting.html" class="btn btn-warning mt-2">
							Follow our troubleshooting guide
						</a>
					</li>
				</StepsWithIcons>
			</section>
		</>
	)
}
