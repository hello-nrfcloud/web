import { Ago } from '#components/Ago.js'
import { useDevice } from '#context/Device.js'
import { isButtonPress, toButtonPress } from '#proto/lwm2m.js'
import { ActivitySquareIcon, ChevronDownSquareIcon } from 'lucide-preact'

export const Interact = () => {
	const { reported } = useDevice()
	const buttonPress = Object.values(reported)
		.filter(isButtonPress)
		.map(toButtonPress)[0]

	return (
		<span class="d-flex flex-column">
			<small class="text-muted">
				<strong>Interact</strong>
			</small>
			{buttonPress === undefined && (
				<small class="d-flex">
					<ActivitySquareIcon class="me-1" />
					<span>Press the button on your device!</span>
				</small>
			)}
			{buttonPress !== undefined && (
				<>
					<small class="d-flex hot" key={`button-${buttonPress.ts}`}>
						<ChevronDownSquareIcon class="me-1" />
						<span>
							Button <strong>#{buttonPress.id}</strong> pressed
						</span>
					</small>
					<small class="text-muted">
						<Ago date={new Date(buttonPress.ts)} withSeconds />
					</small>
				</>
			)}
		</span>
	)
}
