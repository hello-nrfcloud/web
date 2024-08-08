import assert from 'node:assert'
import { describe, test as it } from 'node:test'
import { mccmnc2country } from './mccmnc2country.js'

void describe('mccmnc2country()', () => {
	void it('should return the two-letter ISO 3661 country code for a given MCC/MNC combination', () =>
		assert.deepEqual(mccmnc2country(26202), {
			code: 'DE',
			name: 'Germany',
		}))
})
