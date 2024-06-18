import assert from 'node:assert'
import { describe, test as it } from 'node:test'
import { mergeInstances } from './mergeInstances.js'

void describe('mergeInstances()', () => {
	void it('should merge an update', () => {
		const ts = Math.floor(Date.now() / 1000)
		const orig = {
			'14203/0': {
				ObjectID: 14203,
				ObjectVersion: '1.0',
				Resources: {
					'0': 'LTE-M GPS',
					'1': 20,
					'3': 33129,
					'4': 21679616,
					'5': 24201,
					'6': '10.244.190.21',
					'99': 1718721319,
				},
			},
		}
		const res = mergeInstances([
			{
				ObjectID: 14203,
				Resources: {
					'1': 21,
					'99': ts,
				},
			},
		])(orig)

		assert.deepEqual(res, {
			'14203/0': {
				ObjectID: 14203,
				ObjectVersion: '1.0',
				Resources: {
					'0': 'LTE-M GPS',
					'1': 21,
					'3': 33129,
					'4': 21679616,
					'5': 24201,
					'6': '10.244.190.21',
					'99': ts,
				},
			},
		})
		assert.equal(orig === res, false, 'should not mutate the original object')
	})
})
