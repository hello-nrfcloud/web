import { validPassthrough } from './validPassthrough.js'
import { describe, test as it, mock } from 'node:test'
import assert from 'node:assert'

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
})
