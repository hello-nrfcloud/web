import { validateWithTypeBox } from '@hello.nrfcloud.com/proto'
import {
	HistoricalDataResponse,
	HelloMessage,
} from '@hello.nrfcloud.com/proto/hello'
import { Type, type Static } from '@sinclair/typebox'
import type { ErrorObject } from 'ajv'

export const IncomingMessage = Type.Union([
	HelloMessage,
	HistoricalDataResponse,
])

const validator = validateWithTypeBox(IncomingMessage)

export const validPassthrough = (
	v: unknown,
	onDropped?: (v: unknown, errors: ErrorObject[]) => unknown,
):
	| Static<typeof HelloMessage>
	| Static<typeof HistoricalDataResponse>
	| null => {
	const isValid = validator(v)
	if ('errors' in isValid) {
		onDropped?.(v, isValid.errors)
		return null
	}
	return isValid.value
}
