import { getItem, removeItem, setItem } from './localStorage.js'
import { describe, test as it } from 'node:test'
import assert from 'node:assert'

void describe('localStorage', () => {
	void it('should swallow calls when run server side', () => {
		assert.equal(setItem('foo', 'bar'), undefined)
		assert.equal(getItem('foo'), null)
		assert.equal(removeItem('foo'), undefined)
	})
})
