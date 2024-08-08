import { isOff } from '#utils/isOff.js'
import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

void describe('isOff()', () => {
	void it('should return true if color is off', () => {
		const color = { r: 0, g: 0, b: 0 }
		const result = isOff(color)
		assert.equal(result, true)
	})

	void it('should return false if color is not off', () => {
		const color = { r: 255, g: 255, b: 255 }
		const result = isOff(color)
		assert.equal(result, false)
	})
})
