import { Applied } from '#components/Applied.js'
import { useDevice } from '#context/Device.js'
import type { Model } from '#context/Models.js'
import { Thingy91XVisual } from '#model/PCA20065/Thingy91XVisual.js'
import { isLED, toLED } from '#proto/lwm2m.js'
import {
	LwM2MObjectID,
	type LwM2MObjectInstance,
	type RGBLED_14240,
} from '@hello.nrfcloud.com/proto-map/lwm2m'
import { Lightbulb } from 'lucide-preact'
import { useState } from 'preact/hooks'
import { ColorPicker } from '../../components/colorpicker/ColorPicker.js'
import { ButtonPresses } from '#components/Interact.js'

export const Card = ({ model }: { model: Model }) => {
	const [ledColorPickerVisible, showLEDColorPicker] = useState<boolean>(false)
	const { reported, desired, update } = useDevice()
	const reportedLEDColor = Object.values(reported).filter(isLED).map(toLED)[0]
	const desiredLEDColor = Object.values(desired).filter(isLED).map(toLED)[0]

	return (
		<div class="card">
			<div class="card-header">
				<h2>{model.title}</h2>
				<p class="mb-1">{model.tagline}</p>
				<p class="mb-0">
					<code class="text-muted">
						<a href={`/model/${encodeURIComponent(model.name)}`}>
							{model.name}
						</a>
						{model.variant !== undefined && (
							<span>
								{' '}
								(<code>{model.variant}</code>)
							</span>
						)}
					</code>
				</p>
			</div>

			<div class="d-flex justify-content-center">
				<Thingy91XVisual
					title={`${model.title} (${model.name})`}
					ledColor={reportedLEDColor}
					style={{ maxWidth: '250px' }}
					onLEDClick={() => showLEDColorPicker(true)}
					showLEDHint={!ledColorPickerVisible && desiredLEDColor === undefined}
				/>
			</div>

			<div class="card-body">
				{ledColorPickerVisible && (
					<ColorPicker
						onColor={(color) => {
							showLEDColorPicker(false)
							const instance: LwM2MObjectInstance<RGBLED_14240> = {
								ObjectID: LwM2MObjectID.RGBLED_14240,
								ObjectInstanceID: 0,
								ObjectVersion: '1.0',
								Resources: {
									0: color.r,
									1: color.g,
									2: color.b,
									99: Date.now(),
								},
							}
							update(instance).catch(console.error)
						}}
						onClose={() => {
							showLEDColorPicker(false)
						}}
						color={desiredLEDColor}
					/>
				)}
				{!ledColorPickerVisible && (
					<>
						<h3>Interact with your device</h3>
						<p class="d-flex">
							<Lightbulb strokeWidth={1} class="me-2" />
							<span>
								Click the LED above to change the color on your device.
								{desiredLEDColor !== undefined && (
									<span>
										<br />
										<Applied
											desired={desiredLEDColor}
											reported={reportedLEDColor}
										/>
									</span>
								)}
							</span>
						</p>
						<ButtonPresses />
					</>
				)}
			</div>
		</div>
	)
}
