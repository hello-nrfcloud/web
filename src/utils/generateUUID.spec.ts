import assert from 'node:assert'
import { describe, test as it } from 'node:test'
import { generateUUID } from './generateUUID.ts'

void describe('generateUUID', () => {
	void it('should generate a random UUID', () => {
		assert.equal(generateUUID().length, 36)
		assert.notEqual(generateUUID(), generateUUID())
	})
})
