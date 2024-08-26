import { Transparent } from '#components/Buttons.js'
import { hexToRGB } from '#components/colorpicker/hexToRGB.js'
import { noop } from 'lodash-es'
import { X } from 'lucide-preact'

export type RGB = { r: number; g: number; b: number }

const colors = [
	0x000000, 0xff0000, 0xffa500, 0xffff00, 0x00ff00, 0x00ffff, 0xff00ff,
]

export const ColorPicker = ({
	onColor,
	onClose,
}: {
	onColor: (color: RGB) => void
	onClose: () => void
}) => (
	<form onSubmit={noop}>
		<header class="d-flex justify-content-between align-items-start">
			<h3>Set LED color</h3>
			<Transparent onClick={onClose}>
				<X strokeWidth={1} />
			</Transparent>
		</header>

		<div
			style={{
				display: 'grid',
				gridAutoRows: 'auto',
				gridGap: '0.5rem',
				gridTemplateColumns: 'repeat(auto-fit, minmax(40px, 1fr))',
			}}
		>
			{colors.map((color) => (
				<ColorButton
					color={color}
					onClick={() => {
						console.log(hexToRGB(toHex(color)))
						onColor(hexToRGB(toHex(color)))
						onClose()
					}}
				/>
			))}
		</div>
	</form>
)

const ColorButton = ({
	color,
	onClick,
}: {
	color: number
	onClick: () => void
}) => {
	const isOff = color === 0
	return (
		<button
			type="button"
			onClick={onClick}
			style={{
				backgroundColor: isOff ? '#868686' : `#${toHex(color)}`,
				height: 'auto',
				width: '100%',
				aspectRatio: '1/1',
				borderRadius: '100%',
				border: '1px solid #ccc',
			}}
		>
			{isOff ? <span style={{ color: 'white' }}>Auto</span> : ''}
		</button>
	)
}

const toHex = (c: number) => c.toString(16).padStart(6, '0')
