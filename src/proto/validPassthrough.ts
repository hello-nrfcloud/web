import { validateWithTypeBox } from '@hello.nrfcloud.com/proto'
import { Thingy91WithSolarShieldMessage } from '@hello.nrfcloud.com/proto/hello/model/PCA20035+solar'
import { type Static } from '@sinclair/typebox'
import type { ErrorObject } from 'ajv'

const validator = validateWithTypeBox(Thingy91WithSolarShieldMessage)

export const validPassthrough = (
	v: unknown,
	onDropped?: (v: unknown, errors: ErrorObject[]) => unknown,
): Static<typeof Thingy91WithSolarShieldMessage> | null => {
	const isValid = validator(v)
	if ('errors' in isValid) {
		onDropped?.(v, isValid.errors)
		return null
	}
	return isValid.value
}
