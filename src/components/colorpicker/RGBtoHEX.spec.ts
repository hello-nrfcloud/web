import { RGBtoHEX } from './RGBtoHEX.js'
import { describe, it } from 'node:test'
import assert from 'node:assert/strict'

void describe('RGBtoHEX', () => {
	void it('should convert a hex color to RGB', () => {
		const hex = '#ff0000'
		const rgb = { r: 255, g: 0, b: 0 }
		const result = RGBtoHEX(rgb)
		assert.deepEqual(result, hex)
	})
})
