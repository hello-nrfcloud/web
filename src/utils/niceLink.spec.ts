import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { niceLink } from './niceLink.js'
void describe('niceLink()', () => {
	void it('should format a link', () => {
		assert.equal(
			niceLink(
				'https://www.nordicsemi.com/Products/nRF9151/Download?lang=en#infotabs',
			),
			'www.nordicsemi.com/Products/nRF9151/Download',
		)
	})
})
