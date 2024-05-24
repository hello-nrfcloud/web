import {
	validate,
	validators,
	type LwM2MObjectInstance,
} from '@hello.nrfcloud.com/proto-map/lwm2m'

const validateInstance = validate(validators)

export const validPassthrough = (
	v: unknown,
	onDropped?: (v: unknown, error: Error) => unknown,
): LwM2MObjectInstance | null => {
	const maybeValidInstance = validateInstance(v)
	if ('error' in maybeValidInstance) {
		onDropped?.(v, maybeValidInstance.error)
		return null
	}
	return maybeValidInstance.object
}
