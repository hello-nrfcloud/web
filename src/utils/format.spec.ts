import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { format } from './format.js'

const { formatFloat, formatInt } = format('en-US')

void describe('formatInt()', () => {
	void it('should format an integer', () => {
		assert.equal(formatInt(1234), '1,234')
	})
})

void describe('formatFloat()', () => {
	void it('should format a float', () => {
		assert.equal(formatFloat(1.234), '1.2')
	})
	void it('should format a float with custom number of digits', () => {
		assert.equal(formatFloat(1.234, 2), '1.23')
	})
})
