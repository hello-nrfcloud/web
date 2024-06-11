import { isRGB } from '#components/colorpicker/isRGB.js'
import { describe, it } from 'node:test'
import assert from 'node:assert/strict'

void describe('isRGB', () => {
	void it('should return true for valid RGB object', () => {
		const color = { r: 255, g: 0, b: 0 }
		assert.equal(isRGB(color), true)
	})

	void it('should return false for invalid RGB object', () => {
		const color = { r: 255, g: 0 } // Missing 'b' property
		assert.equal(isRGB(color), false)
	})

	void it('should return false for non-object input', () => {
		const color = 'rgb(255, 0, 0)'
		assert.equal(isRGB(color), false)
	})

	void it('should return false for null', () => {
		assert.equal(isRGB(null), false)
	})
})
