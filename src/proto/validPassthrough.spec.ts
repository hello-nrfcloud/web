import { validPassthrough } from './validPassthrough.js'
import { describe, test as it, mock } from 'node:test'
import assert from 'node:assert'
import { LwM2MObjectID } from '@hello.nrfcloud.com/proto-map/lwm2m'

void describe('validPassthrough', () => {
	void it('should let valid input pass', () => {
		const isValid = validPassthrough({
			ObjectID: LwM2MObjectID.Geolocation_14201,
			ObjectVersion: '1.0',
			Resources: {
				'0': 62.469414,
				'1': 6.151946,
				'6': 'Fixed',
				'3': 1,
				'99': new Date(1710147413003),
			},
		})
		assert.deepEqual(isValid, {
			ObjectID: LwM2MObjectID.Geolocation_14201,
			ObjectVersion: '1.0',
			Resources: {
				'0': 62.469414,
				'1': 6.151946,
				'6': 'Fixed',
				'3': 1,
				'99': new Date(1710147413003),
			},
		})
	})

	void it('should not let invalid input pass', () => {
		const onDropped = mock.fn()
		const isInvalid = validPassthrough({ temp: -42 } as any, onDropped)
		assert.equal(isInvalid, null)
		const call = onDropped.mock.calls[0]
		// input
		assert.deepEqual(call?.arguments[0], { temp: -42 })
		// Errors
		assert.equal(call?.arguments[1] instanceof Error, true)
	})
})
