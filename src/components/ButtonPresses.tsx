import { Ago } from '#components/Ago.js'
import { useDevice } from '#context/Device.js'
import { isButtonPress, toButtonPress } from '#proto/lwm2m.js'
import { ChevronDownSquareIcon } from 'lucide-preact'

import './ButtonPresses.css'

export const ButtonPresses = () => {
	const { reported } = useDevice()
	const buttonPress = Object.values(reported)
		.filter(isButtonPress)
		.map(toButtonPress)[0]

	if (buttonPress === undefined) return null
	if (Date.now() - buttonPress.ts.getTime() > 60 * 1000) return null

	return (
		<p class="d-flex justify-content-between">
			<small class="d-flex hot" key={`button-${buttonPress.ts.getTime()}`}>
				<ChevronDownSquareIcon strokeWidth={1} class="me-1" />
				<span data-testid="button-press">
					Button <strong>#{buttonPress.id}</strong> pressed
				</span>
			</small>
			<small class="text-muted ms-2">
				<Ago
					date={buttonPress.ts}
					key={buttonPress.ts.toISOString()}
					withSeconds
				/>
			</small>
		</p>
	)
}
