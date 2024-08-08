import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { format } from './format.js'

const { formatFloat, formatInt, formatDistance } = format('en-US')

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

void describe('formatDistance()', () => {
	void it('should format seconds', () => {
		assert.equal(formatDistance(14), '14 seconds')
	})
	void it('should format hours', () => {
		assert.equal(formatDistance(3600), '1 hour')
	})
	void it('should format hours with plural', () => {
		assert.equal(formatDistance(7200), '2 hours')
	})
})
