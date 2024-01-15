import { validateWithTypeBox } from '@hello.nrfcloud.com/proto'
import { IncomingMessage, type IncomingMessageType } from './proto.js'
import { type ValueError } from '@sinclair/typebox/compiler'

const validator = validateWithTypeBox(IncomingMessage)

export const validPassthrough = (
	v: unknown,
	onDropped?: (v: unknown, errors: ValueError[]) => unknown,
): IncomingMessageType | null => {
	const isValid = validator(v)
	if ('errors' in isValid) {
		onDropped?.(v, isValid.errors)
		return null
	}
	return isValid.value
}
