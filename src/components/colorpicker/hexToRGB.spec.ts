import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { hexToRGB } from './hexToRGB.js'

void describe('hexToRGB', () => {
	void it('should convert a hex color to RGB', () => {
		const hex = '#FF0000'
		const rgb = { r: 255, g: 0, b: 0 }
		const result = hexToRGB(hex)
		assert.deepEqual(result, rgb)
	})

	void it('should handle lowercase hex color', () => {
		const hex = '#00ff00'
		const rgb = { r: 0, g: 255, b: 0 }
		const result = hexToRGB(hex)
		assert.deepEqual(result, rgb)
	})
})
