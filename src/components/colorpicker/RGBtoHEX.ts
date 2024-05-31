import type { RGB } from '#components/colorpicker/ColorPicker.js'

export const RGBtoHEX = ({ r, g, b }: RGB): string => {
	const hexR = r.toString(16).padStart(2, '0')
	const hexG = g.toString(16).padStart(2, '0')
	const hexB = b.toString(16).padStart(2, '0')
	return `#${hexR}${hexG}${hexB}`
}
