import assert from 'node:assert'
import { describe, test as it } from 'node:test'
import { getItem, removeItem, setItem } from './localStorage.js'

void describe('localStorage', () => {
	void it('should swallow calls when run server side', () => {
		assert.equal(setItem('foo', 'bar'), undefined)
		assert.equal(getItem('foo'), null)
		assert.equal(removeItem('foo'), undefined)
	})
})
