import { validateWithTypeBox } from '@hello.nrfcloud.com/proto'
import { Shadow } from '@hello.nrfcloud.com/proto/hello'
import assert from 'node:assert'
import { describe, test as it, mock } from 'node:test'
import shadow from './shadow.json'
import { validPassthrough } from './validPassthrough.js'

void describe('validPassthrough', () => {
	void it('should let valid input pass', () => {
		const isValid = validPassthrough({
			'@context': 'https://github.com/hello-nrfcloud/proto/deviceIdentity',
			model: 'PCA20035+solar',
			id: 'oob-352656108602296',
			lastSeen: '2024-05-23T12:27:19.400Z',
		})
		assert.deepEqual(isValid, {
			'@context': 'https://github.com/hello-nrfcloud/proto/deviceIdentity',
			model: 'PCA20035+solar',
			id: 'oob-352656108602296',
			lastSeen: '2024-05-23T12:27:19.400Z',
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
		assert.equal(Array.isArray(call?.arguments[1]), true)
	})

	void it('should validate a shadow document', () => {
		const v = validateWithTypeBox(Shadow)
		const maybeValidMessage = v(shadow)
		assert.equal('errors' in maybeValidMessage, false)

		const isValid = validPassthrough(shadow, console.error)
		assert.deepEqual(isValid, shadow)
	})
})
