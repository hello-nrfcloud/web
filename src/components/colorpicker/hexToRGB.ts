import type { RGB } from '#components/colorpicker/ColorPicker.js'

export const hexToRGB = (hexColor: string): RGB => {
	const hex = hexColor.replace('#', '')
	const r = parseInt(hex.slice(0, 2), 16)
	const g = parseInt(hex.slice(2, 4), 16)
	const b = parseInt(hex.slice(4, 6), 16)
	return { r, g, b }
}
