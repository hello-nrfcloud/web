import { encodeWeek } from './encodeWeek.ts'
import { generateCode } from './generateCode.ts'

export const generateFingerprint = (date?: Date): string =>
	`${encodeWeek(date)}.${generateCode()}`
