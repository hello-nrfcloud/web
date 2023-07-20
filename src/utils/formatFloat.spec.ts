import { formatFloat } from './formatFloat.js'
import { describe, test as it } from 'node:test'
import assert from 'node:assert'

void describe('formatFloat', () => {
	void it('should nicely format floats', () =>
		assert.equal(formatFloat(4.762067631165049), '4.76'))

	void it('should cut off trailing slash', () =>
		assert.equal(formatFloat(4.0), '4'))
})
