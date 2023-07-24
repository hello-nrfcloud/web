import { validPassthrough } from './validPassthrough.js'
import { describe, test as it, mock } from 'node:test'
import assert from 'node:assert'

void describe('validPassthrough', () => {
	void it('should let valid input pass', () => {
		const isValid = validPassthrough({
			'@context':
				'https://github.com/hello-nrfcloud/proto/transformed/PCA20035%2Bsolar/airHumidity',
			p: 23.16,
			ts: 1681985384511,
		})
		assert.deepEqual(isValid, {
			'@context':
				'https://github.com/hello-nrfcloud/proto/transformed/PCA20035%2Bsolar/airHumidity',
			p: 23.16,
			ts: 1681985384511,
		})
	})

	void it('should not let invalid input pass', () => {
		const onDropped = mock.fn()
		const isInvalid = validPassthrough({ temp: -42 } as any, onDropped)
		assert.equal(isInvalid, null)
		const call = onDropped.mock.calls[0]
		// input
		assert.deepEqual(call?.arguments[0], { temp: -42 })
		assert.deepEqual(call?.arguments[1][0], {
			instancePath: '',
			keyword: 'required',
			message: "must have required property '@context'",
			params: {
				missingProperty: '@context',
			},
			schemaPath: '#/anyOf/0/required',
		})
	})
})
