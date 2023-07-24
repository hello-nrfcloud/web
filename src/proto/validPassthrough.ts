import { validateWithTypeBox } from '@hello.nrfcloud.com/proto'
import { HelloMessage } from '@hello.nrfcloud.com/proto/hello'
import { type Static } from '@sinclair/typebox'
import type { ErrorObject } from 'ajv'

const validator = validateWithTypeBox(HelloMessage)

export const validPassthrough = (
	v: unknown,
	onDropped?: (v: unknown, errors: ErrorObject[]) => unknown,
): Static<typeof HelloMessage> | null => {
	const isValid = validator(v)
	if ('errors' in isValid) {
		onDropped?.(v, isValid.errors)
		return null
	}
	return isValid.value
}
