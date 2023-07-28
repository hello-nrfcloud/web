import { generateUUID } from './generateUUID.js'
import { describe, test as it } from 'node:test'
import assert from 'node:assert'

void describe('generateUUID', () => {
	void it('should generate a random UUID', () => {
		assert.equal(generateUUID().length, 36)
		assert.notEqual(generateUUID(), generateUUID())
	})
})
