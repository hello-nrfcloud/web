import { Primary, Transparent } from '#components/Buttons.js'
import { noop } from 'lodash-es'
import { X } from 'lucide-preact'
import { useState } from 'preact/hooks'
import { hexToRGB } from '#components/colorpicker/hexToRGB.js'
import { RGBtoHEX } from '#components/colorpicker/RGBtoHEX.js'

export type RGB = { r: number; g: number; b: number }

export const ColorPicker = ({
	color,
	onColor,
	onClose,
}: {
	color?: RGB
	onColor: (color: RGB) => void
	onClose: () => void
}) => {
	const [selectedColor, setSelectedColor] = useState<string>(
		RGBtoHEX(color ?? { r: 0, g: 0, b: 0 }),
	)

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
