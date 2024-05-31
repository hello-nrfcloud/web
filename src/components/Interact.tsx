import { Ago } from '#components/Ago.js'
import { useDevice } from '#context/Device.js'
import { isButtonPress, toButtonPress } from '#proto/lwm2m.js'
import { ChevronDownSquareIcon, CircleStop } from 'lucide-preact'

export const ButtonPresses = () => {
	const { reported } = useDevice()
	const buttonPress = Object.values(reported)
		.filter(isButtonPress)
		.map(toButtonPress)[0]

	return (
		<>
			<p class="d-flex">
				<CircleStop strokeWidth={1} class="me-2" />
				<span>
					<span>Press the button on your device to receive them here.</span>
					{buttonPress !== undefined &&
						Date.now() - buttonPress.ts < 60 * 1000 && (
							<span class="d-flex">
								<small class="d-flex hot" key={`button-${buttonPress.ts}`}>
									<ChevronDownSquareIcon strokeWidth={1} class="me-1" />
									<span>
										Button <strong>#{buttonPress.id}</strong> pressed
									</span>
								</small>
								<small class="text-muted ms-2">
									<Ago date={new Date(buttonPress.ts)} withSeconds />
								</small>
							</span>
						)}
				</span>
			</p>
		</>
	)
}
