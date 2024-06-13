import { isObject } from 'lodash-es'
import type { RGB } from './ColorPicker.js'

export const isRGB = (color: unknown): color is RGB =>
	isObject(color) &&
	'r' in color &&
	isEightBitInt(color.r) &&
	'g' in color &&
	isEightBitInt(color.g) &&
	'b' in color &&
	isEightBitInt(color.b)

const isEightBitInt = (value: unknown): value is number =>
	typeof value === 'number' && value >= 0 && value <= 255
