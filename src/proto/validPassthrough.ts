import { validateWithTypeBox } from '@hello.nrfcloud.com/proto'
import type { ErrorObject } from 'ajv'
import { IncomingMessage, type IncomingMessageType } from './proto.js'

const validator = validateWithTypeBox(IncomingMessage)

export const validPassthrough = (
	v: unknown,
	onDropped?: (v: unknown, errors: ErrorObject[]) => unknown,
): IncomingMessageType | null => {
	const isValid = validator(v)
	if ('errors' in isValid) {
		onDropped?.(v, isValid.errors)
		return null
	}
	return isValid.value
}
