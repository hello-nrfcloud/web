import { validateWithTypeBox } from '@hello.nrfcloud.com/proto'
import {
	DeviceIdentity,
	FOTAJob,
	LwM2MObjectUpdate,
	Shadow,
} from '@hello.nrfcloud.com/proto/hello'
import { Type, type Static } from '@sinclair/typebox'
import type { ValueError } from '@sinclair/typebox/errors'

const IncomingMessage = Type.Union([
	DeviceIdentity,
	Shadow,
	LwM2MObjectUpdate,
	FOTAJob,
])
type IncomingMessageType = Static<typeof IncomingMessage>
export const incomingMessageValidator = validateWithTypeBox(IncomingMessage)

export const validPassthrough = (
	v: unknown,
	onDropped?: (v: unknown, errors: Array<ValueError>) => unknown,
): IncomingMessageType | null => {
	const maybeValidMessage = incomingMessageValidator(v)
	if ('errors' in maybeValidMessage) {
		onDropped?.(v, maybeValidMessage.errors)
		return null
	}
	return maybeValidMessage.value
}
