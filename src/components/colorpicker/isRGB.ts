import { isObject } from 'lodash-es'
import type { RGB } from './ColorPicker.js'

export const isRGB = (color: unknown): color is RGB =>
	isObject(color) && 'r' in color && 'b' in color && 'g' in color
