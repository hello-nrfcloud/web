import { Applied } from '#components/Applied.js'
import { Primary, Transparent } from '#components/Buttons.js'
import { useDevice } from '#context/Device.js'
import type { Model } from '#context/Models.js'
import { Thingy91XVisual } from '#model/PCA20065/Thingy91XVisual.js'
import { isLED, toLED } from '#proto/lwm2m.js'
import {
	LwM2MObjectID,
	type LwM2MObjectInstance,
	type RGBLED_14240,
} from '@hello.nrfcloud.com/proto-map/lwm2m'
import { noop } from 'lodash-es'
import { CircleStop, Lightbulb, X } from 'lucide-preact'
import { useState } from 'preact/hooks'

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
					ledColor={desiredLEDColor ?? reportedLEDColor}
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

						<p class="d-flex">
							<CircleStop strokeWidth={1} class="me-2" />
							<span>Press the button on your device to receive them here.</span>
						</p>
					</>
				)}
			</div>
		</div>
	)
}

export const ColorPicker = ({
	onColor,
	onClose,
}: {
	onColor: (color: { r: number; g: number; b: number }) => void
	onClose: () => void
}) => {
	const [selectedColor, setSelectedColor] = useState<string>('')

	const handleColorChange = (event: Event) => {
		const colorInput = event.target as HTMLInputElement
		setSelectedColor(colorInput.value)
	}

	return (
		<form onSubmit={noop}>
			<header class="d-flex justify-content-between align-items-start">
				<h3>Set LED color</h3>
				<Transparent onClick={onClose}>
					<X strokeWidth={1} />
				</Transparent>
			</header>

			<div class="d-flex justify-content-between align-items-center">
				<label for="colorPicker" class="form-label mb-0">
					Pick your color:
				</label>
				<input
					type="color"
					id="colorPicker"
					value={selectedColor}
					onInput={handleColorChange}
					style={{
						border: '0',
						height: '40px',
						width: '40px',
					}}
				/>
				<Primary
					onClick={() => {
						onColor(hexToRGB(selectedColor))
					}}
				>
					set
				</Primary>
			</div>
		</form>
	)
}

const hexToRGB = (hexColor: string): { r: number; g: number; b: number } => {
	const hex = hexColor.replace('#', '')
	const r = parseInt(hex.slice(0, 2), 16)
	const g = parseInt(hex.slice(2, 4), 16)
	const b = parseInt(hex.slice(4, 6), 16)
	return { r, g, b }
}
