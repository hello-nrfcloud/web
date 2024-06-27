import { encodeWeek } from './encodeWeek.js'
import { generateCode } from './generateCode.js'

export const generateFingerprint = (date?: Date): string =>
	`${encodeWeek(date)}.${generateCode()}`
